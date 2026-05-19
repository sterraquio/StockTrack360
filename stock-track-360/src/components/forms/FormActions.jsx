import { classNames } from "@/utils/classNames";

export function FormActions({
  align = "end",
  children,
  className,
  stackedOnMobile = true,
}) {
  return (
    <div
      className={classNames(
        "flex gap-3 border-t border-border-default pt-4",
        stackedOnMobile ? "flex-col-reverse sm:flex-row" : "flex-row",
        align === "between" && "sm:justify-between",
        align === "start" && "sm:justify-start",
        align === "end" && "sm:justify-end",
        className,
      )}
    >
      {children}
    </div>
  );
}
