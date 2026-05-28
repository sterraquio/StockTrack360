import { AuthenticatedLayout } from "@/components/layout";

export default function AppLayout({ children }) {
  return <AuthenticatedLayout>{children}</AuthenticatedLayout>;
}
