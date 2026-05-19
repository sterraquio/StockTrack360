import { ModulePlaceholder } from "@/features/shared/ModulePlaceholder";

export default function InventoryRoute() {
  return (
    <ModulePlaceholder
      description="Consulta general de existencias con búsqueda, filtros y paginación."
      highlights={[
        { label: "Búsqueda", status: "Nombre/SKU", value: "Lista" },
        { label: "Paginación", status: "> 10", value: "Activa", variant: "success" },
        { label: "Stock 0", status: "Rojo", value: "Regla", variant: "danger" },
      ]}
      pattern="inventory"
      title="Inventario"
    />
  );
}
