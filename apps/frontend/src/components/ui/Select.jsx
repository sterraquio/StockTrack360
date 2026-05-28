"use client";

import { classNames } from "@/utils/classNames";

export function Select({
  className,
  error,
  helperText,
  id,
  label,
  options = [],
  placeholder = "Selecciona una opción",
  ...props
}) {
  const selectId = id ?? props.name;

  return (
    <div className="space-y-1.5">
      {label ? (
        <label
          className="block text-sm font-semibold text-text-body"
          htmlFor={selectId}
        >
          {label}
        </label>
      ) : null}
      <select
        className={classNames(
          "w-full rounded-lg border bg-surface px-4 py-2.5 text-sm text-text-body transition-colors duration-150 focus:outline-none focus:ring-2",
          error
            ? "border-red-300 focus:border-danger focus:ring-danger"
            : "border-border-input focus:border-primary focus:ring-primary",
          props.disabled && "cursor-not-allowed opacity-50",
          className,
        )}
        id={selectId}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? (
        <p className="text-xs font-medium text-danger">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-text-muted">{helperText}</p>
      ) : null}
    </div>
  );
}
