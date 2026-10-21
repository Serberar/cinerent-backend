# CineRent · Backend del proyecto final (FP)

Backend del proyecto final de ciclo: la API de **CineRent**, un videoclub online para alquilar películas. Hecho con Node.js y **arquitectura hexagonal estricta**, con JWT, verificación de email, catálogo de películas y panel de administración.

Es la versión más completa del backend de CineRent; el frontend es [frontend-daw-](https://github.com/Serberar/frontend-daw-) y hay versiones previas en [backend-daw](https://github.com/Serberar/backend-daw).

## Funcionalidades

- **Usuarios:** registro con verificación de email, login con JWT, perfil editable, cambio de contraseña y datos de tarjeta.
- **Películas y géneros:** catálogo con alta, edición, activar/desactivar, destacar y géneros con precio.
- **Alquileres:** alquilar una película, devolverla e historial.
- **Administración:** listar usuarios, suspenderlos, cambiar su rol, resetear su contraseña y editarlos.

## Rutas

`/api/user`, `/api/movie`, `/api/genre`, `/api/product` (alquileres) y `/api/admin`.

## Tecnologías

Node.js, Express, Prisma, PostgreSQL, JWT, Nodemailer y Docker.

## Estructura (hexagonal)

```
src/
├── domain/          # Entidades
├── application/     # Casos de uso (user, movie, genre, product)
└── infrastructure/  # Express, Prisma, email y tokens
prisma/              # Esquema, migraciones y seed
```

## Cómo arrancarlo

```bash
cp .env.example .env
docker compose up -d
```

O en local: `npm install`, migraciones de Prisma y `npm run dev`. Detalle en [`docs/agent.md`](docs/agent.md).

## Autor

Sergio Bernabé
