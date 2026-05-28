import { classNames } from "@/utils/classNames";

const variants = {
  error: "border-red-200 bg-red-50 text-red-700",
  info: "border-blue-200 bg-blue-50 text-blue-700",
  success: "border-emerald-200 bg-emerald-50 text-emerald-700",
  warning: "border-amber-200 bg-amber-50 text-amber-700",
};

const markers = {
  error: "Error",
  info: "Info",
  success: "OK",
  warning: "Aviso",
};

export function Alert({ children, className, title, variant = "info" }) {
  return (
    <div
      className={classNames(
        "flex gap-3 rounded-lg border p-4 text-sm",
        variants[variant],
        className,
      )}
      role={variant === "error" ? "alert" : "status"}
    >
      <span className="shrink-0 text-xs font-bold uppercase">
        {markers[variant]}
      </span>
      <div className="space-y-1">
        {title ? <p className="font-semibold">{title}</p> : null}
        <div>{children}</div>
      </div>
    </div>
  );
}
