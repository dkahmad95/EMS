"use client";
import { MapPinIcon } from "@heroicons/react/24/outline";
import { kpiAccentClasses } from "./KpiCard";
import { fmtNum } from "../utils/chartTheme";

type Props = {
  counts: { name: string; count: number }[];
  loading?: boolean;
  className?: string;
};

const TOP = 6;

/** Revenue record counts per destination: top 6 chips + "+k" overflow. */
export default function DestinationsKpiCard({ counts, loading = false, className = "" }: Props) {
  const a = kpiAccentClasses("accent");
  const top = counts.slice(0, TOP);
  const rest = counts.length - top.length;

  return (
    <div
      className={`kpi-card ${a.border} transition-shadow duration-200 hover:shadow-card-hover ${className}`}
      aria-busy={loading || undefined}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-medium text-gray-600">الوجهات</p>
          {loading ? (
            <div className="mt-2 h-7 w-16 skeleton-shimmer" aria-hidden="true" />
          ) : (
            <p className={`mt-1 text-2xl font-bold leading-tight tabular-nums ${a.value}`}>
              {fmtNum(counts.length, 0)}
            </p>
          )}
          <p className="mt-1 text-xs text-gray-500">وجهة ضمن النتائج الحالية</p>
        </div>
        <span
          className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${a.tile}`}
          aria-hidden="true"
        >
          <MapPinIcon className="h-5 w-5" />
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5" aria-label="عدد الإيرادات لكل وجهة">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <span key={i} className="h-6 w-20 skeleton-shimmer rounded-full" aria-hidden="true" />
          ))
        ) : top.length === 0 ? (
          <span className="text-xs text-gray-400">لا توجد وجهات</span>
        ) : (
          <>
            {top.map((d) => (
              <span
                key={d.name}
                className="badge badge-gray gap-1.5 max-w-full"
                title={`${d.name}: ${fmtNum(d.count, 0)}`}
              >
                <span className="truncate">{d.name}</span>
                <span className="rounded-full bg-accent-100 px-1.5 text-[11px] font-semibold text-accent-700 tabular-nums">
                  {fmtNum(d.count, 0)}
                </span>
              </span>
            ))}
            {rest > 0 && (
              <span className="badge bg-gray-50 text-gray-500 border border-dashed border-gray-300 tabular-nums">
                +{fmtNum(rest, 0)}
              </span>
            )}
          </>
        )}
      </div>
    </div>
  );
}
