const Loader = ({ borderColor = "primary" }: { borderColor?: string }) => {
  const colorMap: Record<string, string> = {
    primary: "border-primary-500",
    secondary: "border-secondary-500",
    accent: "border-accent-500",
    success: "border-success-500",
    warning: "border-warning-500",
    danger: "border-danger-500",
    white: "border-white",
  };

  const spinnerColor = colorMap[borderColor] || colorMap.primary;

  return (
    <div className="flex items-center justify-center">
      <div
        className={`animate-spin rounded-full h-5 w-5 border-t-4 border-b-4 ${spinnerColor} border-opacity-75`}
      ></div>
    </div>
  );
};

export default Loader;
