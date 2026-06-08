# Modelos compartidos

StockTrack360 usa JavaScript, por eso los modelos se documentan en `docs/api-contracts.md` y `docs/openapi.yaml` en vez de interfaces TypeScript.

Convenciones:

- API JSON: `camelCase`.
- Base de datos PostgreSQL/Supabase: tablas y columnas en `snake_case`.
- Entidades conceptuales: `PascalCase`.

Modelos definidos:

- `User`
- `Role`
- `Category`
- `Product`
- `InventoryMovement`
- `LowStockAlert`
- `ExpirationAlert`
- `DashboardSummary`
- `ReportItem`
