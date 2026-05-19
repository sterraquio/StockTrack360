export function EmptyState({
  action,
  description,
  icon,
  title = "Sin resultados",
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-border-default bg-surface p-8 text-center shadow-card">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-soft text-sm font-bold text-text-muted">
        {icon ?? "ST"}
      </div>
      <h2 className="text-lg font-bold tracking-tight text-text-heading">
        {title}
      </h2>
      {description ? (
        <p className="mt-2 max-w-md text-sm text-text-muted">{description}</p>
      ) : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
