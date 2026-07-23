import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Consultado pelo modal do Pix para saber quando o pagamento foi aprovado
export async function GET(req: NextRequest) {
  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
  const id = new URL(req.url).searchParams.get('id');

  if (!id || !accessToken) {
    return NextResponse.json({ status: 'unknown' }, { status: 200 });
  }

  try {
    const res = await fetch(`https://api.mercadopago.com/v1/payments/${id}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const data = await res.json();
    return NextResponse.json({ status: data.status || 'unknown' }, { status: 200 });
  } catch {
    return NextResponse.json({ status: 'unknown' }, { status: 200 });
  }
}
