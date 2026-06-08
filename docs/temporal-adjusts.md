# Mocks temporales de frontend

## Propósito

Este documento registra los mocks temporales de `apps/frontend` para permitir pruebas de navegación y consumo de datos mientras `apps/api-gateway` y los microservicios no están listos o no están levantados.

Los mocks son solo herramientas de desarrollo frontend. No reemplazan los contratos oficiales definidos en `docs/api-contracts.md`, no crean rutas nuevas y no deben considerarse integración real del MVP.

## Mock temporal de autenticación

### Activación

El mock se activa únicamente con esta variable en `apps/frontend/.env.local`:

```txt
NEXT_PUBLIC_AUTH_MOCK_ENABLED=true
```

El archivo `.env.local` está ignorado por Git, por lo que esta configuración es local de cada integrante.

La variable documentada en `apps/frontend/.env.example` debe quedar por defecto en `false`:

```txt
NEXT_PUBLIC_AUTH_MOCK_ENABLED=false
```

### Credenciales temporales

Mientras el mock esté activo, se puede iniciar sesión con:

```txt
admin@stocktrack360.local / password
usuario@stocktrack360.local / password
```

El usuario administrador usa el rol `ADMINISTRADOR` y el usuario operativo usa el rol `USUARIO`, respetando los dos roles oficiales del MVP.

### Cómo entrar sin usuarios registrados

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

### Alcance técnico

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

## Mock temporal de datos

Este mock permite que las pantallas del frontend prueben consumo de información sin esperar a que estén listos `apps/api-gateway`, `apps/inventory-service`, `apps/auth-service` y `apps/reporting-alerts-service`.

Debe activarse únicamente con esta variable en `apps/frontend/.env.local`:

```txt
NEXT_PUBLIC_DATA_MOCK_ENABLED=true
```

Uso recomendado para probar frontend sin backend:

```txt
NEXT_PUBLIC_AUTH_MOCK_ENABLED=true
NEXT_PUBLIC_DATA_MOCK_ENABLED=true
```

El mock de datos debe devolver JSON con la misma forma documentada en `docs/api-contracts.md`. Debe servir para probar:

- Dashboard.
- Usuarios.
- Productos.
- Inventario.
- Movimientos.
- Alertas.
- Reportes.

Este mock no requiere crear base de datos, Supabase, APIs temporales ni rutas adicionales. Vive en:

```txt
apps/frontend/src/services/dataMock.js
```

La selección entre mock y API real se hace desde los servicios de `apps/frontend/src/services`, para que las pantallas sigan usando las mismas funciones de consumo.

Cuando `NEXT_PUBLIC_DATA_MOCK_ENABLED` no sea `true`, los servicios deben consumir el API Gateway real mediante las rutas oficiales bajo `/api`.

## Cómo volver al consumo real de APIs

Cuando `apps/api-gateway` y los microservicios estén listos, se deben desactivar los mocks cambiando en `apps/frontend/.env.local`:

```txt
NEXT_PUBLIC_AUTH_MOCK_ENABLED=false
NEXT_PUBLIC_DATA_MOCK_ENABLED=false
```

También se pueden eliminar esas variables locales para volver al flujo real.

Confirmar que `NEXT_PUBLIC_API_GATEWAY_URL` apunte al API Gateway real:

```txt
NEXT_PUBLIC_API_GATEWAY_URL=http://localhost:4000
```

Después se deben levantar `apps/api-gateway` y los microservicios necesarios, probar login y validar los módulos desde el frontend.

No debe ser necesario cambiar componentes ni pantallas. Al desactivar las variables de mock, los servicios del frontend deben volver a usar `apiRequest(...)` y consumir las APIs oficiales correctamente.

Antes de entregar o desplegar el MVP, confirmar que el mock no esté activo en ningún entorno compartido, de pruebas finales o producción.

## Riesgos

- El mock de autenticación no valida credenciales contra base de datos.
- El token generado por el mock de autenticación no es un JWT real.
- El mock de datos no valida integración con base de datos ni microservicios.
- No sustituye la validación backend obligatoria por rol.
- No debe usarse para verificar seguridad, permisos reales ni integración entre microservicios.
