import Link from 'next/link';

const footerLinks = [
  { label: 'Como funciona', href: '/#como-funciona' },
  { label: 'Planos', href: '/#planos' },
  { label: 'Fragrâncias', href: '/#fragrancias' },
  { label: 'Para Empresas', href: '/empresas' },
  { label: 'FAQ', href: '/#faq' },
  { label: 'Contato', href: 'mailto:oi@sopre.me' },
];

export default function Footer() {
  return (
    <footer className="bg-ink text-white">
      <div className="container-page py-16 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <p className="font-serif text-2xl mb-4">sopre.me</p>
          <p className="text-sm text-white/60 max-w-xs">
            O difusor inteligente que cuida do cheiro da sua casa para você não
            precisar.
          </p>
        </div>

        <div>
          <p className="text-sm uppercase tracking-widest text-white/50 mb-4">
            Navegação
          </p>
          <ul className="space-y-2">
            {footerLinks.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className="text-sm text-white/70 hover:text-white">
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
                href="https://instagram.com/sopre.me"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-white/70 hover:text-white"
              >
                Instagram
              </a>
            </li>
            <li>
              <a
                href="https://tiktok.com/@sopre.me"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-white/70 hover:text-white"
              >
                TikTok
              </a>
            </li>
            <li>
              <a
                href="mailto:oi@sopre.me"
                className="text-sm text-white/70 hover:text-white"
              >
                oi@sopre.me
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page py-6 text-xs text-white/40">
          © 2026 Sopre.me — Todos os direitos reservados
        </div>
      </div>
    </footer>
  );
}
