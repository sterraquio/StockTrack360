import { Button } from "@/components/ui";
import { ModulePlaceholder } from "@/features/shared/ModulePlaceholder";

export default function UsersRoute() {
  return (
    <ModulePlaceholder
      actions={<Button>Registrar usuario</Button>}
      description="Gestión de usuarios disponible solo para el rol ADMINISTRADOR."
      highlights={[
        { label: "Usuarios", status: "Admin", value: "0" },
        { label: "Roles", status: "RBAC", value: "2", variant: "success" },
        { label: "Correo", status: "Inmutable", value: "Regla" },
      ]}
      pattern="users"
      title="Usuarios"
    />
  );
}
