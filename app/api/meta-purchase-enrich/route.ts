import { NextRequest, NextResponse } from 'next/server';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { sendMetaPurchase } from '@/lib/meta';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Reenvia o Purchase à Meta (CAPI) com nome + endereço (hash) DEPOIS que a
// pessoa preenche o endereço na tela de sucesso. Sem atrito: usa dados que ela
// já digitou para o envio. Mesmo event_id do webhook → deduplicado (não conta 2x).
export async function POST(req: NextRequest) {
  try {
    const { ref, paymentId } = (await req.json()) as { ref?: string; paymentId?: string };
    if (!ref || !db) return NextResponse.json({ ok: true }, { status: 200 });

    const snap = await getDoc(doc(db, 'reservas', ref));
    if (!snap.exists()) return NextResponse.json({ ok: true }, { status: 200 });
    const d = snap.data();

    await sendMetaPurchase({
      email: d.email,
      nome: d.nome,
      cidade: d.cidade,
      estado: d.estado,
      cep: d.cep,
      country: 'br',
      fbp: d.fbp,
      fbc: d.fbc,
      userAgent: d.userAgent,
      eventSourceUrl: d.sourceUrl,
      value: 28.9,
      eventId: paymentId ? `mp_${paymentId}` : (d.mp_payment_id ? `mp_${d.mp_payment_id}` : `ref_${ref}`),
    });

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    console.error('[Meta enrich] erro:', err);
    return NextResponse.json({ ok: true }, { status: 200 });
  }
}
