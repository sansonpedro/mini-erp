# Handoff — Mini ERP (fim da Fase 0)

Documento de passagem de contexto. Serve para começar uma conversa nova (outro agente ou outro
chat) sem perder o que já foi decidido e sem refazer o que já está pronto.

Última verificação: 27/10/2026, direto no repositório local e no GitHub Actions.

---

## 0. Resumo em cinco linhas

- Projeto: Mini ERP multi-tenant, portfólio, Next.js 16 + React 19 + Prisma 7 + Postgres.
- Fase 0 fechada, CI verde, e o Neon já provisionado (Postgres + Managed Better Auth).
- Auth fiado no app: handler em `/api/auth/[...path]`, server/client em `src/lib/auth/`,
  health check de banco em `/api/health`.
- Fluxo validado por HTTP: sign-up, sign-in, get-session e sign-out.
- Próximo passo: UI de login/signup, Company e proteção de rotas (Fase 1).

---

## 1. Identificação

| Item | Valor |
| --- | --- |
| Pasta local | `C:\Users\sanso\Desktop\projetos\mini-erp` |
| Repositório | https://github.com/sansonpedro/mini-erp |
| Branch | `main` |
| Último commit | `e25ed71 feat(auth): wire Neon Auth and add database health check` |
| Node local | v24.18.0 |
| pnpm local | 11.15.1 (`packageManager` no package.json) |
| CI | https://github.com/sansonpedro/mini-erp/actions — run #3 verde |

Stack instalada: Next.js 16.4.3, React 19.3.0, TypeScript strict, Tailwind CSS 4,
shadcn/ui estilo `base-nova` (Base UI, não Radix), Phosphor Icons, Prisma 7.10.1
(`prisma-client` + `@prisma/adapter-pg`), PostgreSQL, Vitest 5, ESLint 9, GitHub Actions.

---

## 2. O que já foi feito (verificado)

### Setup

- `pnpm-workspace.yaml` (com `allowBuilds` correto), `components.json`, `eslint.config.mjs`,
  `tsconfig.json` strict, `vitest.config.mts`.
- shadcn configurado (`src/components/ui/button.tsx`) e `cn` (pacote oficial `shadcn-ui/cn`,
  substituto de clsx + tailwind-merge) exportado em `src/lib/utils.ts`.
- Estrutura por feature criada com `.gitkeep`: `auth`, `company`, `products`, `stock`, `sales`,
  `dashboard`.
- `docker-compose.yml` com `postgres:16-alpine` (user `minierp`, db `mini_erp`, porta 5432) —
  pronto, mas nunca executado nesta máquina.
- `.env.example` com `DATABASE_URL` e `NEXT_PUBLIC_APP_URL`; `.env` local existe e está ignorado.
- `.gitignore` cobre `.env*` (exceto `.env.example`), `node_modules`, `.next`,
  `src/generated/prisma`, `*.tsbuildinfo` e as pastas de agentes (`.agents/`, `.claude/`,
  `.windsurf/`).
- `AGENTS.md` commitado (regra do Next 16: ler `node_modules/next/dist/docs/` antes de codar).
- `PLAN.md` e `README.md` em inglês, revisados (scripts reais, requisito Node 22.13+,
  sem menção a seed/e2e que ainda não existem).
- `docs/decisions/0001-cache-components.md` registra a decisão sobre Cache Components.

### Prisma 7 (setup moderno)

- `prisma.config.ts` com `dotenv/config`, schema em `prisma/schema.prisma`, migrations em
  `prisma/migrations`, `datasource.url` vindo de `process.env.DATABASE_URL`.
- Generator `prisma-client` com `output = "../src/generated/prisma"`.
- `src/lib/prisma.ts` usa `PrismaPg` adapter e singleton em `globalThis`.
- `postinstall: prisma generate` no package.json: clone limpo já sai com o client gerado.
- Schema ainda **sem modelos** (só generator + datasource).

### App

- `src/app/layout.tsx`: título `Mini ERP`, descrição, `lang="en"`, Geist Sans + Geist Mono,
  `font-sans` aplicado no `body`.
- `src/app/globals.css`: tokens shadcn (light/dark), `--font-sans` apontando para Geist.
- `src/app/page.tsx`: home em inglês, ícone Phosphor, botão "Setup Complete (Phase 0)".
- Teste único: `src/lib/utils.test.ts` (Vitest, `cn`).
- `next.config.ts` sem `cacheComponents`/`partialPrefetching` (ver decisão 0001).

### Scripts

`dev`, `build` (`prisma generate && next build`), `start`, `lint`,
`typecheck` (`next typegen && tsc --noEmit`), `test`, `test:watch`, `prisma:generate`,
`postinstall`.

### CI

`.github/workflows/ci.yml`: pnpm + **Node 22**, `--frozen-lockfile`, gera o client Prisma, lint,
typecheck, test e build com `DATABASE_URL` fake. Run #3 (`efbb7d1`) verde, todos os passos.

---

## 3. O que foi corrigido nesta sessão

### 3.1 CI vermelho (resolvido)

O run #1 falhou no `Setup Node.js`: `pnpm@11.15.1` exige `engines.node >= 22.13`, e o workflow
usava Node 20. Trocado para 22.

Depois disso o run #2 passou do setup e falhou no typecheck, por dois motivos que só aparecem em
clone limpo:

1. `src/generated/prisma` é gitignored, então o import `@/generated/prisma/client` não existia.
   Corrigido com `postinstall: prisma generate` **e** um passo explícito "Generate Prisma client"
   no CI.
2. `LayoutProps<"/">` é um tipo gerado pelo Next. Sem `.next/types`, o `tsc` quebra. Corrigido
   com `typecheck: "next typegen && tsc --noEmit"`.

Validação: clone limpo do repo, `pnpm install --frozen-lockfile`, lint, typecheck, test e build —
tudo exit 0, igual ao CI.

Commits desta sessão:

```
efbb7d1 fix(typecheck): generate route types before tsc on a clean checkout
fb7f0cb fix(ci): generate the Prisma client before typecheck
65f95e9 docs: align README with real scripts and record cache decision
6422249 chore(config): disable cache components and fix pnpm allowBuilds
f4a41d1 fix(ci): run on Node 22 to match pnpm 11 engines
```

### 3.2 `cacheComponents` / `partialPrefetching` (resolvido)

Estavam ligados no scaffold. Com Cache Components, ler `cookies()` fora de `<Suspense>` é erro de
build — exatamente o que a Fase 1 faria. Desligados; motivo e plano de reavaliação em
`docs/decisions/0001-cache-components.md`.

### 3.3 Inconsistências de documentação (resolvido)

- README não cita mais `pnpm prisma db seed` nem `pnpm test:e2e` (não existem ainda; seed é
  Fase 5, Playwright é Fase 7).
- Linha solta `# mini-erp` no fim do README removida.
- `pnpm-workspace.yaml` com placeholders (`set this to true or false`) trocado por booleanos:
  `prisma`, `@prisma/engines`, `esbuild` → `true`; `sharp`, `unrs-resolver`, `workerd` → `false`.
- Requisito do README corrigido para Node 22.13+ (por causa do pnpm 11).

### 3.4 Pendências cosméticas (não bloqueiam)

- `components.json` declara `iconLibrary: "lucide"` (o CLI do shadcn só suporta lucide/radix),
  mas o app usa Phosphor. **Não** trocar o valor no JSON — quebraria o CLI. Apenas manter o app
  em Phosphor e saber que componentes novos do shadcn vêm com ícones lucide.
- `button.tsx` importa `cn` de `"cn"` direto, e não de `@/lib/utils`. Cosmético; alinhar quando
  mexer no componente.

---

## 4. Decisões já tomadas (não reabrir sem motivo)

- **Multi-tenant:** toda tabela de negócio tem `companyId`; toda query filtra por ele.
- **Dinheiro em centavos** (inteiro), nunca float.
- **Estoque é razão (ledger):** saldo = soma dos `StockMovement`; não existe contador paralelo.
- **Venda em uma transação:** checar estoque, criar venda/itens e gravar movimentos juntos.
- **Pastas por feature** (`features/<nome>/` com `actions.ts`, `queries.ts`, `schemas.ts`,
  `components/`). Nada de `core`/`shared`/`common`.
- **Páginas finas:** `app/` só busca com `queries` e renderiza componentes da feature.
- **Um schema Zod por formulário**, reutilizado no cliente e no server action.
- **Idioma do produto: inglês** (UI, README, commits, docs de portfólio). Conversa com o
  assistente pode ser em português.
- **Commits pequenos, Conventional Commits.**
- **Uma ferramenta mexendo no repo por vez** (Antigravity, Codex, OpenCode, Cursor: só um
  escrevendo; os outros no máximo leitura).

---

## 5. Próximos passos, na ordem

### Passo 1 — Neon (concluído)

- Projeto `icy-firefly-66514481`, org `org-red-mud-47222893`, branch `production`
  (`br-tiny-breeze-b6myuwd2`), região `sa-east-1`.
- `neon.ts` declara `auth: true` (Postgres é implícito). `neon deploy` não teve mudanças porque
  o Auth já estava habilitado no branch, e puxou as variáveis.
- `.env` recebeu: `DATABASE_URL` (pooled, tráfego do app), `DATABASE_URL_UNPOOLED` (direto,
  migrations), `NEON_BRANCH`, `NEON_AUTH_BASE_URL`, `NEON_AUTH_JWKS_URL`.
  `NEON_AUTH_COOKIE_SECRET` é segredo da aplicação, gerado localmente (32+ chars).
- `prisma.config.ts` usa `DATABASE_URL_UNPOOLED` para migrations; o runtime usa `DATABASE_URL`.
- Ainda **não há modelos nem migration**: a primeira migration nasce na Fase 1, com User/Company.
- O warning do `pg` sobre `sslmode=require` é conhecido e não bloqueia (vira `verify-full` no
  pg 9). Se incomodar, trocar para `sslmode=verify-full` na connection string.

### Passo 2 — Fase 1: UI de auth + empresa

O backend de auth já está pronto e testado. Falta a camada de produto:
telas de signup/login, onboarding da empresa, proteção de rotas e a migration de User/Company.
Prompt pronto na seção 6. Definition of done na seção 7.

---

## 6. Prompt pronto para a Fase 1

Colar no agente que for executar:

```text
Fase 1 do Mini ERP: telas de auth, empresa e proteção de rotas. Leia PLAN.md, README.md,
AGENTS.md e docs/HANDOFF.md antes de qualquer coisa. Next.js 16.4.3 tem mudanças em relação ao
que você conhece: leia os guias em node_modules/next/dist/docs/ (authentication.md,
16-proxy.md) antes de escrever código. Em Next 16 o middleware se chama proxy.ts.

Contexto já pronto e NÃO refazer:
- Neon Auth (Managed Better Auth) já fiado:
  src/lib/auth/server.ts (createNeonAuth), src/lib/auth/client.ts (createAuthClient),
  src/app/api/auth/[...path]/route.ts (auth.handler()).
- Fluxo já validado por HTTP: sign-up, sign-in, get-session, sign-out.
- Variáveis no .env: DATABASE_URL, DATABASE_URL_UNPOOLED, NEON_AUTH_BASE_URL,
  NEON_AUTH_COOKIE_SECRET. Não troque de provedor de auth nem instale better-auth puro.
- Prisma 7.10.1 com prisma.config.ts, client em src/lib/prisma.ts (@prisma/adapter-pg),
  estrutura por feature em src/features, cacheComponents desligado (docs/decisions/0001).

Escopo desta fase (nada além disso):
1. Modelos Prisma: Company (id, name, createdAt) e UserProfile/CompanyMember ligando o usuário
   do Neon Auth (user.id é texto) a uma Company. Toda tabela de negócio leva companyId.
   Migration: pnpm prisma migrate dev --name company.
2. Telas /signup e /login em inglês, Tailwind + shadcn, Phosphor. Use authClient.signUp.email,
   authClient.signIn.email e authClient.signOut. Mostre erro, loading e sucesso.
3. Onboarding: usuário logado sem empresa vai para /onboarding/company, cria a empresa
   (server action + Zod) e é vinculado. Depois vai para /app.
4. proxy.ts com auth.middleware({ loginUrl: "/login" }) e matcher só nas rotas privadas
   (/app/:path*). Mantenha /login, /signup, /api/auth e assets acessíveis.
5. Checagem de sessão no servidor (auth.getSession()) em toda página/ação privada; não confie
   só no proxy. Consultas sempre filtradas por companyId.
6. Página /app mínima mostrando o nome da empresa e o usuário, provando o fluxo.
7. Teste Vitest para o schema Zod de criação de empresa e para a regra "sem empresa -> onboarding".
   Playwright fica para a Fase 7.

Regras: não adicionar biblioteca sem justificar; não usar floats para dinheiro; não colocar
segredo no código; não commitar .env; não mexer em products/stock/sales; manter cacheComponents
desligado.

Ao terminar: rodar pnpm lint, pnpm typecheck, pnpm test e pnpm build; testar no navegador
(signup -> onboarding -> /app -> logout -> login); e só então commitar com
"feat(auth): signup, login and company onboarding". Relate o que passou, o que não passou e
qualquer decisão que você tomou sozinho.
```

---

## 7. Definition of done da Fase 1

- [ ] Consigo criar conta, sair, entrar de novo e continuar logado.
- [ ] No primeiro login sem empresa, caio no onboarding e crio a empresa.
- [ ] Rota privada sem sessão redireciona para `/login`.
- [ ] Usuário de uma empresa não acessa dados de outra (mesmo que ainda não haja dados, o filtro
      por `companyId` já existe nas queries).
- [ ] `lint`, `typecheck`, `test` e `build` verdes localmente e no CI.
- [ ] Migration commitada; `.env` fora do commit; `src/generated` fora do commit.
- [ ] UI em inglês e sem regressão visual na home.

---

## 8. Avisos operacionais

- **Nunca** commitar `.env`, chaves ou connection strings. Modelos gratuitos podem ter política
  de dados permissiva: não colar segredo no chat do agente.
- O CI roda em ambiente limpo: o que depende de arquivo gerado precisa de passo explícito
  (`prisma generate`, `next typegen`). Já está coberto.
- `next dev` reescreve `AGENTS.md` (bloco de regras). Isso é esperado; commitar junto mantém a
  árvore limpa.
- Ao usar mais de um agente, um só escreve por vez. Os demais apenas leem.
- Modelo em uso nesta conversa: DeepSeek V4.1 Flash Free (OpenCode Zen). Alternativas gratuitas
  citadas: GLM-5.3-Flash Free; Nemotron 3 Ultra Free para tarefas pesadas. Evitar modelos "VL"
  (visão) para código. Limites de uso e de saída variam; conferir antes de tarefas longas.

---

## 9. Neon: infra, tooling e comandos

### Recursos

| Item | Valor |
| --- | --- |
| Org | `org-red-mud-47222893` |
| Projeto | `icy-firefly-66514481` |
| Branch | `production` (`br-tiny-breeze-b6myuwd2`) |
| Região | `sa-east-1` |
| Auth | Neon Auth (Managed Better Auth), base em `NEON_AUTH_BASE_URL` |

`neon.ts` declara `auth: true`. `neon status` / `neon config plan` mostram o estado do branch.
`neon deploy` aplica o `neon.ts` e puxa as variáveis para o `.env`.

### Variáveis

- `DATABASE_URL` — pooled, usada pelo app (`src/lib/prisma.ts`).
- `DATABASE_URL_UNPOOLED` — direta, usada por migrations (`prisma.config.ts`).
- `NEON_AUTH_BASE_URL`, `NEON_AUTH_JWKS_URL`, `NEON_BRANCH` — puxadas pelo Neon.
- `NEON_AUTH_COOKIE_SECRET` — segredo da aplicação (32+ chars), **não** vem do Neon.

### Tooling instalado

- CLI `neon` 8.13.0 global (login OAuth no profile `DEFAULT`).
- Skills em `.agents/skills/` (project-level, gitignored): `neon`, `neon-postgres`, `neon-auth`.
- MCP do Neon em `opencode.json` (project-level, OAuth, sem API key no repo).
- Config global do OpenCode (`~/.config/opencode/opencode.json`) preservada.

### Rotas criadas

- `/api/auth/[...path]` — proxy para o Neon Auth.
- `/api/health` — `SELECT 1` via Prisma, prova a conexão com o Postgres.

### Teste rápido (com o servidor rodando)

```bash
curl -s http://localhost:3000/api/health
# {"database":"ok"}

curl -s -X POST http://localhost:3000/api/auth/sign-up/email \
  -H "Content-Type: application/json" \
  -d '{"email":"you@example.com","password":"TestPassword123!","name":"You"}'
```

O cookie de sessão se chama `__Secure-neon-auth.session_token` e o valor completo é
`token.assinatura` (não use só o `token` do corpo da resposta).

