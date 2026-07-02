'use client';

export interface UtmParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
}

const STORAGE_KEY = 'lumance_utm';

/**
 * Lê os parâmetros UTM da URL atual. Se não houver na URL, tenta recuperar
 * de uma leitura anterior salva em sessionStorage (o usuário pode ter
 * chegado pelo anúncio e navegado para outra seção).
 */
export function captureUtm(): UtmParams {
  if (typeof window === 'undefined') return {};

  const params = new URLSearchParams(window.location.search);
  const fromUrl: UtmParams = {};

  const source = params.get('utm_source');
  const medium = params.get('utm_medium');
  const campaign = params.get('utm_campaign');

  if (source) fromUrl.utm_source = source;
  if (medium) fromUrl.utm_medium = medium;
  if (campaign) fromUrl.utm_campaign = campaign;

  if (Object.keys(fromUrl).length > 0) {
    try {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(fromUrl));
    } catch {
      // sessionStorage indisponível (modo privado) — segue sem persistir.
    }
    return fromUrl;
  }

  try {
    const stored = window.sessionStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored) as UtmParams;
  } catch {
    // ignora
  }

  return {};
}
