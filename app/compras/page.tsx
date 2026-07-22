'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const SENHA = '112233@';

interface Reserva {
  id: string;
  nome?: string;
  email?: string;
  cep?: string;
  endereco?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  plano?: string;
  difusor?: string;
  fragrancias?: string;
  valorReserva?: number;
  status?: string;
  paymentId?: string;
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

const statusInfo: Record<string, { label: string; color: string }> = {
  pago: { label: 'Pago', color: 'bg-green-100 text-green-800' },
  pendente: { label: 'Pendente', color: 'bg-zinc-200 text-zinc-700' },
  pagamento_pendente: { label: 'Pagamento pendente', color: 'bg-amber-100 text-amber-800' },
  pagamento_recusado: { label: 'Recusado', color: 'bg-red-100 text-red-800' },
};

function Badge({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <span className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium ${color}`}>
      {children}
    </span>
  );
}

export default function ComprasPage() {
  const [authed, setAuthed] = useState(false);
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState(false);
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(false);
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [busca, setBusca] = useState('');

  useEffect(() => {
    if (!authed) return;
    setLoading(true);
    async function fetchReservas() {
      if (!db) { setLoading(false); return; }
      const snap = await getDocs(collection(db, 'reservas'));
      const all: Reserva[] = [];
      snap.forEach((doc) => all.push({ id: doc.id, ...doc.data() } as Reserva));
      all.sort((a, b) => (b.timestamp?.seconds ?? 0) - (a.timestamp?.seconds ?? 0));
      setReservas(all);
      setLoading(false);
    }
    fetchReservas();
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
  const total = reservas.length;
  const pagas = reservas.filter((r) => r.status === 'pago').length;
  const pendentes = reservas.filter((r) => r.status === 'pendente' || r.status === 'pagamento_pendente').length;
  const receita = reservas
    .filter((r) => r.status === 'pago')
    .reduce((s, r) => s + (Number(r.valorReserva) || 28.9), 0);

  const filtradas = reservas.filter((r) => {
    const matchStatus = filtroStatus === 'todos' || r.status === filtroStatus;
    const matchBusca =
      !busca ||
      (r.nome || '').toLowerCase().includes(busca.toLowerCase()) ||
      (r.email || '').toLowerCase().includes(busca.toLowerCase());
    return matchStatus && matchBusca;
  });

  const enderecoCompleto = (r: Reserva) => {
    const linha1 = [r.endereco, r.numero].filter(Boolean).join(', ');
    const linha2 = [r.complemento, r.bairro].filter(Boolean).join(' · ');
    const linha3 = [r.cidade, r.estado].filter(Boolean).join('/');
    return [linha1, linha2, linha3, r.cep].filter(Boolean).join(' — ');
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="font-serif text-3xl mb-1">Compras / Reservas</h1>
        <p className="text-zinc-400 text-sm mb-8">Sinesia · dados dos compradores em tempo real</p>

        {loading ? (
          <p className="text-zinc-400">Carregando...</p>
        ) : (
          <>
            {/* Cards de resumo */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-zinc-900 rounded-2xl p-5">
                <p className="text-zinc-400 text-xs uppercase tracking-widest mb-1">Total de reservas</p>
                <p className="text-4xl font-serif font-bold">{total}</p>
              </div>
              <div className="bg-zinc-900 rounded-2xl p-5">
                <p className="text-zinc-400 text-xs uppercase tracking-widest mb-1">Pagas</p>
                <p className="text-4xl font-serif font-bold text-green-400">{pagas}</p>
              </div>
              <div className="bg-zinc-900 rounded-2xl p-5">
                <p className="text-zinc-400 text-xs uppercase tracking-widest mb-1">Pendentes</p>
                <p className="text-4xl font-serif font-bold text-amber-400">{pendentes}</p>
              </div>
              <div className="bg-zinc-900 rounded-2xl p-5">
                <p className="text-zinc-400 text-xs uppercase tracking-widest mb-1">Receita (pagas)</p>
                <p className="text-4xl font-serif font-bold text-green-400">
                  R$ {receita.toFixed(2).replace('.', ',')}
                </p>
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
                value={filtroStatus}
                onChange={(e) => setFiltroStatus(e.target.value)}
                className="bg-zinc-900 text-white rounded-xl px-4 py-2 text-sm outline-none border border-zinc-700"
              >
                <option value="todos">Todos os status</option>
                <option value="pago">Pago</option>
                <option value="pagamento_pendente">Pagamento pendente</option>
                <option value="pendente">Pendente (sem retorno)</option>
                <option value="pagamento_recusado">Recusado</option>
              </select>
              <span className="text-zinc-500 text-sm self-center">{filtradas.length} resultado(s)</span>
            </div>

            {/* Tabela */}
            <div className="bg-zinc-900 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-zinc-800 text-zinc-400 text-xs uppercase tracking-widest">
                      <th className="text-left px-5 py-3">Status</th>
                      <th className="text-left px-5 py-3">Nome</th>
                      <th className="text-left px-5 py-3">E-mail</th>
                      <th className="text-left px-5 py-3">Endereço de entrega</th>
                      <th className="text-left px-5 py-3">Plano</th>
                      <th className="text-left px-5 py-3">Difusor</th>
                      <th className="text-left px-5 py-3">Fragrâncias</th>
                      <th className="text-left px-5 py-3">Data</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtradas.map((r, i) => {
                      const st = statusInfo[r.status || 'pendente'] || { label: r.status || '—', color: 'bg-zinc-700 text-zinc-200' };
                      return (
                        <tr key={r.id} className={`border-b border-zinc-800/50 hover:bg-zinc-800/40 transition-colors ${i % 2 === 0 ? '' : 'bg-zinc-800/10'}`}>
                          <td className="px-5 py-3"><Badge color={st.color}>{st.label}</Badge></td>
                          <td className="px-5 py-3 font-medium whitespace-nowrap">{r.nome || '—'}</td>
                          <td className="px-5 py-3 text-zinc-300">{r.email || '—'}</td>
                          <td className="px-5 py-3 text-zinc-400 text-xs max-w-[280px]">{enderecoCompleto(r) || '—'}</td>
                          <td className="px-5 py-3 text-zinc-300 text-xs">{r.plano || '—'}</td>
                          <td className="px-5 py-3 text-zinc-300 whitespace-nowrap">{r.difusor || '—'}</td>
                          <td className="px-5 py-3 text-zinc-400 text-xs max-w-[180px] truncate">{r.fragrancias || '—'}</td>
                          <td className="px-5 py-3 text-zinc-400 whitespace-nowrap">{formatDate(r.timestamp)}</td>
                        </tr>
                      );
                    })}
                    {filtradas.length === 0 && (
                      <tr><td colSpan={8} className="px-5 py-10 text-center text-zinc-500">Nenhuma reserva encontrada</td></tr>
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
