import { NextRequest, NextResponse } from 'next/server';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { upsertReserva } from '@/lib/leads';
import { sendReservaEmail } from '@/lib/email';
import { sendMetaPurchase } from '@/lib/meta';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Mapeia o status do Mercado Pago para o status interno usado na UI
function mapStatus(mpStatus: string): string {
  switch (mpStatus) {
    case 'approved':
      return 'pago';
    case 'pending':
    case 'in_process':
    case 'authorized':
      return 'pagamento_pendente';
    default:
      return 'pagamento_recusado';
  }
}

export async function POST(req: NextRequest) {
  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;

  try {
    // O Mercado Pago envia o id ora no corpo, ora na query string.
    let paymentId = '';
    let topic = '';

    const url = new URL(req.url);
    topic = url.searchParams.get('type') || url.searchParams.get('topic') || '';
    paymentId = url.searchParams.get('data.id') || url.searchParams.get('id') || '';

    try {
      const body = await req.json();
      topic = topic || body?.type || body?.topic || '';
      paymentId = paymentId || body?.data?.id || body?.resource || '';
    } catch {
      /* corpo pode vir vazio — ok */
    }

    // Só nos interessa notificação de pagamento
    if (topic && topic !== 'payment') {
      return NextResponse.json({ ignored: true }, { status: 200 });
    }
    if (!paymentId || !accessToken) {
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    // Busca os detalhes do pagamento no Mercado Pago
    const res = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!res.ok) {
      console.error('[MP webhook] Falha ao buscar pagamento', paymentId, res.status);
      // 200 mesmo assim para o MP não ficar reenviando indefinidamente
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    const pay = await res.json();
    const metadata = pay.metadata || {};
    const reservaId: string =
      pay.external_reference || metadata.reserva_id || `mp_${paymentId}`;
    // Lê o doc: e-mail real, sinais Meta e travas de "já enviado" (idempotência).
    // Travas dedicadas (não usar status 'pago', que a tela de sucesso também seta).
    let capiJaEnviado = false;
    let emailJaEnviado = false;
    let emailReal = '';
    let sinais: { fbp?: string; fbc?: string; userAgent?: string; sourceUrl?: string } = {};
    if (db) {
      try {
        const snap = await getDoc(doc(db, 'reservas', reservaId));
        if (snap.exists()) {
          const d = snap.data();
          capiJaEnviado = d?.metaCapiSent === true;
          emailJaEnviado = d?.emailSent === true;
          emailReal = (d?.email as string) || '';
          sinais = {
            fbp: d?.fbp as string | undefined,
            fbc: d?.fbc as string | undefined,
            userAgent: d?.userAgent as string | undefined,
            sourceUrl: d?.sourceUrl as string | undefined,
          };
        }
      } catch { /* ignora */ }
    }

    const aprovado = pay.status === 'approved';

    // NÃO sobrescrever o e-mail: o Mercado Pago retorna mascarado (XXXX) na API.
    // O e-mail real é o que a pessoa digitou no modal (já salvo no doc).
    await upsertReserva(reservaId, {
      status: mapStatus(pay.status),
      mp_status: pay.status,
      mp_status_detail: pay.status_detail || '',
      mp_payment_id: String(paymentId),
      credito: 28.9,
      valorPago: pay.transaction_amount ?? 28.9,
      metodoPagamento: pay.payment_type_id || '',
      plano: metadata.plano || undefined,
      difusor: metadata.difusor || undefined,
      fragrancias: metadata.fragrancias || undefined,
      // marca como enviado ANTES de enviar (evita duplicar em reenvios do MP)
      ...(aprovado && !capiJaEnviado ? { metaCapiSent: true } : {}),
      ...(aprovado && !emailJaEnviado ? { emailSent: true } : {}),
    });

    // Na aprovação, SEMPRE avisa a Meta (independe de endereço / do usuário voltar).
    // event_id igual ao do pixel/enriquecimento → deduplicado, não conta 2x.
    if (aprovado) {
      const tarefas: Promise<void>[] = [];
      if (!emailJaEnviado) {
        tarefas.push(sendReservaEmail({ to: emailReal, difusor: metadata.difusor, plano: metadata.plano }));
      }
      if (!capiJaEnviado) {
        tarefas.push(sendMetaPurchase({
          email: emailReal,
          fbp: sinais.fbp,
          fbc: sinais.fbc,
          userAgent: sinais.userAgent,
          eventSourceUrl: sinais.sourceUrl,
          value: pay.transaction_amount ?? 28.9,
          eventId: `mp_${paymentId}`,
        }));
      }
      await Promise.all(tarefas);
    }

    console.log('[MP webhook] ✅ Reserva atualizada', reservaId, pay.status);
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    console.error('[MP webhook] Exceção:', err);
    // Sempre 200 para evitar reenvios em loop
    return NextResponse.json({ ok: true }, { status: 200 });
  }
}

// O Mercado Pago às vezes valida a URL com um GET
export async function GET() {
  return NextResponse.json({ ok: true }, { status: 200 });
}
