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

export async function submitLead(
  collectionName: LeadCollection,
  data: LeadPayload | LeadB2BPayload
) {
  await addDoc(collection(db, collectionName), {
    ...data,
    timestamp: serverTimestamp(),
  });
}

const BASE_LEAD_COUNT = 47;

export async function getLeadCount(): Promise<number> {
  try {
    const snapshot = await getCountFromServer(collection(db, 'leads'));
    return BASE_LEAD_COUNT + snapshot.data().count;
  } catch {
    return BASE_LEAD_COUNT;
  }
}
