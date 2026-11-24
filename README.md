# CineRent · Backend

**Español** · [English](README.en.md)

[![CI](https://github.com/Serberar/cinerent-backend/actions/workflows/ci.yml/badge.svg)](https://github.com/Serberar/cinerent-backend/actions/workflows/ci.yml)

API de **CineRent**, un videoclub online para alquilar películas. TypeScript, Express, Prisma y PostgreSQL con **arquitectura hexagonal**, y una prueba que falla si alguna capa rompe la regla de dependencias.

El frontend es [cinerent-frontend](https://github.com/Serberar/cinerent-frontend).

## Arquitectura

```mermaid
flowchart LR
  HTTP["HTTP<br/>Express"] --> APP
  subgraph APP["Aplicación"]
    UC["Casos de uso"]
  end
  APP --> DOM["Dominio<br/>User, Movie, Product, Genre"]
  UC -. "puertos" .-> INF
  subgraph INF["Infraestructura"]
    DB["Prisma<br/>PostgreSQL"]
    MAIL["Nodemailer"]
    JWT["JWT"]
    HASH["bcrypt"]
  end
```

- **Dominio** (`src/domain`): entidades y reglas. No importa nada externo.
- **Aplicación** (`src/application`): casos de uso que reciben sus dependencias. Solo conocen el dominio y sus puertos (`ports.ts`).
- **Infraestructura** (`src/infrastructure`): Express, Prisma, correo, tokens y contraseñas.
- **Composición** (`src/container.ts`): el único sitio que une las piezas.

## Funcionalidades

- **Usuarios:** registro con verificación de email, sesión en cookie, perfil, contraseña y tarjeta.
- **Catálogo:** películas y géneros, destacadas y activación.
- **Alquileres:** alquilar, devolver, historial y devolución automática al vencer.
- **Administración:** usuarios, suspensiones, catálogo y alquileres activos.

## Decisiones de seguridad

- De la tarjeta solo se guardan los cuatro últimos dígitos.
- La sesión va en una cookie `HttpOnly`: un XSS no puede llevársela. Caduca (`JWT_EXPIRES_IN`, 12 horas por defecto) y deja de valer si se suspende la cuenta.
- Los cambios pedidos desde otra web se rechazan (origen y `SameSite`).
- Los textos que llegan a un correo se escapan.
- Un alquiler ajeno responde igual que uno inexistente.
- El login y el registro tienen límite de intentos, y las respuestas llevan cabeceras de `helmet`.
- El título y el total salen del servidor, no de la petición.
- Los errores internos se registran, pero no se muestran al cliente.

## Arrancar

Con Docker, en un clon limpio:

```bash
cp .env.example .env
docker compose up -d --build      # PostgreSQL y la API en http://localhost:4000
docker compose exec api node dist/seed.js
```

Para desarrollar con recarga (Node.js 22), con solo la base de datos en Docker:

```bash
docker compose up -d postgres
npm install
npm run prisma:generate && npm run prisma:migrate:deploy && npm run seed
npm run dev
```

El seed carga un catálogo ficticio. Si defines `ADMIN_EMAIL` y `ADMIN_PASSWORD` en `.env`, crea también el administrador.

## Pruebas

```bash
npm run typecheck && npm run lint
npm test                    # unitarias, arquitectura y HTTP, sin base de datos
npm run test:integration    # repositorios contra PostgreSQL (usa y VACÍA la base de DATABASE_URL)
```

La CI ejecuta las dos en cada push sobre un PostgreSQL limpio, y además levanta el proyecto con Docker y comprueba que responde con datos.

## Rutas

| Prefijo | Qué cubre |
|---|---|
| `/api/user` | Registro, login, verificación y perfil |
| `/api/movie`, `/api/genre` | Catálogo |
| `/api/product` | Alquileres |
| `/api/admin` | Administración |
| `/health` | Comprobación de salud |

## Licencia

Publicado con licencia [MIT](LICENSE).

## Autor

Sergio Bernabé
