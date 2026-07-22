import { NextRequest, NextResponse } from 'next/server';
import { upsertReserva } from '@/lib/leads';

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

    await upsertReserva(reservaId, {
      status: mapStatus(pay.status),
      mp_status: pay.status,
      mp_payment_id: String(paymentId),
      credito: 28.9,
      valorPago: pay.transaction_amount ?? 28.9,
      email: pay.payer?.email || '',
      metodoPagamento: pay.payment_type_id || '',
      plano: metadata.plano || undefined,
      difusor: metadata.difusor || undefined,
      fragrancias: metadata.fragrancias || undefined,
    });

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
