# Handoff — Mini ERP (fim da Fase 0)

Documento de passagem de contexto. Serve para começar uma conversa nova (outro agente ou outro
chat) sem perder o que já foi decidido e sem refazer o que já está pronto.

Última verificação: 27/10/2026, direto no repositório local e no GitHub Actions.

---

## 0. Resumo em cinco linhas

- Projeto: Mini ERP multi-tenant, portfólio, Next.js 16 + React 19 + Prisma 7 + Postgres.
- Fase 0 (setup) commitada, enviada e **com CI verde** (`efbb7d1`, `origin/main`).
- `lint`, `typecheck`, `test` e `build` passam também num clone limpo (simulei o CI localmente).
- **Falta só o banco**: não há Docker nesta máquina, nenhum Postgres rodando, nenhuma migration.
- Próximo passo real: apontar `DATABASE_URL` para um Postgres (Neon de preferência) e rodar a
  primeira migration. Depois disso, Fase 1 (auth + empresa).

---

## 1. Identificação

| Item | Valor |
| --- | --- |
| Pasta local | `C:\Users\sanso\Desktop\projetos\mini-erp` |
| Repositório | https://github.com/sansonpedro/mini-erp |
| Branch | `main` |
| Último commit | `efbb7d1 fix(typecheck): generate route types before tsc on a clean checkout` |
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

### Passo 1 — Banco de dados (único bloqueio)

Nada escutando em `localhost:5432`, `docker` não instalado, `prisma/migrations/` inexistente,
nenhum seed. `src/lib/prisma.ts` nunca abriu conexão real.

Opções:

1. **Neon (recomendado).** Grátis, é o alvo de deploy da Fase 6, não exige instalar nada.
   Criar projeto em https://neon.tech, copiar a connection string (com `?sslmode=require`) para
   `DATABASE_URL` no `.env`.
2. **Docker Desktop.** Instalar (precisa de WSL2), `docker compose up -d`, usar a URL do
   `.env.example`. Mais pesado e desnecessário para o projeto.
3. **PostgreSQL nativo** via `winget install PostgreSQL.PostgreSQL.17` (pede admin). Só se quiser
   tudo local.

Depois de escolher:

```bash
pnpm prisma migrate dev --name init
```

Isso cria `prisma/migrations/` e aplica. Provar que conecta com `pnpm prisma studio` ou uma query
simples. Só então seguir para a Fase 1.

### Passo 2 — Fase 1: auth + empresa

Prompt pronto na seção 6. Definition of done na seção 7.

---

## 6. Prompt pronto para a Fase 1

Colar no agente que for executar (depois do banco estar de pé):

```text
Fase 1 do Mini ERP: autenticação e empresa. Leia PLAN.md, README.md, AGENTS.md e
docs/HANDOFF.md antes de qualquer coisa. Next.js 16.4.3 tem mudanças em relação ao que você
conhece: leia os guias em node_modules/next/dist/docs/ (authentication.md,
authentication-with-cache-components.md, 16-proxy.md) antes de escrever código. Em Next 16 o
middleware se chama proxy.ts.

Contexto já pronto: Prisma 7.10.1 com prisma.config.ts, generator "prisma-client" em
src/generated/prisma, client singleton em src/lib/prisma.ts usando @prisma/adapter-pg,
Postgres rodando e migration inicial aplicada. Estrutura por feature já existe em src/features.
cacheComponents está desligado de propósito (docs/decisions/0001-cache-components.md).

Escopo desta fase (nada além disso):
1. Better Auth com adapter Prisma, e-mail + senha. Modelos do Better Auth (user, session,
   account, verification) em prisma/schema.prisma, seguindo a doc oficial da versão instalada.
2. Relação User -> Company (um usuário pertence a uma empresa; companyId no User).
   Company: id, name, createdAt.
3. Sign up, login, logout funcionando de verdade (não só a tela).
4. Criação da empresa no primeiro login: se o usuário não tem companyId, redirecionar para
   /onboarding/company, criar a empresa e vincular. Server action com Zod.
5. Proteção de rotas: proxy.ts para checar sessão nas rotas privadas (/app/**), e checagem
   de sessão no servidor (não confiar só no proxy). Rotas públicas: /, /login, /signup.
6. UI em inglês, Tailwind + shadcn já configurados, Phosphor Icons. Formulários com React Hook
   Form + Zod (mesmo schema no cliente e no server action). Páginas em app/ finas, lógica em
   features/auth e features/company.
7. Migration nova (pnpm prisma migrate dev --name auth-and-company). Não editar migrations à mão.
8. Teste Vitest para o schema Zod de signup e para a regra "usuário sem empresa vai para onboarding".
   Playwright fica para a Fase 7.

Regras: não adicionar biblioteca sem justificar; não usar floats para dinheiro; não colocar
segredo no código; não commitar .env; não mexer em features de products/stock/sales; manter
cacheComponents desligado.

Ao terminar: rodar pnpm lint, pnpm typecheck, pnpm test e pnpm build; testar o fluxo completo no
navegador (signup -> criar empresa -> logout -> login); e só então commitar com
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
