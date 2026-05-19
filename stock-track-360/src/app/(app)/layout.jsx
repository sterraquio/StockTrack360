import { AuthenticatedLayout } from "@/components/layout";
import { ROLES } from "@/utils/permissions";

export default function AppLayout({ children }) {
  return <AuthenticatedLayout role={ROLES.ADMIN}>{children}</AuthenticatedLayout>;
}
