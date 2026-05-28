"use client";

import { classNames } from "@/utils/classNames";

const variants = {
  primary:
    "bg-primary text-white shadow-sm hover:bg-primary-hover focus:ring-primary",
  secondary:
    "border border-border-input bg-surface text-text-body shadow-sm hover:bg-slate-50 focus:ring-primary",
  danger:
    "bg-danger text-white shadow-sm hover:bg-danger-hover focus:ring-danger",
  ghost: "text-text-body hover:bg-slate-100 focus:ring-primary",
  icon: "text-text-muted hover:bg-slate-100 hover:text-text-primary focus:ring-primary",
};

const sizes = {
  sm: "h-9 px-3 text-xs",
  md: "h-10 px-5 text-sm",
  lg: "h-12 px-6 text-base",
  icon: "h-10 w-10 p-0",
};

export function Button({
  children,
  className,
  disabled = false,
  leftIcon,
  loading = false,
  rightIcon,
  size = "md",
  type = "button",
  variant = "primary",
  ...props
}) {
  const isIcon = variant === "icon";

  return (
    <button
      className={classNames(
        "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2",
        variants[variant],
        sizes[isIcon ? "icon" : size],
        (disabled || loading) && "cursor-not-allowed opacity-50",
        className,
      )}
      disabled={disabled || loading}
      type={type}
      {...props}
    >
      {loading ? (
        <span className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
      ) : (
        leftIcon
      )}
      {children}
      {!loading && rightIcon}
    </button>
  );
}
