# Auth Service

Servicio de autenticacion y usuarios.

Responsabilidades objetivo:

- Login y `GET /internal/auth/me`.
- Gestion basica de usuarios.
- JWT con usuario y rol.
- Roles permitidos: `ADMINISTRADOR` y `USUARIO`.

Estado actual: autenticacion y usuarios implementados en Fase 5.

## Fase 5

El servicio tiene un servidor Express en `src/server.js` y rutas internas bajo
`/internal`.

- Puerto por defecto: `4001`.
- Login real con bcrypt y JWT.
- `GET /internal/auth/me` valida que el usuario siga activo en base de datos.
- `POST /internal/auth/logout` responde para limpiar sesion stateless en frontend.
- Gestion administrativa de usuarios con `GET /internal/users`,
  `POST /internal/users` y `PATCH /internal/users/:id`.
- Validacion de roles `ADMINISTRADOR` y `USUARIO`.
- Validacion de estados `ACTIVE` e `INACTIVE`.
- Bloqueo de gestion de usuarios para rol `USUARIO`.
- Cliente Supabase usado solo desde backend.
- Errores normalizados con `{ message, code, details }`.
- No se expone `password_hash` en ninguna respuesta.
- El correo no se modifica por contrato y tambien esta protegido por trigger SQL.

Variables requeridas en entorno local:

```txt
HOST=127.0.0.1
PORT=4001
CORS_ORIGIN=http://localhost:3000
SUPABASE_URL=https://pdshxuzgqafjkmfsjocq.supabase.co
SUPABASE_SECRET_KEY=
SUPABASE_SERVICE_ROLE_KEY=
JWT_SECRET=
JWT_EXPIRES_IN=8h
```

No guardar contrasenas, contrasenas de base de datos ni claves privadas en Git.

Flujo esperado:

1. Ejecutar `docs/database/schema.sql` y `docs/database/seed.sql` en Supabase.
2. Configurar `.env` local con `SUPABASE_URL`, una clave backend privada y
   `JWT_SECRET`.
3. Levantar `auth-service` y `api-gateway`.
4. Consumir auth desde el frontend solo por el gateway:
   - `POST /api/auth/login`
   - `GET /api/auth/me`
   - `POST /api/auth/logout`
   - `GET /api/auth/users`
   - `POST /api/auth/users`
   - `PATCH /api/auth/users/:id`

Comandos:

```bash
pnpm --filter @stocktrack360/auth-service dev
pnpm --filter @stocktrack360/auth-service lint
```

Pruebas manuales sugeridas desde el gateway:

```bash
curl -i -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@stocktrack360.local","password":"<password>"}'

curl -i http://localhost:4000/api/auth/me \
  -H "Authorization: Bearer <token>"

curl -i http://localhost:4000/api/auth/users \
  -H "Authorization: Bearer <token-admin>"
```
