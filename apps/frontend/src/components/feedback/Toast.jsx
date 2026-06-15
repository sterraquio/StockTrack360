import { classNames } from "@/utils/classNames";

const variants = {
  error: "border-danger/30 bg-danger-soft text-danger",
  info: "border-primary/30 bg-primary-soft text-primary",
  success: "border-success/30 bg-success-soft text-success",
  warning: "border-warning/40 bg-warning-soft text-warning-strong",
};

const markers = {
  error: "Error",
  info: "Info",
  success: "OK",
  warning: "Aviso",
};

export function Toast({ children, className, title, variant = "info" }) {
  return (
    <div
      className={classNames(
        "fixed bottom-5 left-5 z-50 flex w-[calc(100vw-2.5rem)] max-w-md gap-3 rounded-xl border px-5 py-4 text-sm shadow-lg lg:left-72",
        "motion-safe:animate-[toast-in_180ms_var(--ease-standard)]",
        variants[variant],
        className,
      )}
      role={variant === "error" ? "alert" : "status"}
    >
      <span className="shrink-0 text-xs font-bold uppercase">
        {markers[variant]}
      </span>
      <div className="space-y-1">
        {title ? <p className="font-bold">{title}</p> : null}
        <div className="font-medium">{children}</div>
      </div>
    </div>
  );
}
