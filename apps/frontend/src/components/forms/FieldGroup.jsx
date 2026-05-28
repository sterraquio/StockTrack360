import { classNames } from "@/utils/classNames";

const columns = {
  1: "md:grid-cols-1",
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
};

export function FieldGroup({
  children,
  className,
  columns: columnCount = 2,
  description,
  title,
}) {
  return (
    <section className={classNames("space-y-4", className)}>
      {title || description ? (
        <header className="space-y-1">
          {title ? (
            <h3 className="text-lg font-bold tracking-tight text-text-heading">
              {title}
            </h3>
          ) : null}
          {description ? (
            <p className="text-sm text-text-muted">{description}</p>
          ) : null}
        </header>
      ) : null}
      <div
        className={classNames(
          "grid gap-4",
          columns[columnCount] ?? columns[2],
        )}
      >
        {children}
      </div>
    </section>
  );
}
