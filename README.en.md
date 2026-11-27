# CineRent · Backend

API for **CineRent**, an online film rental shop. TypeScript, Express, Prisma and PostgreSQL with a **hexagonal architecture**, and a test that fails if any layer breaks the dependency rule. The frontend is cinerent-frontend.

- **Domain** (`src/domain`): entities and rules, with no external imports.
- **Application** (`src/application`): use cases that only know the domain and their ports (`ports.ts`).
- **Infrastructure** (`src/infrastructure`): Express, Prisma, email, tokens and passwords.
- **Composition root** (`src/container.ts`): the only place that joins the pieces.

## Security

- The session lives in an `HttpOnly` cookie; changes requested from another site are rejected.
- Only the last four digits of a card are stored.
- Somebody else's rental answers the same as one that does not exist.
- Rate limits on login and registration, `helmet` headers, and internal errors never reach the client.

## Run it

```bash
cp .env.example .env
docker compose up -d --build
docker compose exec api node dist/seed.js
```

## Tests

```bash
npm run typecheck && npm run lint
npm test                    # unit, architecture and HTTP, no database
npm run test:integration    # repositories against PostgreSQL (EMPTIES the DATABASE_URL database)
```

CI runs both on a clean PostgreSQL and also starts the project with Docker. More details in the [Spanish README](README.md). [MIT](LICENSE) license.
