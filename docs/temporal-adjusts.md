# Mock temporal de autenticación frontend

## Propósito

Este documento registra el mock temporal de autenticación agregado en `apps/frontend` para permitir pruebas de navegación mientras `apps/api-gateway` y `apps/auth-service` no están listos o no están levantados.

El mock es solo una herramienta de desarrollo frontend. No reemplaza los contratos oficiales definidos en `docs/api-contracts.md` y no debe considerarse autenticación real del MVP.

## Activación

El mock se activa únicamente con esta variable en `apps/frontend/.env.local`:

```txt
NEXT_PUBLIC_AUTH_MOCK_ENABLED=true
```

El archivo `.env.local` está ignorado por Git, por lo que esta configuración es local de cada integrante.

La variable documentada en `apps/frontend/.env.example` debe quedar por defecto en `false`:

```txt
NEXT_PUBLIC_AUTH_MOCK_ENABLED=false
```

## Credenciales temporales

Mientras el mock esté activo, se puede iniciar sesión con:

```txt
admin@stocktrack360.local / password
usuario@stocktrack360.local / password
```

El usuario administrador usa el rol `ADMINISTRADOR` y el usuario operativo usa el rol `USUARIO`, respetando los dos roles oficiales del MVP.

## Cómo entrar sin usuarios registrados

Mientras no existan usuarios reales en base de datos, no se entra con registros creados desde backend. Para navegar el frontend se usa el mock temporal con las credenciales anteriores.

Para que funcione, `apps/frontend/.env.local` debe tener:

```txt
NEXT_PUBLIC_AUTH_MOCK_ENABLED=true
```

Después de iniciar el frontend, entra en `/login` con uno de estos correos:

```txt
admin@stocktrack360.local
usuario@stocktrack360.local
```

La contraseña temporal para ambos es:

```txt
password
```

## Alcance técnico

El mock vive en:

```txt
apps/frontend/src/services/authMock.js
```

La selección entre mock y API real se hace desde:

```txt
apps/frontend/src/services/authService.js
```

Cuando `NEXT_PUBLIC_AUTH_MOCK_ENABLED` no es `true`, el frontend usa el flujo real contra el API Gateway:

```txt
POST /api/auth/login
GET  /api/auth/me
POST /api/auth/logout
```

## Retiro o desactivación

Cuando `apps/api-gateway` y `apps/auth-service` estén listos, se debe desactivar el mock cambiando en `apps/frontend/.env.local`:

```txt
NEXT_PUBLIC_AUTH_MOCK_ENABLED=false
```

También se puede eliminar la variable local para volver al flujo real.

Antes de entregar o desplegar el MVP, confirmar que el mock no esté activo en ningún entorno compartido, de pruebas finales o producción.

## Riesgos

- El mock no valida credenciales contra base de datos.
- El token generado no es un JWT real.
- No sustituye la validación backend obligatoria por rol.
- No debe usarse para verificar seguridad, permisos reales ni integración entre microservicios.
