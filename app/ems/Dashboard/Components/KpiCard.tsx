"use client";
import type { ComponentType, ReactNode, SVGProps } from "react";

export type KpiAccent = "primary" | "secondary" | "accent" | "warning" | "danger";

/** Explicit class strings per accent so Tailwind's scanner sees them. The icon tile and the value color carry the accent. */
const ACCENT: Record<KpiAccent, { tile: string; value: string }> = {
  primary: {
    tile: "bg-primary-50 text-primary-600",
    value: "text-primary-700",
  },
  secondary: {
    tile: "bg-secondary-50 text-secondary-600",
    value: "text-secondary-700",
  },
  accent: {
    tile: "bg-accent-50 text-accent-600",
    value: "text-accent-700",
  },
  warning: {
    tile: "bg-warning-50 text-warning-600",
    value: "text-warning-700",
  },
  danger: {
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
    <div className={`kpi-card ${className}`} aria-busy={loading || undefined}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-medium text-gray-600">{label}</p>
          {loading ? (
            <div className="mt-2 h-7 w-28 skeleton-shimmer" aria-hidden="true" />
          ) : (
            <p
              className={`mt-1 truncate text-end text-2xl font-bold leading-tight tabular-nums ${a.value}`}
              dir="ltr"
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
