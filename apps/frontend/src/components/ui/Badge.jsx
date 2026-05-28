import { classNames } from "@/utils/classNames";

const variants = {
  danger: "border-red-200 bg-red-100 text-red-700",
  info: "border-blue-200 bg-blue-50 text-blue-700",
  neutral: "border-slate-200 bg-slate-100 text-slate-800",
  success: "border-emerald-200 bg-emerald-100 text-emerald-800",
  warning: "border-amber-200 bg-amber-100 text-amber-700",
};

export function Badge({ children, className, variant = "neutral" }) {
  return (
    <span
      className={classNames(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold",
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
