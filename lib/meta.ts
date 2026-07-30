import crypto from 'crypto';

function sha256(value: string): string {
  return crypto.createHash('sha256').update(value.trim().toLowerCase()).digest('hex');
}

// Envia o evento Purchase para a Meta via Conversions API (server-side).
// Garante o registro da venda mesmo quando o navegador não dispara o pixel
// (ex.: Pix aprovado sem a pessoa voltar ao site). Deduplicado pelo eventId.
export async function sendMetaPurchase(params: {
  email?: string;
  fbp?: string;
  fbc?: string;
  userAgent?: string;
  clientIp?: string;
  value: number;
  eventId: string;
  eventSourceUrl?: string;
}): Promise<void> {
  const pixelId = process.env.META_PIXEL_ID || process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const token = process.env.META_CAPI_TOKEN;
  if (!pixelId || !token) return; // não configurado — ignora silenciosamente

  // fbp, fbc, client_user_agent e client_ip_address vão SEM hash (só PII é hasheada).
  // São as chaves de correspondência de alta prioridade que melhoram o EMQ.
  const body = {
    data: [
      {
        event_name: 'Purchase',
        event_time: Math.floor(Date.now() / 1000),
        event_id: params.eventId,
        action_source: 'website',
        ...(params.eventSourceUrl ? { event_source_url: params.eventSourceUrl } : {}),
        user_data: {
          ...(params.email ? { em: [sha256(params.email)] } : {}),
          ...(params.fbp ? { fbp: params.fbp } : {}),
          ...(params.fbc ? { fbc: params.fbc } : {}),
          ...(params.userAgent ? { client_user_agent: params.userAgent } : {}),
          ...(params.clientIp ? { client_ip_address: params.clientIp } : {}),
        },
        custom_data: {
          currency: 'BRL',
          value: params.value,
        },
      },
    ],
  };

  try {
    const res = await fetch(
      `https://graph.facebook.com/v19.0/${pixelId}/events?access_token=${token}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }
    );
    if (!res.ok) {
      const err = await res.text();
      console.error('[Meta CAPI] Falha ao enviar Purchase:', res.status, err);
    } else {
      console.log('[Meta CAPI] ✅ Purchase enviado', params.eventId);
    }
  } catch (err) {
    console.error('[Meta CAPI] Exceção:', err);
  }
}
