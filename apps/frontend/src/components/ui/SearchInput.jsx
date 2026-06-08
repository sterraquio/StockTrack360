"use client";

import { classNames } from "@/utils/classNames";

export function SearchInput({
  className,
  id,
  label,
  onChange,
  placeholder = "Buscar por nombre o SKU...",
  value,
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
      <div className="relative">
        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-text-muted">
          <svg
            aria-hidden="true"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="m21 21-4.3-4.3" />
            <circle cx="11" cy="11" r="8" />
          </svg>
        </span>
        <input
          className={classNames(
            "w-full rounded-lg border border-border-input bg-surface py-2.5 pl-10 pr-4 text-sm text-text-body placeholder:text-text-muted transition-colors duration-150 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50",
            className,
          )}
          id={inputId}
          onChange={(event) => onChange?.(event.target.value)}
          placeholder={placeholder}
          type="search"
          value={value}
          {...props}
        />
      </div>
    </div>
  );
}
