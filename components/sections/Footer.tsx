import Link from 'next/link';

const footerLinks = [
  { label: 'Starter Kit', href: '/#starter-kit' },
  { label: 'Tecnologia', href: '/#como-funciona' },
  { label: 'Fragrâncias', href: '/#fragrancias' },
  { label: 'Para Empresas', href: '/empresas' },
  { label: 'Sobre', href: '/sobre' },
  { label: 'Contato', href: 'mailto:oi@sinesia.com.br' },
  { label: 'Política de Privacidade', href: '/privacidade' },
];

export default function Footer() {
  return (
    <footer className="bg-ink text-white">
      <div className="container-page py-16 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <p className="font-serif text-2xl mb-4">Sinesia</p>
          <p className="text-sm text-white/60 max-w-xs">
            O primeiro ecossistema multissensorial do mundo que une Som + Aroma.
          </p>
        </div>

        <div>
          <p className="text-sm uppercase tracking-widest text-white/50 mb-4">
            Navegação
          </p>
          <ul className="space-y-2">
            {footerLinks.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className="text-sm text-white/70 hover:text-white transition-colors duration-300">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm uppercase tracking-widest text-white/50 mb-4">
            Redes sociais
          </p>
          <ul className="space-y-2">
            <li>
              <a
                href="https://instagram.com/use_sinesia"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-white/70 hover:text-white transition-colors duration-300"
              >
                Instagram
              </a>
            </li>
            <li>
              <a
                href="https://tiktok.com/@use_sinesia"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-white/70 hover:text-white transition-colors duration-300"
              >
                TikTok
              </a>
            </li>
            <li>
              <a
                href="mailto:oi@sinesia.com.br"
                className="text-sm text-white/70 hover:text-white transition-colors duration-300"
              >
                oi@sinesia.com.br
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-2 text-xs text-white/40">
          <span>© 2026 Sinesia — Todos os direitos reservados</span>
          <span>CNPJ 47.784.039/0001-00</span>
        </div>
      </div>
    </footer>
  );
}
