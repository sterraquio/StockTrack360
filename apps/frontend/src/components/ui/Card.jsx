import { classNames } from "@/utils/classNames";

const variants = {
  default: "border-border-default",
  form: "border-border-default",
  interactive:
    "border-border-default transition-all duration-150 hover:bg-slate-50 hover:shadow-md",
  kpi: "border-border-soft",
};

export function Card({
  children,
  className,
  description,
  title,
  variant = "default",
}) {
  return (
    <section
      className={classNames(
        "rounded-xl border bg-surface p-6 shadow-card",
        variants[variant],
        className,
      )}
    >
      {title || description ? (
        <header className="mb-4 space-y-1">
          {title ? (
            <h2 className="text-lg font-bold tracking-tight text-text-heading">
              {title}
            </h2>
          ) : null}
          {description ? (
            <p className="text-sm text-text-muted">{description}</p>
          ) : null}
        </header>
      ) : null}
      {children}
    </section>
  );
}
