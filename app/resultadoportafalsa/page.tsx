'use client';

import { useState, useEffect, Fragment } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { scents, diffuserModels } from '@/lib/products';

const SENHA = '112233@';

const EMAIL_ASSUNTO = 'Lembra da Sinesia? Chegou a hora (e tenho uma pergunta)';

function diffuserIdFromName(name?: string): string {
  return diffuserModels.find((d) => d.name === name)?.id || 'room';
}

function scentIdsFromNames(fragrancias?: string): string[] {
  if (!fragrancias) return [];
  return fragrancias
    .split(',')
    .map((n) => n.trim())
    .map((n) => scents.find((s) => s.name === n)?.id)
    .filter(Boolean) as string[];
}

function planoSlug(plano?: string): string {
  const p = (plano || '').toLowerCase();
  if (p.includes('promo')) return 'promocao';
  if (p.includes('compra') || p.includes('única') || p.includes('unica')) return 'compra_unica';
  return 'assinatura';
}

// Todos os leads recebem 50% de desconto de fundador
function promoFromDate(_ts?: { seconds: number }): string {
  return '50';
}

function buildLink(lead: Lead): string {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://sinesia.com.br';
  const e = scentIdsFromNames(lead.fragrancias);
  const params = new URLSearchParams({
    d: diffuserIdFromName(lead.difusor),
    plano: planoSlug(lead.plano),
    promo: promoFromDate(lead.timestamp),
  });
  if (e.length) params.set('e', e.join(','));
  return `${origin}/starter-kit?${params.toString()}`;
}

function buildEmailBody(lead: Lead): string {
  const primeiroNome = (lead.nome || '').trim().split(' ')[0] || '';
  const promo = promoFromDate(lead.timestamp);
  const link = buildLink(lead);
  return `Oi ${primeiroNome},

Aqui é o Victor, da Sinesia. Há algumas semanas você deixou seu e-mail pra ser avisado quando abríssemos as primeiras vagas — e eu queria te avisar pessoalmente que chegou a hora.

Estamos abrindo o primeiro lote, que é limitado. Você mantém os ${promo}% de desconto do acesso antecipado no seu primeiro kit, como combinado.

Pra garantir sua vaga é uma reserva de R$28,90, abatida integralmente do primeiro pagamento. O envio está previsto para até 60 dias, e o reembolso é total a qualquer momento — basta responder este e-mail.

${link}

E se você olhar e decidir não seguir, eu também quero saber: me responde em uma linha o que te fez desistir? Estamos construindo a Sinesia do zero e sua resposta vale muito pra mim.

Abraço,
Victor`;
}

function CopyBtn({ text, label }: { text: string; label: string }) {
  const [ok, setOk] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        setOk(true);
        setTimeout(() => setOk(false), 1500);
      }}
      className="text-xs bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg px-3 py-1.5 transition-colors"
    >
      {ok ? '✓ Copiado' : label}
    </button>
  );
}

interface Lead {
  id: string;
  nome?: string;
  email?: string;
  plano?: string;
  difusor?: string;
  fragrancias?: string;
  origem?: string;
  timestamp?: { seconds: number };
  [key: string]: unknown;
}

function formatDate(ts?: { seconds: number }) {
  if (!ts) return '—';
  return new Date(ts.seconds * 1000).toLocaleDateString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function Badge({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <span className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium ${color}`}>
      {children}
    </span>
  );
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [filtroOrigem, setFiltroOrigem] = useState('todos');
  const [filtroDifusor, setFiltroDifusor] = useState('todos');
  const [busca, setBusca] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (!authed) return;
    setLoading(true);
    async function fetchLeads() {
      if (!db) { setLoading(false); return; }
      const cols = ['leads_b2c', 'leads', 'leads_b2b'];
      const all: Lead[] = [];
      for (const col of cols) {
        const snap = await getDocs(collection(db, col));
        snap.forEach((doc) => all.push({ id: doc.id, _col: col, ...doc.data() } as Lead));
      }
      all.sort((a, b) => (b.timestamp?.seconds ?? 0) - (a.timestamp?.seconds ?? 0));
      setLeads(all);
      setLoading(false);
    }
    fetchLeads();
  }, [authed]);

  if (!authed) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="bg-zinc-900 rounded-2xl p-8 w-full max-w-sm shadow-2xl">
          <p className="text-white font-serif text-2xl mb-6 text-center">Acesso restrito</p>
          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => { setSenha(e.target.value); setErro(false); }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                if (senha === SENHA) setAuthed(true);
                else setErro(true);
              }
            }}
            className="w-full bg-zinc-800 text-white rounded-xl px-4 py-3 mb-3 outline-none border border-zinc-700 focus:border-zinc-400"
          />
          {erro && <p className="text-red-400 text-xs mb-3 text-center">Senha incorreta</p>}
          <button
            onClick={() => { if (senha === SENHA) setAuthed(true); else setErro(true); }}
            className="w-full bg-white text-zinc-900 font-medium rounded-xl py-3 hover:bg-zinc-100 transition-colors"
          >
            Entrar
          </button>
        </div>
      </div>
    );
  }

  // --- estatísticas ---
  const total = leads.length;

  const porPlano: Record<string, number> = {};
  leads.forEach((l) => {
    const p = l.plano || 'Sem plano';
    porPlano[p] = (porPlano[p] || 0) + 1;
  });

  const porDifusor: Record<string, { count: number; valor: number }> = {};
  leads.forEach((l) => {
    const d = (l.difusor as string) || 'Não informado';
    if (!porDifusor[d]) porDifusor[d] = { count: 0, valor: 0 };
    porDifusor[d].count += 1;
    const v = parseFloat((l.valor as string) || '0') || 0;
    porDifusor[d].valor += v;
  });

  const fragranciaCount: Record<string, number> = {};
  leads.forEach((l) => {
    if (!l.fragrancias) return;
    (l.fragrancias as string).split(',').forEach((f) => {
      const name = f.trim();
      if (name) fragranciaCount[name] = (fragranciaCount[name] || 0) + 1;
    });
  });
  const topFragrancias = Object.entries(fragranciaCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  const origens = ['todos', ...Array.from(new Set(leads.map((l) => (l.origem as string) || 'desconhecida')))];
  const difusores = ['todos', ...Array.from(new Set(leads.map((l) => (l.difusor as string) || 'Não informado')))];

  const filtrados = leads.filter((l) => {
    const matchOrigem = filtroOrigem === 'todos' || l.origem === filtroOrigem;
    const matchDifusor = filtroDifusor === 'todos' || (l.difusor as string) === filtroDifusor;
    const matchBusca =
      !busca ||
      (l.nome || '').toLowerCase().includes(busca.toLowerCase()) ||
      (l.email || '').toLowerCase().includes(busca.toLowerCase());
    return matchOrigem && matchDifusor && matchBusca;
  });

  const valorTotalDifusores = Object.values(porDifusor).reduce((s, d) => s + d.valor, 0);

  const planColors: Record<string, string> = {
    'plano_promocao': 'bg-amber-100 text-amber-800',
    'plano_assinatura': 'bg-blue-100 text-blue-800',
    'plano_compra_unica': 'bg-green-100 text-green-800',
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="font-serif text-3xl mb-1">Dashboard de Leads</h1>
        <p className="text-zinc-400 text-sm mb-8">Sinesia · dados em tempo real do Firestore</p>

        {loading ? (
          <p className="text-zinc-400">Carregando...</p>
        ) : (
          <>
            {/* Cards de resumo */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-zinc-900 rounded-2xl p-5">
                <p className="text-zinc-400 text-xs uppercase tracking-widest mb-1">Total de leads</p>
                <p className="text-4xl font-serif font-bold">{total}</p>
              </div>
              {Object.entries(porDifusor).sort((a, b) => b[1].count - a[1].count).map(([difusor, data]) => (
                <div key={difusor} className="bg-zinc-900 rounded-2xl p-5">
                  <p className="text-zinc-400 text-xs uppercase tracking-widest mb-1">{difusor}</p>
                  <p className="text-4xl font-serif font-bold">{data.count}</p>
                  <p className="text-zinc-500 text-xs mt-1">{Math.round((data.count / total) * 100)}% dos leads</p>
                  {data.valor > 0 && (
                    <p className="text-amber-400 text-xs mt-0.5 font-medium">
                      R$ {data.valor.toFixed(2).replace('.', ',')} potencial
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Planos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="bg-zinc-900 rounded-2xl p-5">
                <p className="text-zinc-400 text-xs uppercase tracking-widest mb-4">Planos escolhidos</p>
                {Object.entries(porPlano).sort((a, b) => b[1] - a[1]).map(([plano, count]) => (
                  <div key={plano} className="flex items-center justify-between mb-2">
                    <span className="text-sm text-zinc-300 truncate max-w-[70%]">{plano}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-zinc-800 rounded-full h-1.5">
                        <div className="bg-white h-1.5 rounded-full" style={{ width: `${Math.round((count / total) * 100)}%` }} />
                      </div>
                      <span className="text-white text-sm font-medium w-6 text-right">{count}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-zinc-900 rounded-2xl p-5">
                <p className="text-zinc-400 text-xs uppercase tracking-widest mb-4">Fragrâncias mais escolhidas</p>
                {topFragrancias.length === 0 && <p className="text-zinc-500 text-sm">Sem dados</p>}
                {topFragrancias.map(([nome, count]) => (
                  <div key={nome} className="flex items-center justify-between mb-2">
                    <span className="text-sm text-zinc-300 truncate max-w-[70%]">{nome}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-zinc-800 rounded-full h-1.5">
                        <div className="bg-amber-400 h-1.5 rounded-full" style={{ width: `${Math.round((count / total) * 100)}%` }} />
                      </div>
                      <span className="text-white text-sm font-medium w-6 text-right">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Filtros */}
            <div className="flex flex-wrap gap-3 mb-4">
              <input
                type="text"
                placeholder="Buscar por nome ou e-mail..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="bg-zinc-900 text-white rounded-xl px-4 py-2 text-sm outline-none border border-zinc-700 focus:border-zinc-400 w-64"
              />
              <select
                value={filtroOrigem}
                onChange={(e) => setFiltroOrigem(e.target.value)}
                className="bg-zinc-900 text-white rounded-xl px-4 py-2 text-sm outline-none border border-zinc-700"
              >
                {origens.map((o) => (
                  <option key={o} value={o}>{o === 'todos' ? 'Todas as origens' : o}</option>
                ))}
              </select>
              <select
                value={filtroDifusor}
                onChange={(e) => setFiltroDifusor(e.target.value)}
                className="bg-zinc-900 text-white rounded-xl px-4 py-2 text-sm outline-none border border-zinc-700"
              >
                {difusores.map((d) => (
                  <option key={d} value={d}>{d === 'todos' ? 'Todos os difusores' : d}</option>
                ))}
              </select>
              <span className="text-zinc-500 text-sm self-center">{filtrados.length} resultado(s)</span>
            </div>

            {/* Tabela */}
            <div className="bg-zinc-900 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-zinc-800 text-zinc-400 text-xs uppercase tracking-widest">
                      <th className="text-left px-5 py-3">Nome</th>
                      <th className="text-left px-5 py-3">E-mail</th>
                      <th className="text-left px-5 py-3">Plano</th>
                      <th className="text-left px-5 py-3">Difusor</th>
                      <th className="text-left px-5 py-3">Fragrâncias</th>
                      <th className="text-left px-5 py-3">Origem</th>
                      <th className="text-left px-5 py-3">Data</th>
                      <th className="text-left px-5 py-3">E-mail</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtrados.map((lead, i) => {
                      const aberto = expandedId === lead.id;
                      return (
                      <Fragment key={lead.id}>
                      <tr className={`border-b border-zinc-800/50 hover:bg-zinc-800/40 transition-colors ${i % 2 === 0 ? '' : 'bg-zinc-800/10'}`}>
                        <td className="px-5 py-3 font-medium">{lead.nome || '—'}</td>
                        <td className="px-5 py-3 text-zinc-300">{lead.email || '—'}</td>
                        <td className="px-5 py-3">
                          {lead.plano ? (
                            <Badge color={planColors[lead.plano] || 'bg-zinc-700 text-zinc-200'}>
                              {lead.plano}
                            </Badge>
                          ) : '—'}
                        </td>
                        <td className="px-5 py-3 text-zinc-300">{(lead.difusor as string) || '—'}</td>
                        <td className="px-5 py-3 text-zinc-400 text-xs max-w-[200px] truncate">{(lead.fragrancias as string) || '—'}</td>
                        <td className="px-5 py-3">
                          <Badge color="bg-zinc-700 text-zinc-200">{(lead.origem as string) || '—'}</Badge>
                        </td>
                        <td className="px-5 py-3 text-zinc-400 whitespace-nowrap">{formatDate(lead.timestamp)}</td>
                        <td className="px-5 py-3">
                          <button
                            onClick={() => setExpandedId(aberto ? null : lead.id)}
                            className="text-xs bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg px-3 py-1.5 whitespace-nowrap transition-colors"
                          >
                            {aberto ? '▲ Fechar' : '✉ E-mail'}
                          </button>
                        </td>
                      </tr>
                      {aberto && (
                        <tr className="bg-zinc-950/70">
                          <td colSpan={8} className="px-5 py-4">
                            <div className="max-w-3xl space-y-3">
                              <div className="flex flex-wrap gap-2">
                                <CopyBtn text={lead.email || ''} label="Copiar e-mail do destinatário" />
                                <CopyBtn text={EMAIL_ASSUNTO} label="Copiar assunto" />
                                <CopyBtn text={buildEmailBody(lead)} label="Copiar corpo do e-mail" />
                              </div>
                              <div>
                                <p className="text-zinc-500 text-[11px] uppercase tracking-widest mb-1">Destinatário</p>
                                <p className="text-zinc-200 text-sm">{lead.email || '—'}</p>
                              </div>
                              <div>
                                <p className="text-zinc-500 text-[11px] uppercase tracking-widest mb-1">Assunto</p>
                                <p className="text-zinc-200 text-sm">{EMAIL_ASSUNTO}</p>
                              </div>
                              <div>
                                <p className="text-zinc-500 text-[11px] uppercase tracking-widest mb-1">Corpo do e-mail</p>
                                <pre className="text-zinc-300 text-sm whitespace-pre-wrap font-sans bg-zinc-900 rounded-xl p-4 border border-zinc-800">{buildEmailBody(lead)}</pre>
                              </div>
                              <div>
                                <p className="text-zinc-500 text-[11px] uppercase tracking-widest mb-1">Link gerado (carrinho/pagamento + {promoFromDate(lead.timestamp)}% off)</p>
                                <a href={buildLink(lead)} target="_blank" rel="noreferrer" className="text-blue-400 text-xs break-all underline">
                                  {buildLink(lead)}
                                </a>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                      </Fragment>
                      );
                    })}
                    {filtrados.length === 0 && (
                      <tr><td colSpan={8} className="px-5 py-10 text-center text-zinc-500">Nenhum lead encontrado</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
