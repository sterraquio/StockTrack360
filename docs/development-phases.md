# Fases de desarrollo - StockTrack360

## Propósito

Este documento define el orden de trabajo para desarrollar StockTrack360 como monorepo con 5 apps principales:

- `apps/frontend`
- `apps/api-gateway`
- `apps/auth-service`
- `apps/inventory-service`
- `apps/reporting-alerts-service`

Cada fase debe cerrarse con evidencia mínima, revisión de contratos cuando aplique y actualización documental si cambian decisiones técnicas.

## Fase 0: Diagnóstico

- Revisar estado real del repositorio.
- Identificar qué existe en `apps/`, `packages/`, `docs/` y la carpeta legacy `stock-track-360/`.
- Detectar contradicciones entre documentos.
- Confirmar que el alcance sigue alineado con `docs/project-context.md`.

Salida esperada:

- Diagnóstico breve.
- Riesgos o bloqueos.
- Plan de trabajo por fase.

## Fase 1: Estructura monorepo

- Confirmar estructura oficial de `apps/*` y `packages/shared`.
- Mantener máximo 5 apps principales.
- No mover código legacy sin plan específico.
- Documentar la carpeta `stock-track-360/` como temporal si sigue existiendo.

Salida esperada:

- Estructura base clara.
- README raíz actualizado.
- README mínimo por app si se trabaja esa app.

## Fase 2: Contratos API

- Definir contratos en `docs/api-contracts.md`.
- Mantener especificación técnica en `docs/openapi.yaml`.
- Confirmar rutas públicas bajo `/api`.
- Confirmar rutas internas bajo `/internal`.
- Confirmar que el frontend consume solo el API Gateway.

Salida esperada:

- Contratos completos antes de implementar integración.
- Rutas, métodos, body, params, query, headers, respuestas, errores, roles y validaciones.

## Fase 3: Frontend base

- Preparar `apps/frontend`.
- Implementar layout autenticado base.
- Configurar consumo del API Gateway.
- Crear o migrar componentes compartidos respetando `docs/design-system.md`.
- Implementar pantallas base y estados loading, empty y error.

Salida esperada:

- Frontend ejecutable.
- Componentes compartidos reutilizables.
- Sin llamadas directas a microservicios internos.

## Fase 4: API Gateway base

- Preparar `apps/api-gateway`.
- Exponer rutas públicas bajo `/api`.
- Configurar CORS.
- Normalizar errores.
- Reenviar JWT a servicios internos.
- Redirigir peticiones a auth, inventory y reporting-alerts.

Salida esperada:

- Gateway ejecutable.
- Rutas base conectadas a servicios o mocks temporales documentados.

## Fase 5: Auth Service

- Implementar `apps/auth-service`.
- Login con mensaje genérico de error.
- JWT con usuario y rol.
- Validación de usuario activo.
- Gestión administrativa de usuarios.
- Roles `ADMINISTRADOR` y `USUARIO`.

Salida esperada:

- Auth funcional.
- Rutas internas `/internal/auth/*` y `/internal/users`.
- Validaciones de seguridad básicas.

## Fase 6: Inventory Service

- Implementar `apps/inventory-service`.
- Productos y categorías predefinidas.
- Stock actual y stock mínimo.
- Entradas y salidas.
- Historial de movimientos.
- Actualización atómica de stock.

Salida esperada:

- Gestión de productos e inventario funcional.
- Movimientos consistentes.
- Stock nunca negativo.

## Fase 7: Reporting Alerts Service

- Implementar `apps/reporting-alerts-service`.
- Alertas de stock bajo.
- Productos vencidos.
- Productos próximos a vencer en 7 y 30 días.
- Dashboard.
- Reportes básicos.

Salida esperada:

- Consultas de alertas y reportes funcionando.
- Dashboard con indicadores del MVP.

## Fase 8: Integración frontend-gateway-servicios

- Conectar frontend con API Gateway.
- Conectar API Gateway con servicios internos.
- Validar flujos completos por rol.
- Ajustar errores, estados vacíos y mensajes.

Salida esperada:

- Flujo integrado de login, usuarios, productos, movimientos, alertas, dashboard y reportes.
- Contratos actualizados si hubo ajustes.

## Fase 9: Pruebas manuales

- Probar historias principales del MVP.
- Verificar permisos por rol.
- Probar búsqueda, filtros y paginación.
- Probar entradas y salidas.
- Probar alertas y reportes.

Salida esperada:

- Checklist de pruebas.
- Evidencias para entrega académica.
- Bugs documentados o corregidos.

## Fase 10: Documentación y evidencias finales

- Actualizar README.
- Actualizar documentos de arquitectura, contratos y uso.
- Preparar evidencias finales.
- Registrar pendientes y riesgos.

Salida esperada:

- Documentación consistente.
- Evidencias de ejecución.
- Lista clara de pendientes fuera del MVP.
