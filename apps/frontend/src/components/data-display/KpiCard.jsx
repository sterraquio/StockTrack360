import { Badge, Card } from "@/components/ui";
import { classNames } from "@/utils/classNames";

const toneClasses = {
  danger: "bg-danger-soft text-danger",
  info: "bg-primary-soft text-primary",
  neutral: "bg-neutral-soft text-text-muted",
  success: "bg-success-soft text-success",
  warning: "bg-warning-soft text-warning-strong",
};

export function KpiCard({
  className,
  helperText,
  label,
  marker,
  status,
  value,
  variant = "neutral",
}) {
  return (
    <Card className={className} variant="kpi">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-text-muted">{label}</p>
          <p className="mt-2 text-3xl font-bold text-text-heading">{value}</p>
          {helperText ? (
            <p className="mt-2 text-xs text-text-muted">{helperText}</p>
          ) : null}
        </div>
        {status ? (
          <Badge variant={variant}>{status}</Badge>
        ) : marker ? (
          <span
            className={classNames(
              "flex h-10 w-10 items-center justify-center rounded-xl text-xs font-bold",
              toneClasses[variant] ?? toneClasses.neutral,
            )}
          >
            {marker}
          </span>
        ) : null}
      </div>
    </Card>
  );
}
