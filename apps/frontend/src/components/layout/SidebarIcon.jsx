const icons = {
  alerts: AlertIcon,
  dashboard: DashboardIcon,
  inventory: InventoryIcon,
  movements: MovementsIcon,
  products: ProductsIcon,
  reports: ReportsIcon,
  users: UsersIcon,
};

export function SidebarIcon({ className, name }) {
  const Icon = icons[name] ?? DashboardIcon;

  return <Icon aria-hidden="true" className={className} />;
}

function DashboardIcon(props) {
  return (
    <svg fill="none" viewBox="0 0 24 24" {...props}>
      <path
        d="M4 13h6V4H4v9Zm10 7h6V4h-6v16ZM4 20h6v-3H4v3Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function ProductsIcon(props) {
  return (
    <svg fill="none" viewBox="0 0 24 24" {...props}>
      <path
        d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path
        d="M4.5 8 12 12.25 19.5 8M12 12.25V21"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function InventoryIcon(props) {
  return (
    <svg fill="none" viewBox="0 0 24 24" {...props}>
      <path
        d="M5 7h14M7 7V5.5A2.5 2.5 0 0 1 9.5 3h5A2.5 2.5 0 0 1 17 5.5V7m-9 4h8m-8 4h5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path
        d="M5 7h14v13H5V7Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function MovementsIcon(props) {
  return (
    <svg fill="none" viewBox="0 0 24 24" {...props}>
      <path
        d="M7 7h11m0 0-3-3m3 3-3 3M17 17H6m0 0 3 3m-3-3 3-3"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function AlertIcon(props) {
  return (
    <svg fill="none" viewBox="0 0 24 24" {...props}>
      <path
        d="M12 4 3.5 19h17L12 4Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path
        d="M12 9v4m0 3h.01"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function ReportsIcon(props) {
  return (
    <svg fill="none" viewBox="0 0 24 24" {...props}>
      <path
        d="M5 20V10m7 10V4m7 16v-7"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
      />
      <path
        d="M4 20h16"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function UsersIcon(props) {
  return (
    <svg fill="none" viewBox="0 0 24 24" {...props}>
      <path
        d="M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 3c-3.5 0-6 1.7-6 4v2h12v-2c0-2.3-2.5-4-6-4Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path
        d="M16 11a3 3 0 1 0 0-6m1 9c2.4.4 4 1.8 4 3.7V20h-3"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}
