import * as React from "react";
import clsx from "clsx";
import { InboxIcon } from "@heroicons/react/24/outline";

export interface EmptyStateProps {
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
  /** Tighter spacing for small containers (chart bodies, cells). */
  compact?: boolean;
}

export function EmptyState({
  icon: Icon = InboxIcon,
  title,
  description,
  action,
  className,
  compact = false,
}: EmptyStateProps) {
  return (
    <div
      className={clsx(
        "flex h-full w-full flex-col items-center justify-center text-center",
        compact ? "gap-2 py-4" : "gap-3 py-8",
        className,
      )}
      role="status"
    >
      <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-gray-400">
        <Icon className="h-6 w-6" aria-hidden="true" />
      </span>
      <div className="space-y-1">
        <p className="text-base font-semibold text-gray-900">{title}</p>
        {description && <p className="max-w-sm text-sm text-gray-500">{description}</p>}
      </div>
      {action && <div className="mt-1">{action}</div>}
    </div>
  );
}

export default EmptyState;
