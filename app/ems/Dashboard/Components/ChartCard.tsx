"use client";
import type { ReactNode } from "react";
import EmptyState from "./EmptyState";
import { ChartSkeleton } from "./Skeletons";

type Props = {
  title: string;
  subtitle?: string;
  /** Header slot (legend / segmented control). */
  header?: ReactNode;
  /** First load (no data yet) → skeleton body. */
  loading?: boolean;
  /** Background refetch with data on screen → dimmed body. */
  fetching?: boolean;
  empty?: boolean;
  onReset?: () => void;
  className?: string;
  children: ReactNode;
};

/** Card shell with a fixed-height chart body so layout never jumps. */
export default function ChartCard({
  title,
  subtitle,
  header,
  loading = false,
  fetching = false,
  empty = false,
  onReset,
  className = "",
  children,
}: Props) {
  return (
    <section className={`card flex flex-col p-5 ${className}`} aria-busy={loading || fetching || undefined}>
      <header className="mb-3 flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-gray-900 md:text-base">{title}</h2>
          {subtitle && <p className="mt-0.5 text-xs text-gray-500">{subtitle}</p>}
        </div>
        {header && <div className="flex items-center gap-2">{header}</div>}
      </header>

      <div
        className={`relative h-[280px] w-full md:h-[340px] transition-opacity duration-200 ${
          fetching && !loading ? "opacity-70" : "opacity-100"
        }`}
      >
        {loading ? (
          <ChartSkeleton bodyOnly />
        ) : empty ? (
          <EmptyState onReset={onReset} />
        ) : (
          children
        )}
      </div>
    </section>
  );
}
