import { ModulePlaceholder } from "@/features/shared/ModulePlaceholder";

export default function ReportsRoute() {
  return (
    <ModulePlaceholder
      description="Reportes básicos de stock bajo, vencimientos y productos con más salidas."
      highlights={[
        { label: "Stock bajo", status: "Reporte", value: "0", variant: "danger" },
        { label: "Vencimientos", status: "Reporte", value: "0", variant: "warning" },
        { label: "Más salidas", status: "Ranking", value: "0" },
      ]}
      pattern="reports"
      title="Reportes"
    />
  );
}
