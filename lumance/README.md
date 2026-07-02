# Lûmance — site de pré-lançamento (fake door)

Landing page de pré-lançamento da **Lûmance**, marca DTC de máscara de luz LED
para uso em casa. O site simula uma experiência de compra (wizard de
personalização + reserva) para validar demanda real e capturar leads.

- **Next.js 14** (App Router, TypeScript)
- **Tailwind CSS** + **Framer Motion**
- **Firebase Firestore** — leads gravados na collection `leads_lumance`
- **Deploy:** Vercel (usa API Route `/api/leads`, portanto **não** é export estático)
- **Analytics:** GA4, Meta Pixel e TikTok Pixel

> Este app vive na pasta `lumance/` de um repositório que também contém o site
> estático da Sopre.me/Sinesia. Os dois são independentes — veja "Deploy" abaixo.

## Rodando localmente

```bash
cd lumance
npm install
cp .env.example .env.local   # preencha as credenciais do Firebase (as MESMAS da Sinesia)
npm run dev
```

Acesse `http://localhost:3000`. O site funciona sem Firebase configurado — o
formulário responde com sucesso, mas o lead não é persistido (fica registrado
apenas nos logs do servidor).

## Variáveis de ambiente

Ver `.env.example`. Os valores do Firebase são **os mesmos do projeto Sinesia**
— não crie um projeto novo. Configure tudo no painel da Vercel:

```
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
NEXT_PUBLIC_GA4_ID          # opcional
NEXT_PUBLIC_META_PIXEL_ID   # opcional
NEXT_PUBLIC_TIKTOK_PIXEL_ID # opcional
```

## Firestore — collection `leads_lumance`

A API `/api/leads` grava documentos com esta estrutura:

```ts
{
  email: string;
  whatsapp?: string;
  type: 'waitlist' | 'reservation';
  wizard_responses: { step1: string; step2: string };
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  created_at: Timestamp;   // serverTimestamp()
  source: 'lumance';
}
```

Antes de gravar, a rota checa duplicidade de e-mail na collection. A collection
`leads_lumance` é separada da `leads_b2c` (Sinesia) — nada é misturado.

> As regras do Firestore do projeto Sinesia precisam permitir escrita na
> collection `leads_lumance` (ou usar as mesmas regras já existentes para
> coleções de leads).

## Deploy na Vercel

Como este app está numa subpasta, configure no projeto da Vercel:

- **Root Directory:** `lumance`
- **Framework Preset:** Next.js
- Adicione as variáveis de ambiente acima.

O deploy da Lûmance é totalmente independente do site da Sopre.me/Sinesia
(que continua sendo export estático em Firebase Hosting).

## Estrutura

```
app/
  page.tsx              Home single-page (todas as seções)
  sobre/                História da marca
  termos/               Termos de uso
  privacidade/          Política de privacidade (LGPD)
  api/leads/route.ts    Grava o lead no Firestore
  layout.tsx            Fontes (next/font), metadata, AnalyticsScripts
  sitemap.ts / robots.ts
components/
  AnalyticsScripts.tsx  GA4 + Meta Pixel + TikTok Pixel (next/script)
  PageInit.tsx          Pageview + captura de UTM
  sections/             TopBar, Navbar, Hero, SocialProof, Product,
                        Manifesto, Testimonials, Compare, Wizard,
                        LeadModal, FAQ, Footer
  ui/                   Reveal (fade-in), Placeholder
lib/
  firebase.ts           Config do Firebase (mesma da Sinesia)
  analytics.ts          trackLeadCaptured / trackButtonClick / trackWizardStep / trackPageView
  utm.ts                Captura e persiste UTM params
  wizard.ts             Opções e preço do configurador
  types.ts              Tipos de lead
  scroll.ts             Scroll suave até seções
```

## Assets a substituir antes de ir ao ar

- `public/hero.mp4` — vídeo de fundo do hero (hoje usa `hero-poster.svg` como
  fallback). Coloque um `.mp4` mudo em loop.
- Placeholders de imagem (`components/ui/Placeholder.tsx`) — trocar por fotos
  reais do produto.
- `public/og-image.svg` — trocar por um JPG/PNG 1200×630.
- Logos reais na barra "Visto em" (`components/sections/SocialProof.tsx`).
- CNPJ e dados da empresa no `Footer` e nas páginas legais.
- IDs reais de GA4, Meta Pixel e TikTok Pixel nas env vars.
