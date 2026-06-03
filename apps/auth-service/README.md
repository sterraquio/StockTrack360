# Auth Service

Servicio de autenticacion y usuarios.

## Responsabilidades implementadas

- Login interno con mensaje generico de error.
- `GET /internal/auth/me`.
- `POST /internal/auth/logout`.
- Gestion administrativa de usuarios bajo `/internal/users`.
- JWT HMAC con usuario y rol.
- Roles permitidos: `ADMINISTRADOR` y `USUARIO`.
- Estados permitidos: `ACTIVE` e `INACTIVE`.

## Rutas internas

```txt
POST  /internal/auth/login
GET   /internal/auth/me
POST  /internal/auth/logout
GET   /internal/users
POST  /internal/users
PATCH /internal/users/:id
```

## Ejecucion local

```sh
pnpm --filter @stocktrack360/auth-service dev
```

Puerto objetivo: `4001`.

Usuarios semilla:

```txt
admin@stocktrack360.local / password
usuario@stocktrack360.local / password
```

## Estado

Fase 5 implementada con almacenamiento en memoria para ejecucion academica local. La persistencia en PostgreSQL/Supabase queda pendiente para la integracion final si el equipo define credenciales y cliente de base de datos.
