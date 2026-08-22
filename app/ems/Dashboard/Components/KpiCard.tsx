"use client";
import type { ComponentType, ReactNode, SVGProps } from "react";

export type KpiAccent = "primary" | "secondary" | "accent" | "warning" | "danger";

/** Explicit class strings per accent so Tailwind's scanner sees them. */
const ACCENT: Record<KpiAccent, { border: string; tile: string; value: string }> = {
  primary: {
    border: "border-r-4 border-primary-400",
    tile: "bg-primary-50 text-primary-600",
    value: "text-primary-700",
  },
  secondary: {
    border: "border-r-4 border-secondary-400",
    tile: "bg-secondary-50 text-secondary-600",
    value: "text-secondary-700",
  },
  accent: {
    border: "border-r-4 border-accent-400",
    tile: "bg-accent-50 text-accent-600",
    value: "text-accent-700",
  },
  warning: {
    border: "border-r-4 border-warning-400",
    tile: "bg-warning-50 text-warning-600",
    value: "text-warning-700",
  },
  danger: {
    border: "border-r-4 border-danger-400",
    tile: "bg-danger-50 text-danger-600",
    value: "text-danger-700",
  },
};

export const kpiAccentClasses = (a: KpiAccent) => ACCENT[a];

type Props = {
  label: string;
  value: ReactNode;
  sub?: ReactNode;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  accent?: KpiAccent;
  loading?: boolean;
  className?: string;
  children?: ReactNode;
};

export default function KpiCard({
  label,
  value,
  sub,
  icon: Icon,
  accent = "primary",
  loading = false,
  className = "",
  children,
}: Props) {
  const a = ACCENT[accent];
  return (
    <div
      className={`kpi-card ${a.border} transition-shadow duration-200 hover:shadow-card-hover ${className}`}
      aria-busy={loading || undefined}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-medium text-gray-600">{label}</p>
          {loading ? (
            <div className="mt-2 h-7 w-28 skeleton-shimmer" aria-hidden="true" />
          ) : (
            <p
              className={`mt-1 truncate text-2xl font-bold leading-tight tabular-nums ${a.value}`}
              dir="ltr"
              style={{ textAlign: "right" }}
            >
              {value}
            </p>
          )}
          {sub !== undefined && (
            <p className="mt-1 truncate text-xs text-gray-500 tabular-nums">{sub}</p>
          )}
        </div>
        <span
          className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${a.tile}`}
          aria-hidden="true"
        >
          <Icon className="h-5 w-5" />
        </span>
      </div>
      {children}
    </div>
  );
}
