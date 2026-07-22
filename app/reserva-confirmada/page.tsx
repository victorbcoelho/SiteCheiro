'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { updateReservaStatus } from '@/lib/leads';
import { trackCommerceEvent } from '@/lib/analytics';

type Estado = 'loading' | 'aprovado' | 'pendente' | 'recusado';

function ReservaConfirmadaContent() {
  const params = useSearchParams();
  const [estado, setEstado] = useState<Estado>('loading');

  useEffect(() => {
    const ref = params.get('ref') || params.get('external_reference') || '';
    const status =
      params.get('status') || params.get('collection_status') || '';
    const paymentId = params.get('payment_id') || params.get('collection_id') || '';

    let resolvido: Estado;
    if (status === 'approved') resolvido = 'aprovado';
    else if (status === 'pending' || status === 'in_process') resolvido = 'pendente';
    else if (!status) resolvido = 'pendente';
    else resolvido = 'recusado';

    setEstado(resolvido);

    if (ref) {
      const novoStatus =
        resolvido === 'aprovado'
          ? 'pago'
          : resolvido === 'pendente'
          ? 'pagamento_pendente'
          : 'pagamento_recusado';
      updateReservaStatus(ref, { status: novoStatus, paymentId, mpStatus: status });
    }

    if (resolvido === 'aprovado') {
      trackCommerceEvent('Purchase', {
        contents: [{ contentId: 'reserva-sinesia', contentType: 'product', contentName: 'Reserva Sinesia' }],
        value: 28.9,
      });
      if (typeof window !== 'undefined' && typeof window.gtag_report_conversion === 'function') {
        window.gtag_report_conversion();
      }
    }
  }, [params]);

  return (
    <main className="min-h-screen bg-offwhite flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 md:p-10 max-w-md w-full shadow-xl text-center">
        {estado === 'loading' && (
          <p className="text-ink/50 text-sm py-10">Confirmando seu pagamento...</p>
        )}

        {estado === 'aprovado' && (
          <>
            <div className="text-5xl mb-4">🎉</div>
            <h1 className="font-serif text-3xl text-ink mb-3">Reserva confirmada!</h1>
            <p className="text-ink/60 text-sm leading-relaxed mb-4">
              Recebemos sua reserva. Guardamos seu Sinesia e vamos te avisar assim que
              seu pedido for enviado para o endereço cadastrado.
            </p>
            <div className="bg-sand/30 rounded-2xl p-4 text-sm text-ink/70 leading-relaxed mb-6 text-left">
              <p className="mb-1">✓ Valor de <strong>R$28,90 100% abatível</strong> no seu pedido final.</p>
              <p className="mb-1">✓ Você tem <strong>60 dias</strong> para desistir.</p>
              <p>✓ <strong>Reembolso total</strong>, sem burocracia.</p>
            </div>
            <Link
              href="/"
              className="inline-block bg-rust hover:bg-rustDark text-white rounded-xl px-8 py-3 font-medium transition-colors duration-300 text-sm"
            >
              Voltar ao site
            </Link>
          </>
        )}

        {estado === 'pendente' && (
          <>
            <div className="text-5xl mb-4">⏳</div>
            <h1 className="font-serif text-3xl text-ink mb-3">Pagamento em processamento</h1>
            <p className="text-ink/60 text-sm leading-relaxed mb-6">
              Seu pagamento (via Pix) está sendo confirmado. Assim que for aprovado,
              sua reserva estará garantida e você receberá a confirmação por e-mail.
            </p>
            <Link
              href="/"
              className="inline-block bg-rust hover:bg-rustDark text-white rounded-xl px-8 py-3 font-medium transition-colors duration-300 text-sm"
            >
              Voltar ao site
            </Link>
          </>
        )}

        {estado === 'recusado' && (
          <>
            <div className="text-5xl mb-4">😕</div>
            <h1 className="font-serif text-3xl text-ink mb-3">Pagamento não concluído</h1>
            <p className="text-ink/60 text-sm leading-relaxed mb-6">
              Não conseguimos confirmar seu pagamento. Nenhum valor foi cobrado.
              Você pode tentar novamente quando quiser.
            </p>
            <Link
              href="/starter-kit"
              className="inline-block bg-rust hover:bg-rustDark text-white rounded-xl px-8 py-3 font-medium transition-colors duration-300 text-sm"
            >
              Tentar novamente
            </Link>
          </>
        )}
      </div>
    </main>
  );
}

export default function ReservaConfirmadaPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-offwhite" />}>
      <ReservaConfirmadaContent />
    </Suspense>
  );
}
