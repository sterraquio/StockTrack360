# Workflow para Codex y agentes - StockTrack360

## Propósito

Este documento explica cómo deben usar Codex o agentes de IA los integrantes del equipo para trabajar en StockTrack360 sin romper contratos, arquitectura o alcance.

## Contexto mínimo para un chat nuevo

Cada chat nuevo debe iniciar con un resumen similar:

```txt
Trabaja en StockTrack360. Antes de modificar código, lee AGENTS.md, docs/project-context.md, docs/api-contracts.md y el documento específico de la app que vas a tocar. El proyecto usa arquitectura de 5 apps en monorepo: frontend, api-gateway, auth-service, inventory-service y reporting-alerts-service. No agregues nuevas apps, no inventes rutas y no implementes funcionalidades fuera del MVP.
```

## Antes de pedir cambios

El integrante debe indicar:

- App afectada.
- Fase de trabajo.
- Objetivo concreto.
- Archivos o módulos esperados si ya los conoce.
- Si el cambio afecta contratos API.
- Si el cambio afecta diseño visual.

## Documentos que debe leer el agente

Siempre:

- `AGENTS.md`
- `docs/project-context.md`
- `docs/api-contracts.md`

Si toca frontend:

- `docs/design-system.md`
- `docs/frontend-guidelines.md`

Si toca planificación:

- `docs/team-work-plan.md`
- `docs/development-phases.md`

Si toca API Gateway o servicios:

- `docs/openapi.yaml`
- README de la app afectada si existe.

## Reglas de trabajo

- Abrir un chat nuevo por tarea o fase.
- Pedir diagnóstico o plan antes de cambios grandes.
- No tocar otras apps sin permiso o justificación.
- No inventar rutas nuevas.
- No agregar funcionalidades fuera del MVP.
- No agregar Docker, Kubernetes, Kafka, RabbitMQ, Prisma ni nuevas apps principales.
- Mantener commits pequeños.
- Actualizar documentación si cambia arquitectura, contrato o regla de negocio.

## Contratos API

Si una tarea afecta frontend, gateway o servicios:

1. Revisar `docs/api-contracts.md`.
2. Confirmar que la ruta existe.
3. Si no existe, actualizar primero el contrato.
4. Actualizar `docs/openapi.yaml` si cambia una ruta pública.
5. Implementar después de tener el contrato claro.

El frontend debe consumir solo `apps/api-gateway`.

## Respuesta esperada del agente

Al terminar, el agente debe responder con:

```md
## Resumen
Qué se actualizó.

## Archivos modificados
- ruta/archivo

## Decisiones técnicas
Qué decisiones tomó.

## Cómo probar
Pasos concretos.

## Pendientes o riesgos
Qué falta revisar o confirmar.
```

## Buenas prácticas por integrante

### Integrante 1

- Trabajar principalmente en `apps/frontend`.
- Usar componentes compartidos.
- No llamar servicios internos directamente.
- Reportar si falta un contrato para una pantalla.

### Integrante 2

- Trabajar principalmente en `apps/api-gateway` y `apps/auth-service`.
- Mantener errores normalizados.
- Validar JWT y roles.
- No implementar lógica de inventario.

### Integrante 3

- Trabajar principalmente en `apps/inventory-service` y `apps/reporting-alerts-service`.
- Mantener movimientos atómicos.
- No implementar autenticación.
- Coordinar cambios de reportes con contratos.

## Criterio de cierre de tarea

Una tarea está lista cuando:

- Cumple el alcance definido.
- Respeta contratos API.
- Respeta roles.
- No toca apps ajenas sin justificarlo.
- Incluye pasos de prueba.
- Documenta riesgos o pendientes.
