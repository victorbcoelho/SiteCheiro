import {
  addDoc,
  collection,
  doc,
  getCountFromServer,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { db } from './firebase';

export type LeadCollection = 'leads' | 'leads_b2b' | 'leads_b2c' | 'reservas';

export interface LeadPayload {
  nome: string;
  email: string;
  whatsapp?: string;
  plano?: string;
  origem: string;
}

export interface LeadB2BPayload {
  nome: string;
  empresa: string;
  segmento: string;
  pontos: string;
  whatsapp?: string;
  email: string;
  origem: string;
}

export type LeadData = Record<string, unknown>;

function saveToLocalStorage(collectionName: LeadCollection, data: LeadData) {
  try {
    const key = `sinesia_leads_${collectionName}`;
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    existing.push({ ...data, timestamp: new Date().toISOString() });
    localStorage.setItem(key, JSON.stringify(existing));
    console.warn(
      '[Sinesia] Firebase não configurado. Lead salvo localmente no navegador.',
      '\nPara exportar: localStorage.getItem("' + key + '")',
      data
    );
  } catch {
    console.error('[Sinesia] Falha ao salvar lead localmente.', data);
  }
}

export async function submitLead(
  collectionName: LeadCollection,
  data: LeadData
): Promise<string | null> {
  console.log('[Sinesia Lead] Tentando salvar lead...', { collectionName, data });

  if (!db) {
    console.warn('[Sinesia Lead] ❌ Firebase não conectado — salvando no localStorage');
    if (typeof window !== 'undefined') {
      saveToLocalStorage(collectionName, data);
    }
    return null;
  }

  try {
    const ref = await addDoc(collection(db, collectionName), {
      ...data,
      timestamp: serverTimestamp(),
    });
    console.log('[Sinesia Lead] ✅ Lead salvo no Firestore! ID:', ref.id);
    return ref.id;
  } catch (err) {
    console.error('[Sinesia Lead] ❌ Erro ao salvar no Firestore:', err);
    return null;
  }
}

// Atualiza o status de uma reserva (ex: após o retorno do Mercado Pago)
export async function updateReservaStatus(id: string, data: LeadData): Promise<void> {
  if (!db) return;
  try {
    await updateDoc(doc(db, 'reservas', id), {
      ...data,
      atualizadoEm: serverTimestamp(),
    });
    console.log('[Sinesia Reserva] ✅ Status atualizado:', id, data);
  } catch (err) {
    console.error('[Sinesia Reserva] ❌ Erro ao atualizar status:', err);
  }
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
