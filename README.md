# StockTrack360

StockTrack360 es un MVP académico de aplicación web para gestión de inventario orientado a pequeños y medianos negocios de Colombia. Permite administrar usuarios, productos, stock, entradas, salidas, historial de movimientos, alertas, dashboard y reportes básicos.
# Hola

## Arquitectura

El proyecto usa un monorepo con enfoque de microservicios para MVP académico:

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

El frontend oficial vive en `apps/frontend`. La carpeta temporal del prototipo fue retirada después de migrar su base visual.

## Apps

| App | Puerto sugerido | Responsabilidad |
| --- | --- | --- |
| `apps/frontend` | `3000` | Interfaz Next.js/React. Consume únicamente el API Gateway. |
| `apps/api-gateway` | `4000` | Punto único de entrada bajo `/api`, CORS, errores, token y proxy a servicios internos. |
| `apps/auth-service` | `4001` | Login, JWT, usuarios, roles y permisos. |
| `apps/inventory-service` | `4002` | Productos, categorías, stock, entradas, salidas e historial. |
| `apps/reporting-alerts-service` | `4003` | Alertas, dashboard y reportes básicos. |
| `packages/shared` | N/A | Constantes, contratos, roles, mensajes y helpers compartidos livianos. |

## Base de datos

Para el MVP se usa una sola base de datos PostgreSQL/Supabase compartida, con separación lógica por tablas. Una base por microservicio queda como mejora futura, fuera del alcance actual.

## Instalación

Requisito recomendado:

```bash
pnpm install
```

## Comandos

Desde la raíz del monorepo:

```bash
pnpm dev:frontend
pnpm dev:gateway
pnpm dev:auth
pnpm dev:inventory
pnpm dev:reporting-alerts
pnpm dev:all
pnpm lint
```

Estado actual: el frontend oficial se ejecuta desde `apps/frontend` y las cuatro apps backend ya levantan servidores Express base para la Fase 2.

## Variables de entorno backend

Cada app backend tiene su propio `.env.example`. Para entorno local, copiar el archivo correspondiente a `.env` dentro de cada app y completar solo valores locales.

- `JWT_SECRET` debe ser el mismo en gateway y servicios.
- `SUPABASE_SECRET_KEY` o `SUPABASE_SERVICE_ROLE_KEY` se usa solo en servicios backend.
- No agregar claves privadas, contrasenas ni variables `NEXT_PUBLIC_SUPABASE_*` al frontend para consultar datos.

## Orden sugerido de ejecución local

1. `apps/auth-service`
2. `apps/inventory-service`
3. `apps/reporting-alerts-service`
4. `apps/api-gateway`
5. `apps/frontend`

El frontend debe consumir solo `http://localhost:4000` o la URL configurada del API Gateway. No debe llamar directamente a los microservicios internos.

## Documentos importantes

- `AGENTS.md`: reglas para Codex y agentes de IA.
- `docs/project-context.md`: fuente funcional principal.
- `docs/api-contracts.md`: fuente principal de contratos API.
- `docs/openapi.yaml`: especificación técnica complementaria del API Gateway.
- `docs/design-system.md`: fuente visual principal del frontend.
- `docs/frontend-guidelines.md`: referencia histórica del prototipo/Figma.
- `docs/team-work-plan.md`: distribución del equipo por apps.
- `docs/development-phases.md`: fases oficiales de implementación.
- `docs/agent-workflow.md`: guía para trabajar con Codex o agentes.

## Flujo de trabajo recomendado

- Trabajar por ramas pequeñas y por fase.
- Indicar siempre qué app se modifica.
- No tocar múltiples apps sin justificarlo.
- Definir o actualizar contratos API antes de integrar frontend, gateway o servicios.
- Mantener commits pequeños y con alcance claro.
- Actualizar documentación si cambia arquitectura, contrato o regla de negocio.

## Restricciones principales

No agregar Docker, Kubernetes, Kafka, RabbitMQ, Prisma, nuevas apps principales ni funcionalidades fuera del MVP sin aprobación explícita.
