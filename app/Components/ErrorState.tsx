import * as React from "react";
import clsx from "clsx";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { Button } from "./Button";

export interface ErrorStateProps {
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  description?: string;
  action?: React.ReactNode;
  onRetry?: () => void;
  className?: string;
  compact?: boolean;
}

export function ErrorState({
  icon: Icon = ExclamationTriangleIcon,
  title,
  description,
  action,
  onRetry,
  className,
  compact = false,
}: ErrorStateProps) {
  return (
    <div
      className={clsx(
        "flex h-full w-full flex-col items-center justify-center text-center",
        compact ? "gap-2 py-4" : "gap-3 py-8",
        className,
      )}
      role="alert"
    >
      <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-danger-50 text-danger-600">
        <Icon className="h-6 w-6" aria-hidden="true" />
      </span>
      <div className="space-y-1">
        <p className="text-base font-semibold text-gray-900">{title}</p>
        {description && <p className="max-w-sm text-sm text-gray-500">{description}</p>}
      </div>
      {(onRetry || action) && (
        <div className="mt-1 flex items-center gap-2">
          {onRetry && (
            <Button variant="secondary" size="sm" onClick={onRetry}>
              إعادة المحاولة
            </Button>
          )}
          {action}
        </div>
      )}
    </div>
  );
}

export default ErrorState;
