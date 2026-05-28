import { classNames } from "@/utils/classNames";

const sizes = {
  default: "max-w-6xl",
  full: "max-w-none",
  wide: "max-w-7xl",
};

export function PageContainer({ children, className, size = "default" }) {
  return (
    <main
      className={classNames(
        "mx-auto w-full space-y-6 p-4 md:p-8",
        sizes[size],
        className,
      )}
    >
      {children}
    </main>
  );
}
