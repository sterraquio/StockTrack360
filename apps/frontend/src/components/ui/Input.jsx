"use client";

import { classNames } from "@/utils/classNames";

export function Input({
  className,
  error,
  helperText,
  id,
  label,
  success = false,
  ...props
}) {
  const inputId = id ?? props.name;

  return (
    <div className="space-y-1.5">
      {label ? (
        <label
          className="block text-sm font-semibold text-text-body"
          htmlFor={inputId}
        >
          {label}
        </label>
      ) : null}
      <input
        className={classNames(
          "w-full rounded-lg border bg-surface px-4 py-2.5 text-sm text-text-body placeholder:text-text-muted transition-colors duration-150 focus:outline-none focus:ring-2",
          error
            ? "border-red-300 focus:border-danger focus:ring-danger"
            : success
              ? "border-emerald-300 focus:border-success focus:ring-success"
              : "border-border-input focus:border-primary focus:ring-primary",
          props.disabled && "cursor-not-allowed opacity-50",
          className,
        )}
        id={inputId}
        {...props}
      />
      {error ? (
        <p className="text-xs font-medium text-danger">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-text-muted">{helperText}</p>
      ) : null}
    </div>
  );
}
