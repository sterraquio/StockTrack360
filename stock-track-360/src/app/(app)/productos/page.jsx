import { Button } from "@/components/ui";
import { ModulePlaceholder } from "@/features/shared/ModulePlaceholder";

export default function ProductsRoute() {
  return (
    <ModulePlaceholder
      actions={<Button>Agregar producto</Button>}
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
