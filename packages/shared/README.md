# Shared

Paquete compartido para constantes, contratos y utilidades puras reutilizables entre apps.

Este paquete no debe contener logica de negocio ni llamadas HTTP. Su objetivo es evitar que frontend, gateway y microservicios dupliquen nombres de rutas, roles, codigos de error o tipos de movimiento.

## Contenido

- `src/contracts/ApiRoutes.js`: rutas publicas del API Gateway y rutas internas de microservicios.
- `src/contracts/ApiErrors.js`: formato y codigos de error compartidos.
- `src/constants/Roles.js`: roles persistidos permitidos.
- `src/constants/MovementTypes.js`: tipos validos de movimientos de inventario.

## Regla

Las apps pueden importar constantes desde `@stocktrack360/shared`, pero no deben importar codigo de infraestructura ni depender unas de otras.
