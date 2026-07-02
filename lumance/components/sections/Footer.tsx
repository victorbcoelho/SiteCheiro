import Link from 'next/link';

const CONTACT_EMAIL = 'oi@lumance.com.br';

function Social({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <a
      href="#"
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-offwhite/20 text-offwhite/70 transition-colors hover:border-offwhite hover:text-offwhite"
    >
      {children}
    </a>
  );
}

export default function Footer() {
  return (
    <footer className="bg-ink text-offwhite">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <span className="font-serif text-2xl font-semibold">Lûmance</span>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-offwhite/60">
              Terapia de luz de nível profissional para o seu ritual em casa.
              Mais colágeno, menos manchas, mais presença.
            </p>
            <div className="mt-6 flex gap-3">
              <Social label="Instagram">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="0.9" fill="currentColor" stroke="none" />
                </svg>
              </Social>
              <Social label="TikTok">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                  <path d="M16 3c.3 2 1.6 3.6 3.6 3.9v2.5c-1.3 0-2.5-.4-3.6-1v5.9a5.7 5.7 0 1 1-5.7-5.7c.3 0 .6 0 .9.1v2.6a3.1 3.1 0 1 0 2.2 3V3H16Z" />
                </svg>
              </Social>
            </div>
          </div>

          <nav className="text-sm">
            <p className="mb-4 text-xs uppercase tracking-[0.2em] text-offwhite/40">
              Navegação
            </p>
            <ul className="space-y-3 text-offwhite/70">
              <li><Link href="/sobre" className="hover:text-offwhite">Sobre</Link></li>
              <li><Link href="/termos" className="hover:text-offwhite">Termos de Uso</Link></li>
              <li><Link href="/privacidade" className="hover:text-offwhite">Política de Privacidade</Link></li>
            </ul>
          </nav>

          <div className="text-sm">
            <p className="mb-4 text-xs uppercase tracking-[0.2em] text-offwhite/40">
              Contato
            </p>
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-offwhite/70 hover:text-offwhite">
              {CONTACT_EMAIL}
            </a>
            <div className="mt-6 flex flex-wrap gap-2" aria-label="Meios de pagamento">
              {['Visa', 'Master', 'Pix', 'Boleto'].map((p) => (
                <span
                  key={p}
                  className="rounded border border-offwhite/20 px-2.5 py-1 text-[11px] text-offwhite/50"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-offwhite/10 pt-8 text-xs text-offwhite/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Lûmance. Todos os direitos reservados.</p>
          <p>CNPJ 00.000.000/0001-00 · Lûmance Cosméticos Ltda.</p>
        </div>
      </div>
    </footer>
  );
}
