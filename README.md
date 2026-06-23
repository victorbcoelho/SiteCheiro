# Sopre.me

Site institucional e de pré-venda da Sopre.me — difusor de aroma inteligente por
assinatura. Next.js 14 (App Router) com export estático, Tailwind CSS, Framer
Motion e Firebase (Hosting + Firestore + Analytics).

## Stack

- **Next.js 14** (App Router, `output: export` — site 100% estático)
- **Tailwind CSS**
- **Framer Motion**
- **Firebase Hosting** (deploy dos arquivos estáticos)
- **Firebase Firestore** (armazenamento de leads de pré-venda)
- **Google Analytics 4** via Firebase Analytics
- **Meta Pixel** (placeholder, evento `Lead` no submit dos formulários)

## Rodando localmente

```bash
npm install
cp .env.example .env.local
# preencha as variáveis do Firebase em .env.local
npm run dev
```

Acesse `http://localhost:3000`.

> O site funciona em `npm run dev` mesmo sem as credenciais do Firebase
> preenchidas — os formulários só vão falhar ao tentar gravar no Firestore até
> que você configure um projeto real.

## Variáveis de ambiente

Veja `.env.example`. Todas vêm do **Firebase Console → Project settings →
Your apps → SDK setup and configuration**:

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=
NEXT_PUBLIC_META_PIXEL_ID=
```

## Estrutura

```
app/
  page.tsx              Home (B2C)
  empresas/page.tsx      Para Empresas (B2B)
  pre-venda/page.tsx     Página de conversão de pré-venda
  layout.tsx             Layout raiz, fontes, metadata, Meta Pixel
  sitemap.ts / robots.ts SEO
components/
  ui/                     Button, ScentCard, PlanCard, FAQ, CounterBadge, CompareTable
  sections/               Header, Footer, Hero, Problem, Solution, Plans, etc.
  LeadForm.tsx            Formulário reutilizável (B2C e B2B)
lib/
  firebase.ts             Inicialização do Firebase
  leads.ts                Funções de gravação/leitura de leads no Firestore
  analytics.ts            Wrapper de eventos do GA4 + Meta Pixel
```

## Firebase — configuração do projeto

1. Crie um projeto no [Firebase Console](https://console.firebase.google.com).
2. Ative **Firestore Database** (modo produção) e **Google Analytics**.
3. Copie as credenciais do app Web para `.env.local`.
4. Ajuste o `.firebaserc` com o ID real do seu projeto:

```json
{
  "projects": {
    "default": "SEU-PROJECT-ID-AQUI"
  }
}
```

5. Faça login e selecione o projeto:

```bash
npm install -g firebase-tools
firebase login
firebase use SEU-PROJECT-ID-AQUI
```

6. Publique as regras do Firestore (`firestore.rules`):

```bash
firebase deploy --only firestore:rules
```

### Coleções do Firestore

- `leads` — leads do site B2C (home e pré-venda). Campos: `nome`, `email`,
  `whatsapp`, `plano`, `origem`, `timestamp`.
- `leads_b2b` — leads da página `/empresas`. Campos: `nome`, `empresa`,
  `segmento`, `pontos`, `whatsapp`, `email`, `origem`, `timestamp`.

O contador "Já são X pessoas na lista" usa uma contagem agregada
(`getCountFromServer`) sobre a coleção `leads`, somada a uma base fixa de 47.

## Build e deploy no Firebase Hosting

O site é exportado como estático (`output: 'export'` no `next.config.js`),
então não precisa de Cloud Functions nem Cloud Run — apenas Hosting.

```bash
npm run build      # gera a pasta /out
firebase deploy
```

Esse comando único builda e publica tudo (Hosting + regras do Firestore, já
configurados em `firebase.json`).

Para o primeiro deploy do zero, a sequência completa é:

```bash
npm install
npm run build
firebase login
firebase use SEU-PROJECT-ID-AQUI
firebase deploy
```

## Pagamento

O CTA de pré-venda hoje salva o lead no Firestore. Quando o checkout do
Mercado Pago estiver pronto, troque a URL placeholder no botão/CTA pela URL
real de pagamento (ou crie um link de pagamento do Mercado Pago e aponte o
`href` do botão para ele).

## Performance e SEO

- Imagens via `next/image` com `unoptimized: true` (necessário para export
  estático) e fontes do Unsplash como placeholder de lifestyle.
- `app/sitemap.ts` e `app/robots.ts` gerados automaticamente no build.
- Meta tags Open Graph e Twitter Card configuradas em `app/layout.tsx`.
- Antes de ir para produção, troque as imagens do Unsplash por fotos reais do
  produto e troque `public/og-image.svg` por uma imagem JPG/PNG 1200x630.
