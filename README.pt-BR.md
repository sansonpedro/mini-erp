# Mini ERP

O Mini ERP é um sistema multiempresa de estoque e vendas para pequenos negócios. O MVP cobre cadastro de produtos, entradas e ajustes de estoque, vendas com baixa transacional e um dashboard operacional.

## Stack

Next.js 16, React 19, TypeScript, Prisma 7, PostgreSQL, Neon Auth, Tailwind CSS, shadcn/ui, Zod, Vitest e pnpm.

## Decisões técnicas

- O estoque é calculado por um livro de movimentações.
- Valores monetários são armazenados em centavos.
- Vendas e ajustes usam transações serializable com retry limitado para conflitos de concorrência.
- O acesso a dados de empresa depende de membership validada no servidor.
- O rate limit usa Upstash Redis em produção e fallback em memória no desenvolvimento.

## Como rodar

```bash
cp .env.example .env
docker compose up -d
pnpm install
pnpm prisma migrate dev
pnpm dev
```

Para dados de demonstração, configure `DEMO_USER_EMAIL` e `DEMO_USER_PASSWORD` e rode `pnpm prisma db seed`.

Veja a documentação completa em [`README.md`](README.md) e o checklist de deploy em [`docs/DEPLOY.md`](docs/DEPLOY.md).
