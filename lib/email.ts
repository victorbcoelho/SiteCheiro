// Envio de e-mail de confirmação da reserva via Resend (opcional).
// Ativado apenas se RESEND_API_KEY estiver configurado.
export async function sendReservaEmail(params: {
  to: string;
  difusor?: string;
  plano?: string;
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM || 'Sinesia <oi@sinesia.com.br>';
  if (!apiKey || !params.to) return; // não configurado — ignora

  const html = `
    <div style="font-family: -apple-system, Segoe UI, Roboto, sans-serif; max-width: 480px; margin: 0 auto; color: #2b2723;">
      <h1 style="font-size: 22px;">Sua reserva Sinesia está confirmada 🎉</h1>
      <p style="color: #5c554d; line-height: 1.6;">
        Recebemos o pagamento da sua reserva de <strong>R$28,90</strong> — valor 100%
        abatível do seu primeiro pedido.
      </p>
      ${params.difusor ? `<p style="color:#5c554d;">Produto: <strong>${params.difusor}</strong>${params.plano ? ` · ${params.plano}` : ''}</p>` : ''}
      <ul style="color: #5c554d; line-height: 1.8;">
        <li>✓ Sua vaga no primeiro lote está garantida</li>
        <li>✓ Envio previsto em até 60 dias</li>
        <li>✓ Reembolso total a qualquer momento</li>
      </ul>
      <p style="color: #5c554d; line-height: 1.6;">
        Em breve entraremos em contato com os próximos passos. Qualquer dúvida,
        é só responder este e-mail.
      </p>
      <p style="color: #9a938a; font-size: 12px; margin-top: 24px;">Equipe Sinesia</p>
    </div>
  `;

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from,
        to: params.to,
        subject: 'Sua reserva Sinesia está confirmada 🎉',
        html,
      }),
    });
    if (!res.ok) {
      console.error('[Resend] Falha ao enviar e-mail:', res.status, await res.text());
    } else {
      console.log('[Resend] ✅ E-mail de confirmação enviado para', params.to);
    }
  } catch (err) {
    console.error('[Resend] Exceção:', err);
  }
}
