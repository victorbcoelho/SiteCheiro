'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { upsertReserva } from '@/lib/leads';
import { trackCommerceEvent } from '@/lib/analytics';

type Estado = 'loading' | 'aprovado' | 'pendente' | 'recusado';

function ReservaConfirmadaContent() {
  const params = useSearchParams();
  const [estado, setEstado] = useState<Estado>('loading');
  const [ref, setRef] = useState('');
  const disparado = useRef(false);

  // Campos de endereço (coletados só após aprovação)
  const [cep, setCep] = useState('');
  const [cidade, setCidade] = useState('');
  const [uf, setUf] = useState('');
  const [rua, setRua] = useState('');
  const [numero, setNumero] = useState('');
  const [complemento, setComplemento] = useState('');
  const [bairro, setBairro] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [enderecoSalvo, setEnderecoSalvo] = useState(false);

  useEffect(() => {
    if (disparado.current) return;
    disparado.current = true;

    const reservaRef = params.get('ref') || params.get('external_reference') || '';
    const status = params.get('status') || params.get('collection_status') || '';
    const paymentId = params.get('payment_id') || params.get('collection_id') || '';
    setRef(reservaRef);

    let resolvido: Estado;
    if (status === 'approved') resolvido = 'aprovado';
    else if (status === 'pending' || status === 'in_process') resolvido = 'pendente';
    else if (!status) resolvido = 'pendente';
    else resolvido = 'recusado';
    setEstado(resolvido);

    if (reservaRef) {
      const novoStatus =
        resolvido === 'aprovado' ? 'pago'
        : resolvido === 'pendente' ? 'pagamento_pendente'
        : 'pagamento_recusado';
      upsertReserva(reservaRef, { status: novoStatus, mp_status: status, mp_payment_id: paymentId });
    }

    if (resolvido === 'aprovado') {
      // Meta Pixel Purchase (value 28.90 BRL) + conversão Google Ads
      trackCommerceEvent('Purchase', {
        contents: [{ contentId: 'reserva-sinesia', contentType: 'product', contentName: 'Reserva Sinesia' }],
        value: 28.9,
      });
      if (typeof window !== 'undefined' && typeof window.gtag_report_conversion === 'function') {
        window.gtag_report_conversion();
      }
    }
  }, [params]);

  const handleCepBlur = async () => {
    const clean = cep.replace(/\D/g, '');
    if (clean.length !== 8) return;
    try {
      const res = await fetch(`https://viacep.com.br/ws/${clean}/json/`);
      const data = await res.json();
      if (!data.erro) {
        setRua(data.logradouro || '');
        setBairro(data.bairro || '');
        setCidade(data.localidade || '');
        setUf(data.uf || '');
      }
    } catch {
      /* silencioso */
    }
  };

  const handleSalvarEndereco = async (e: React.FormEvent) => {
    e.preventDefault();
    setSalvando(true);
    await upsertReserva(ref || `mp_${Date.now()}`, {
      cep,
      cidade,
      estado: uf,
      endereco: rua,
      numero,
      complemento,
      bairro,
      enderecoColetado: true,
    });
    setSalvando(false);
    setEnderecoSalvo(true);
  };

  const inputClass =
    'border border-sand rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rust transition-colors w-full';

  return (
    <main className="min-h-screen bg-offwhite flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 md:p-10 max-w-md w-full shadow-xl">
        {estado === 'loading' && (
          <p className="text-ink/50 text-sm py-10 text-center">Confirmando seu pagamento...</p>
        )}

        {estado === 'aprovado' && (
          <>
            <div className="text-center">
              <div className="text-5xl mb-4">🎉</div>
              <h1 className="font-serif text-3xl text-ink mb-3">Reserva confirmada!</h1>
            </div>

            {!enderecoSalvo ? (
              <>
                <p className="text-ink/60 text-sm leading-relaxed mb-5 text-center">
                  Sua vaga está garantida. Agora informe o endereço para onde vamos
                  enviar o seu Sinesia quando o lote for produzido.
                </p>
                <form onSubmit={handleSalvarEndereco} className="flex flex-col gap-3">
                  <div className="flex gap-3">
                    <input type="text" placeholder="CEP" value={cep}
                      onChange={(e) => setCep(e.target.value)} onBlur={handleCepBlur}
                      required className={`${inputClass} max-w-[130px]`} />
                    <input type="text" placeholder="Cidade" value={cidade}
                      onChange={(e) => setCidade(e.target.value)} required className={inputClass} />
                    <input type="text" placeholder="UF" value={uf}
                      onChange={(e) => setUf(e.target.value)} required maxLength={2}
                      className={`${inputClass} max-w-[70px]`} />
                  </div>
                  <input type="text" placeholder="Rua / logradouro" value={rua}
                    onChange={(e) => setRua(e.target.value)} required className={inputClass} />
                  <div className="flex gap-3">
                    <input type="text" placeholder="Número" value={numero}
                      onChange={(e) => setNumero(e.target.value)} required className={`${inputClass} max-w-[110px]`} />
                    <input type="text" placeholder="Complemento (opcional)" value={complemento}
                      onChange={(e) => setComplemento(e.target.value)} className={inputClass} />
                  </div>
                  <input type="text" placeholder="Bairro" value={bairro}
                    onChange={(e) => setBairro(e.target.value)} required className={inputClass} />
                  <button type="submit" disabled={salvando}
                    className="bg-rust hover:bg-rustDark disabled:opacity-60 text-white rounded-xl py-3.5 font-medium transition-colors duration-300 text-sm mt-1">
                    {salvando ? 'Salvando...' : 'Salvar endereço de entrega'}
                  </button>
                </form>
              </>
            ) : (
              <>
                <p className="text-ink/60 text-sm leading-relaxed mb-4 text-center">
                  Endereço salvo! Vamos te avisar por e-mail assim que seu pedido for enviado.
                </p>
                <div className="bg-sand/30 rounded-2xl p-4 text-sm text-ink/70 leading-relaxed mb-6 text-left">
                  <p className="mb-1">✓ Valor de <strong>R$28,90 100% abatível</strong> no seu pedido final.</p>
                  <p className="mb-1">✓ Envio previsto em até <strong>60 dias</strong>.</p>
                  <p>✓ <strong>Reembolso total</strong> a qualquer momento.</p>
                </div>
                <div className="text-center">
                  <Link href="/" className="inline-block bg-rust hover:bg-rustDark text-white rounded-xl px-8 py-3 font-medium transition-colors duration-300 text-sm">
                    Voltar ao site
                  </Link>
                </div>
              </>
            )}
          </>
        )}

        {estado === 'pendente' && (
          <div className="text-center">
            <div className="text-5xl mb-4">⏳</div>
            <h1 className="font-serif text-3xl text-ink mb-3">Pagamento em processamento</h1>
            <p className="text-ink/60 text-sm leading-relaxed mb-6">
              Seu pagamento (via Pix) está sendo confirmado. Assim que for aprovado,
              sua reserva estará garantida e você receberá a confirmação por e-mail
              com o link para informar seu endereço de entrega.
            </p>
            <Link href="/" className="inline-block bg-rust hover:bg-rustDark text-white rounded-xl px-8 py-3 font-medium transition-colors duration-300 text-sm">
              Voltar ao site
            </Link>
          </div>
        )}

        {estado === 'recusado' && (
          <div className="text-center">
            <div className="text-5xl mb-4">😕</div>
            <h1 className="font-serif text-3xl text-ink mb-3">Pagamento não concluído</h1>
            <p className="text-ink/60 text-sm leading-relaxed mb-6">
              Não conseguimos confirmar seu pagamento. Nenhum valor foi cobrado.
              Você pode tentar novamente quando quiser.
            </p>
            <Link href="/starter-kit" className="inline-block bg-rust hover:bg-rustDark text-white rounded-xl px-8 py-3 font-medium transition-colors duration-300 text-sm">
              Tentar novamente
            </Link>
          </div>
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
