import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import SiteChrome from '@/components/sections/SiteChrome';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const SITE_URL = 'https://sopre.me';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Sopre.me — Difusor de aroma inteligente por assinatura',
    template: '%s | Sopre.me',
  },
  description:
    'O difusor inteligente que programa, alterna entre 2 aromas e repõe automaticamente. Tudo pelo app. Garanta sua vaga no pré-lançamento da Sopre.me.',
  keywords: [
    'difusor de aroma',
    'difusor inteligente',
    'aromatizador de ambiente',
    'assinatura de aroma',
    'home fragrance',
    'sopre.me',
  ],
  openGraph: {
    title: 'Sopre.me — Sua casa sempre cheirosa. Sem você lembrar de nada.',
    description:
      'O difusor inteligente que programa, alterna entre 2 aromas e repõe automaticamente.',
    url: SITE_URL,
    siteName: 'Sopre.me',
    locale: 'pt_BR',
    type: 'website',
    images: [
      {
        url: '/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'Sopre.me — Difusor de aroma inteligente',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sopre.me — Sua casa sempre cheirosa. Sem você lembrar de nada.',
    description:
      'O difusor inteligente que programa, alterna entre 2 aromas e repõe automaticamente.',
    images: ['/og-image.svg'],
  },
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;

  return (
    <html lang="pt-BR" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased bg-offwhite text-ink">
        <SiteChrome>{children}</SiteChrome>

        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">{`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}');
            `}</Script>
          </>
        )}

        {metaPixelId && (
          <>
            <script
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{
                __html: `
                  !function(f,b,e,v,n,t,s)
                  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                  n.queue=[];t=b.createElement(e);t.async=!0;
                  t.src=v;s=b.getElementsByTagName(e)[0];
                  s.parentNode.insertBefore(t,s)}(window, document,'script',
                  'https://connect.facebook.net/en_US/fbevents.js');
                  fbq('init', '${metaPixelId}');
                  fbq('track', 'PageView');
                `,
              }}
            />
          </>
        )}
      </body>
    </html>
  );
}
