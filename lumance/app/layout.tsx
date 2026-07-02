import type { Metadata } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import './globals.css';
import AnalyticsScripts from '@/components/AnalyticsScripts';

const serif = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-serif',
  display: 'swap',
});

const sans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const SITE_URL = 'https://lumance.com.br';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Lûmance — Luz que cuida da sua pele em casa',
  description:
    'Máscara de luz LED de nível profissional para usar em casa. Firmeza, uniformidade e uma pele mais tranquila em 10 minutos por dia. Entre na lista de pré-lançamento.',
  keywords: [
    'máscara de luz LED',
    'terapia de luz',
    'skincare',
    'colágeno',
    'Lûmance',
  ],
  openGraph: {
    title: 'Lûmance — Luz que cuida da sua pele em casa',
    description:
      'Máscara de luz LED de nível profissional para usar em casa. Entre na lista de pré-lançamento.',
    url: SITE_URL,
    siteName: 'Lûmance',
    locale: 'pt_BR',
    type: 'website',
    images: [{ url: '/og-image.svg', width: 1200, height: 630, alt: 'Lûmance' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lûmance — Luz que cuida da sua pele em casa',
    description: 'Máscara de luz LED de nível profissional para usar em casa.',
    images: ['/og-image.svg'],
  },
  icons: { icon: '/favicon.svg' },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${serif.variable} ${sans.variable}`}>
      <body>
        {children}
        <AnalyticsScripts />
      </body>
    </html>
  );
}
