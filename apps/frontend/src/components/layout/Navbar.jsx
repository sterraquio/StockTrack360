export function Navbar({ actions, title = "StockTrack360", userMenu }) {
  return (
    <header className="sticky top-0 z-20 flex min-h-16 items-center justify-between gap-4 border-b border-border-default bg-surface px-4 md:px-8">
      <h2 className="text-lg font-bold tracking-tight text-text-heading">
        {title}
      </h2>
      <div className="flex items-center gap-3">
        {actions}
        {userMenu}
      </div>
    </header>
  );
}
