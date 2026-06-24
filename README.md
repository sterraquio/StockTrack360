# StockTrack360

StockTrack360 es un MVP academico de aplicacion web para gestion de inventario orientado a pequenos y medianos negocios de Colombia. Permite administrar usuarios, productos, inventario, entradas, salidas, historial de movimientos, alertas, dashboard y reportes basicos.

## Estado de entrega

Estado validado al 2026-06-15:

- Frontend Next.js en `apps/frontend`.
- API Gateway Express en `apps/api-gateway`.
- Servicios Express reales en `apps/auth-service`, `apps/inventory-service` y `apps/reporting-alerts-service`.
- Persistencia en PostgreSQL/Supabase mediante los scripts versionados de `docs/database`.
- Mocks frontend desactivados para validacion real local.
- Contratos publicos bajo `/api` alineados entre documentacion, OpenAPI, shared y frontend.
- Pruebas integrales de Fase 13 documentadas en `docs/phase-13-manual-validation.md`.
- Checklist de entrega academica de Fase 14 documentado en `docs/final-delivery-checklist.md`.

## Arquitectura

El proyecto usa un monorepo con enfoque de microservicios para MVP academico:

```txt
StockTrack360/
├── apps/
│   ├── frontend/
│   ├── api-gateway/
│   ├── auth-service/
│   ├── inventory-service/
│   └── reporting-alerts-service/
├── packages/
│   └── shared/
├── docs/
├── AGENTS.md
├── README.md
└── package.json
```

| App | Puerto | Responsabilidad |
| --- | --- | --- |
| `apps/frontend` | `3000` | Interfaz Next.js/React. Consume solo el API Gateway. |
| `apps/api-gateway` | `4000` | Punto unico de entrada bajo `/api`, CORS, errores, JWT y proxy a servicios internos. |
| `apps/auth-service` | `4001` | Login, JWT, usuarios, roles y permisos. |
| `apps/inventory-service` | `4002` | Productos, categorias, stock, entradas, salidas e historial. |
| `apps/reporting-alerts-service` | `4003` | Alertas, dashboard y reportes basicos. |
| `packages/shared` | N/A | Constantes, rutas, errores y helpers compartidos livianos. |

## Instalacion

Requisitos:

- Node.js compatible con el proyecto local actual.
- pnpm `11.1.1` o compatible.
- Proyecto Supabase configurado con `docs/database/schema.sql` y `docs/database/seed.sql`.
- Clave backend privada de Supabase en los `.env` locales de los servicios. No usar claves Supabase en el frontend.

Instalar dependencias:

```bash
pnpm install
```

## Variables de entorno

Copiar los `.env.example` de cada app al archivo local correspondiente y completar valores locales:

```bash
cp apps/api-gateway/.env.example apps/api-gateway/.env
cp apps/auth-service/.env.example apps/auth-service/.env
cp apps/inventory-service/.env.example apps/inventory-service/.env
cp apps/reporting-alerts-service/.env.example apps/reporting-alerts-service/.env
cp apps/frontend/.env.example apps/frontend/.env.local
```

Reglas importantes:

- `JWT_SECRET` debe ser el mismo en gateway y servicios.
- `SUPABASE_SECRET_KEY` o `SUPABASE_SERVICE_ROLE_KEY` solo va en backend.
- No agregar `NEXT_PUBLIC_SUPABASE_*` al frontend.
- No commitear `.env`, contrasenas ni claves privadas.
- El frontend debe quedar con mocks apagados para validacion final:

```txt
NEXT_PUBLIC_API_GATEWAY_URL=http://localhost:4000
NEXT_PUBLIC_AUTH_MOCK_ENABLED=false
NEXT_PUBLIC_DATA_MOCK_ENABLED=false
```

La guia completa esta en `SETUP_GUIDE.md`.

## Base de datos

Ejecutar en Supabase SQL Editor:

1. `docs/database/schema.sql`
2. `docs/database/seed.sql`

Usuarios semilla academicos:

```txt
Administrador: admin@stocktrack360.local / Admin123*
Usuario operativo: usuario@stocktrack360.local / Usuario123*
```

Las contrasenas semilla se documentan solo para pruebas academicas. En la base se guardan hashes bcrypt.

## Ejecucion local

Desde la raiz:

```bash
pnpm dev:all
```

Orden equivalente si se levanta por separado:

```bash
pnpm dev:auth
pnpm dev:inventory
pnpm dev:reporting-alerts
pnpm dev:gateway
pnpm dev:frontend
```

URLs locales:

- Frontend: `http://localhost:3000`
- API Gateway: `http://localhost:4000`
- Auth Service: `http://localhost:4001`
- Inventory Service: `http://localhost:4002`
- Reporting Alerts Service: `http://localhost:4003`

## Validacion

Comandos principales:

```bash
pnpm -r lint
pnpm validate:contracts
pnpm --filter @stocktrack360/frontend build
```

Validacion registrada:

- `pnpm -r lint`: correcto.
- `pnpm validate:contracts`: correcto.
- `pnpm --filter @stocktrack360/frontend build`: correcto con red disponible para `next/font`.
- `pnpm dev:all`: levanta las 5 apps.
- Rutas frontend principales responden `200`.
- Flujos API de login, permisos, usuarios, productos, movimientos, alertas, dashboard y reportes pasan segun `docs/phase-13-manual-validation.md`.

## Documentos importantes

- `AGENTS.md`: reglas para Codex y agentes de IA.
- `SETUP_GUIDE.md`: guia reproducible de instalacion, entorno y ejecucion.
- `docs/project-context.md`: fuente funcional principal.
- `docs/api-contracts.md`: contratos entre frontend, gateway y servicios.
- `docs/openapi.yaml`: especificacion publica del API Gateway.
- `docs/design-system.md`: fuente visual principal del frontend.
- `docs/database/README.md`: preparacion de Supabase/PostgreSQL.
- `docs/phase-13-manual-validation.md`: pruebas integrales finales.
- `docs/final-delivery-checklist.md`: checklist e indice de evidencias de entrega.

## Alcance y restricciones

El MVP mantiene solo los roles `ADMINISTRADOR` y `USUARIO`. No incluye facturacion electronica, pagos, e-commerce, app movil nativa, IA, multiples bodegas, lectores de codigo de barras, Docker, Kubernetes, Kafka, RabbitMQ, Prisma ni nuevas apps principales.

# Ejemplo de pipeline