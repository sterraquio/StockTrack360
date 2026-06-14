# Auth Service

Servicio de autenticacion y usuarios.

Responsabilidades objetivo:

- Login y `GET /api/auth/me`.
- Gestion basica de usuarios.
- JWT con usuario y rol.
- Roles permitidos: `ADMINISTRADOR` y `USUARIO`.

Estado actual: estructura preparada en Fase 1. La implementacion corresponde a la Fase 4.

## Fase 2

El servicio ya tiene un servidor Express base en `src/server.js`.

- Puerto por defecto: `4001`.
- Rutas internas registradas bajo `/internal`.
- JWT preparado para rutas protegidas.
- Cliente Supabase preparado solo para backend.
- Errores normalizados con `{ message, code, details }`.
- Las rutas oficiales responden `503 SERVICE_UNAVAILABLE` hasta implementar auth real.

Variables requeridas en entorno local:

```txt
HOST=127.0.0.1
PORT=4001
CORS_ORIGIN=http://localhost:3000
SUPABASE_URL=https://pdshxuzgqafjkmfsjocq.supabase.co
SUPABASE_SECRET_KEY=
SUPABASE_SERVICE_ROLE_KEY=
JWT_SECRET=
```

No guardar contrasenas ni claves privadas en Git.

Comandos:

```bash
pnpm --filter @stocktrack360/auth-service dev
pnpm --filter @stocktrack360/auth-service lint
```
