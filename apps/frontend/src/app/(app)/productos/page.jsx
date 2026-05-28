import { Button } from "@/components/ui";
import { PermissionGate } from "@/features/auth/PermissionGate";
import { ModulePlaceholder } from "@/features/shared/ModulePlaceholder";
import { PERMISSIONS } from "@/utils/permissions";

export default function ProductsRoute() {
  return (
    <ModulePlaceholder
      actions={
        <PermissionGate permission={PERMISSIONS.MANAGE_PRODUCTS}>
          <Button>Agregar producto</Button>
        </PermissionGate>
      }
      description="Registro, consulta, edición y eliminación controlada de productos."
      highlights={[
        { label: "Catálogo", status: "Tabla", value: "0" },
        { label: "Categorías", status: "Filtro", value: "Predefinidas" },
        { label: "SKU", status: "Único", value: "Activo", variant: "success" },
      ]}
      pattern="products"
      title="Productos"
    />
  );
}
