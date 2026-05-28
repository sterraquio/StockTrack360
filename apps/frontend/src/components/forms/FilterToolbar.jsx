import { classNames } from "@/utils/classNames";

export function FilterToolbar({ actions, children, className }) {
  return (
    <section
      className={classNames(
        "flex flex-col gap-4 rounded-xl border border-border-default bg-surface p-4 shadow-card lg:flex-row lg:items-end lg:justify-between",
        className,
      )}
    >
      <div className="grid flex-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {children}
      </div>
      {actions ? (
        <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
          {actions}
        </div>
      ) : null}
    </section>
  );
}
