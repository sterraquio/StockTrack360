import { ModulePlaceholder } from "@/features/shared/ModulePlaceholder";

export default function AlertsRoute() {
  return (
    <ModulePlaceholder
      description="Alertas de stock bajo, productos vencidos y próximos a vencer."
      highlights={[
        { label: "Stock bajo", status: "Crítico", value: "0", variant: "danger" },
        { label: "Vencidos", status: "Crítico", value: "0", variant: "danger" },
        { label: "Por vencer", status: "Aviso", value: "0", variant: "warning" },
      ]}
      pattern="alerts"
      title="Alertas"
    />
  );
}
