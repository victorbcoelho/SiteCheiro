import {
  addDoc,
  collection,
  getCountFromServer,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';

export type LeadCollection = 'leads' | 'leads_b2b';

export interface LeadPayload {
  nome: string;
  email: string;
  whatsapp: string;
  plano: string;
  origem: string;
}

export interface LeadB2BPayload {
  nome: string;
  empresa: string;
  segmento: string;
  pontos: string;
  whatsapp: string;
  email: string;
  origem: string;
}

function saveToLocalStorage(
  collectionName: LeadCollection,
  data: LeadPayload | LeadB2BPayload
) {
  try {
    const key = `sopreme_leads_${collectionName}`;
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    existing.push({ ...data, timestamp: new Date().toISOString() });
    localStorage.setItem(key, JSON.stringify(existing));
    console.warn(
      '[Sopre.me] Firebase não configurado. Lead salvo localmente no navegador.',
      '\nPara exportar: localStorage.getItem("' + key + '")',
      data
    );
  } catch {
    console.error('[Sopre.me] Falha ao salvar lead localmente.', data);
  }
}

export async function submitLead(
  collectionName: LeadCollection,
  data: LeadPayload | LeadB2BPayload
) {
  if (!db) {
    if (typeof window !== 'undefined') {
      saveToLocalStorage(collectionName, data);
    }
    return;
  }

  await addDoc(collection(db, collectionName), {
    ...data,
    timestamp: serverTimestamp(),
  });
}

const BASE_LEAD_COUNT = 47;

export async function getLeadCount(): Promise<number> {
  if (!db) return BASE_LEAD_COUNT;
  try {
    const snapshot = await getCountFromServer(collection(db, 'leads'));
    return BASE_LEAD_COUNT + snapshot.data().count;
  } catch {
    return BASE_LEAD_COUNT;
  }
}
