import { Button } from "@/components/ui";
import { ModulePlaceholder } from "@/features/shared/ModulePlaceholder";

export default function MovementsRoute() {
  return (
    <ModulePlaceholder
      actions={
        <>
          <Button variant="secondary">Registrar entrada</Button>
          <Button variant="danger">Registrar salida</Button>
        </>
      }
      description="Registro de entradas, salidas e historial de movimientos."
      highlights={[
        { label: "Entradas", status: "Éxito", value: "0", variant: "success" },
        { label: "Salidas", status: "Control", value: "0", variant: "danger" },
        { label: "Historial", status: "Reciente", value: "Ordenado" },
      ]}
      pattern="movements"
      title="Movimientos de inventario"
    />
  );
}
