import { NextRequest, NextResponse } from 'next/server';
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  limit,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { LeadPayload, LeadType } from '@/lib/types';

// Rota server-side (Node). Grava diretamente na collection `leads_lumance`
// do mesmo projeto Firebase da Sinesia. Nada é salvo em JSON local.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const COLLECTION = 'leads_lumance';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidType(t: unknown): t is LeadType {
  return t === 'waitlist' || t === 'reservation';
}

export async function POST(req: NextRequest) {
  let body: Partial<LeadPayload>;
  try {
    body = (await req.json()) as Partial<LeadPayload>;
  } catch {
    return NextResponse.json({ error: 'JSON inválido.' }, { status: 400 });
  }

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const whatsapp = typeof body.whatsapp === 'string' ? body.whatsapp.trim() : '';
  const type = body.type;

  // Validação de backend (o frontend também valida).
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'E-mail inválido.' }, { status: 400 });
  }
  if (!isValidType(type)) {
    return NextResponse.json({ error: 'Tipo de lead inválido.' }, { status: 400 });
  }

  if (!db) {
    // Firebase não configurado (ambiente sem env vars). Não falha o fake door:
    // devolve sucesso para não travar o usuário, mas sinaliza nos logs.
    console.warn('[lumance] Firestore não configurado — lead não persistido:', email);
    return NextResponse.json({ ok: true, persisted: false });
  }

  const wizard = body.wizard_responses ?? { step1: '', step2: '' };

  const doc = {
    email,
    ...(whatsapp ? { whatsapp } : {}),
    type,
    wizard_responses: {
      step1: typeof wizard.step1 === 'string' ? wizard.step1 : '',
      step2: typeof wizard.step2 === 'string' ? wizard.step2 : '',
    },
    ...(body.utm_source ? { utm_source: body.utm_source } : {}),
    ...(body.utm_medium ? { utm_medium: body.utm_medium } : {}),
    ...(body.utm_campaign ? { utm_campaign: body.utm_campaign } : {}),
    created_at: serverTimestamp(),
    source: 'lumance' as const,
  };

  try {
    const col = collection(db, COLLECTION);

    // Verifica duplicata de email antes de salvar.
    const existing = await getDocs(
      query(col, where('email', '==', email), limit(1)),
    );
    if (!existing.empty) {
      return NextResponse.json({ ok: true, duplicate: true });
    }

    await addDoc(col, doc);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[lumance] Erro ao gravar lead:', err);
    return NextResponse.json(
      { error: 'Não foi possível salvar agora. Tente novamente.' },
      { status: 500 },
    );
  }
}
