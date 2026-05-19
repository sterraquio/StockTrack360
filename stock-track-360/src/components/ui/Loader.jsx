import { classNames } from "@/utils/classNames";
import { USER_MESSAGES } from "@/utils/messages";

export function Loader({
  className,
  label = USER_MESSAGES.loading,
  rows = 4,
  variant = "spinner",
}) {
  if (variant === "skeleton") {
    return (
      <div className={classNames("space-y-3", className)} role="status">
        {Array.from({ length: rows }).map((_, index) => (
          <div
            className="h-10 animate-pulse rounded-lg bg-neutral-soft"
            key={index}
          />
        ))}
        <span className="sr-only">{label}</span>
      </div>
    );
  }

  return (
    <div
      className={classNames(
        "flex items-center justify-center gap-3 text-sm text-text-muted",
        variant === "page" && "min-h-64",
        className,
      )}
      role="status"
    >
      <span className="h-5 w-5 rounded-full border-2 border-border-default border-t-primary animate-spin" />
      <span>{label}</span>
    </div>
  );
}
