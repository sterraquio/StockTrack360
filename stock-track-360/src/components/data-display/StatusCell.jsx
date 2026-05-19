import { Badge } from "@/components/ui";
import { classNames } from "@/utils/classNames";

export function StatusCell({
  children,
  className,
  helperText,
  mono = false,
  variant = "neutral",
}) {
  return (
    <div className={classNames("flex flex-col gap-1", className)}>
      <div className="flex items-center gap-2">
        <Badge variant={variant}>{children}</Badge>
      </div>
      {helperText ? (
        <span
          className={classNames(
            "text-xs text-text-muted",
            mono && "font-mono",
          )}
        >
          {helperText}
        </span>
      ) : null}
    </div>
  );
}
