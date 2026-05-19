import { Navbar } from "./Navbar.jsx";
import { Sidebar } from "./Sidebar.jsx";

export function AuthenticatedLayout({ children, role }) {
  return (
    <div className="min-h-screen bg-app-bg">
      <Sidebar role={role} />
      <div className="lg:pl-64">
        <Navbar title="Panel operativo" />
        {children}
      </div>
    </div>
  );
}
