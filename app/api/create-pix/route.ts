import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const RESERVA_VALOR = 28.9;

interface CreatePixBody {
  reservaId?: string;
  email?: string;
  plano?: string;
  difusor?: string;
  fragrancias?: string;
  origin?: string;
}

export async function POST(req: NextRequest) {
  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (!accessToken) {
    return NextResponse.json({ error: 'Pagamento não configurado no servidor.' }, { status: 500 });
  }

  let body: CreatePixBody;
  try {
    body = (await req.json()) as CreatePixBody;
  } catch {
    return NextResponse.json({ error: 'Requisição inválida.' }, { status: 400 });
  }

  const { reservaId, email, plano, difusor, fragrancias, origin } = body;
  if (!reservaId || !email) {
    return NextResponse.json({ error: 'E-mail é obrigatório para gerar o Pix.' }, { status: 400 });
  }

  // QR expira em 30 minutos
  const expiration = new Date(Date.now() + 30 * 60 * 1000).toISOString();

  const payment = {
    transaction_amount: RESERVA_VALOR,
    description: `Reserva Sinesia — ${difusor || 'pré-lançamento'}`,
    payment_method_id: 'pix',
    date_of_expiration: expiration,
    payer: { email },
    external_reference: String(reservaId),
    ...(origin ? { notification_url: `${origin}/api/mp-webhook` } : {}),
    metadata: {
      reserva_id: String(reservaId),
      plano: plano || '',
      difusor: difusor || '',
      fragrancias: fragrancias || '',
    },
  };

  try {
    const res = await fetch('https://api.mercadopago.com/v1/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        'X-Idempotency-Key': crypto.randomUUID(),
      },
      body: JSON.stringify(payment),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error('[MP Pix] Erro ao criar pagamento:', data);
      return NextResponse.json(
        { error: 'Falha ao gerar o Pix.', detail: data?.message },
        { status: 502 }
      );
    }

    const td = data.point_of_interaction?.transaction_data;
    return NextResponse.json({
      paymentId: data.id,
      status: data.status,
      qrCode: td?.qr_code,
      qrCodeBase64: td?.qr_code_base64,
      ticketUrl: td?.ticket_url,
      expiration: data.date_of_expiration || expiration,
    });
  } catch (err) {
    console.error('[MP Pix] Exceção:', err);
    return NextResponse.json({ error: 'Erro de comunicação com o Mercado Pago.' }, { status: 502 });
  }
}
