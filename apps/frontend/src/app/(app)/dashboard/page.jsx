import { ModulePlaceholder } from "@/features/shared/ModulePlaceholder";

export default function DashboardRoute() {
  return (
    <ModulePlaceholder
      description="Indicadores principales de inventario, movimientos y alertas."
      highlights={[
        { label: "Productos", status: "KPI", value: "0" },
        { label: "Stock bajo", status: "Alerta", value: "0", variant: "danger" },
        { label: "Próximos a vencer", status: "Aviso", value: "0", variant: "warning" },
      ]}
      pattern="dashboard"
      title="Dashboard"
    />
  );
}
