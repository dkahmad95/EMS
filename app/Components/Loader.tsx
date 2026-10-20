import clsx from "clsx";

type LoaderProps = {
  /** Ring color. Keys of the color map; unknown values fall back to primary. */
  borderColor?: string;
  /** 16px / 24px / 40px. Default is `md`. */
  size?: "sm" | "md" | "lg";
  className?: string;
};

const colorMap: Record<string, string> = {
  primary: "border-primary-500",
  secondary: "border-secondary-500",
  accent: "border-accent-500",
  success: "border-success-500",
  warning: "border-warning-500",
  danger: "border-danger-500",
  gray: "border-gray-500",
  white: "border-white",
};

const sizeMap: Record<NonNullable<LoaderProps["size"]>, string> = {
  sm: "h-4 w-4 border-2",
  md: "h-6 w-6 border-2",
  lg: "h-10 w-10 border-[3px]",
};

const Loader = ({ borderColor = "primary", size = "md", className }: LoaderProps) => {
  const spinnerColor = colorMap[borderColor] ?? colorMap.primary;

  return (
    <div
      className={clsx("inline-flex items-center justify-center", className)}
      role="status"
      aria-label="جار التحميل"
    >
      <div
        className={clsx("animate-spin rounded-full border-t-transparent", sizeMap[size], spinnerColor)}
        aria-hidden="true"
      />
    </div>
  );
};

export default Loader;
