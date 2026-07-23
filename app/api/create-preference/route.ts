import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Valor da reserva (100% abatível no pedido final)
const RESERVA_VALOR = 28.9;

interface CreatePreferenceBody {
  reservaId?: string;
  plano?: string;
  difusor?: string;
  fragrancias?: string;
  origin?: string;
}

export async function POST(req: NextRequest) {
  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (!accessToken) {
    console.error('[MP] MERCADOPAGO_ACCESS_TOKEN não configurado');
    return NextResponse.json(
      { error: 'Pagamento não configurado no servidor.' },
      { status: 500 }
    );
  }

  let body: CreatePreferenceBody;
  try {
    body = (await req.json()) as CreatePreferenceBody;
  } catch {
    return NextResponse.json({ error: 'Requisição inválida.' }, { status: 400 });
  }

  const { reservaId, plano, difusor, fragrancias, origin } = body;
  if (!reservaId || !origin) {
    return NextResponse.json({ error: 'Dados incompletos.' }, { status: 400 });
  }

  const backUrl = `${origin}/reserva-confirmada?ref=${encodeURIComponent(reservaId)}`;

  const preference = {
    items: [
      {
        id: 'reserva-sinesia',
        title: `Reserva Sinesia — ${difusor || 'pré-lançamento'}`,
        description: 'Reserva do difusor Sinesia (valor abatível no pedido final).',
        quantity: 1,
        currency_id: 'BRL',
        unit_price: RESERVA_VALOR,
      },
    ],
    external_reference: String(reservaId),
    statement_descriptor: 'SINESIA',
    // Este caminho é só cartão — o Pix é feito embutido no site.
    // Exclui boleto e Pix da tela do Checkout Pro.
    payment_methods: {
      excluded_payment_types: [
        { id: 'ticket' },        // boleto
        { id: 'bank_transfer' }, // Pix
      ],
    },
    // Metadados usados pelo webhook para registrar a compra mesmo sem endereço
    metadata: {
      reserva_id: String(reservaId),
      plano: plano || '',
      difusor: difusor || '',
      fragrancias: fragrancias || '',
    },
    back_urls: {
      success: backUrl,
      failure: backUrl,
      pending: backUrl,
    },
    auto_return: 'approved',
    notification_url: `${origin}/api/mp-webhook`,
  };

  try {
    const res = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(preference),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error('[MP] Erro ao criar preferência:', JSON.stringify(data));
      const detalhe = data?.message || data?.error || (data?.cause?.[0]?.description) || 'erro do Mercado Pago';
      return NextResponse.json(
        { error: `Mercado Pago recusou: ${detalhe}`, detail: data },
        { status: 502 }
      );
    }

    return NextResponse.json({
      id: data.id,
      init_point: data.init_point,
      sandbox_init_point: data.sandbox_init_point,
    });
  } catch (err) {
    console.error('[MP] Exceção ao criar preferência:', err);
    return NextResponse.json({ error: 'Erro de comunicação com o Mercado Pago.' }, { status: 502 });
  }
}
