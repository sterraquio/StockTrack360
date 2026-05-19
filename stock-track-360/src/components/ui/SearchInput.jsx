"use client";

import { classNames } from "@/utils/classNames";

export function SearchInput({
  className,
  onChange,
  placeholder = "Buscar por nombre o SKU...",
  value,
  ...props
}) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-sm text-text-muted">
        Buscar
      </span>
      <input
        className={classNames(
          "w-full rounded-lg border border-border-input bg-surface py-2.5 pl-20 pr-4 text-sm text-text-body placeholder:text-text-muted transition-colors duration-150 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        onChange={(event) => onChange?.(event.target.value)}
        placeholder={placeholder}
        type="search"
        value={value}
        {...props}
      />
    </div>
  );
}
