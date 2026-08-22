"use client";
import type { ComponentType, SVGProps } from "react";
import { kpiAccentClasses, type KpiAccent } from "./KpiCard";
import { fmtNum } from "../utils/chartTheme";
import type { CollectionTotals } from "../utils/aggregate";

type Props = {
  title: string;
  totals: CollectionTotals;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  accent?: KpiAccent;
  loading?: boolean;
  caption?: string;
};

/** Two-number KPI (كفالة / حصالة) for collections or freezed collections. */
export default function CollectionsKpiCard({
  title,
  totals,
  icon: Icon,
  accent = "secondary",
  loading = false,
  caption = "حسب الموظف والتاريخ والمكتب",
}: Props) {
  const a = kpiAccentClasses(accent);
  const total = totals.SPONSORSHIP + totals.BOX;

  return (
    <div
      className={`kpi-card ${a.border} transition-shadow duration-200 hover:shadow-card-hover`}
      aria-busy={loading || undefined}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-medium text-gray-600">{title}</p>
          {loading ? (
            <div className="mt-2 h-7 w-24 skeleton-shimmer" aria-hidden="true" />
          ) : (
            <p className={`mt-1 text-2xl font-bold leading-tight tabular-nums ${a.value}`}>
              {fmtNum(total, 0)}
            </p>
          )}
        </div>
        <span
          className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${a.tile}`}
          aria-hidden="true"
        >
          <Icon className="h-5 w-5" />
        </span>
      </div>

      <dl className="mt-3 grid grid-cols-2 gap-2">
        <div className="rounded-lg bg-gray-50 px-3 py-2">
          <dt className="text-[11px] font-medium text-gray-500">كفالة</dt>
          <dd className="text-base font-semibold text-gray-900 tabular-nums">
            {loading ? "—" : fmtNum(totals.SPONSORSHIP, 0)}
          </dd>
        </div>
        <div className="rounded-lg bg-gray-50 px-3 py-2">
          <dt className="text-[11px] font-medium text-gray-500">حصالة</dt>
          <dd className="text-base font-semibold text-gray-900 tabular-nums">
            {loading ? "—" : fmtNum(totals.BOX, 0)}
          </dd>
        </div>
      </dl>

      {caption && <p className="mt-2 text-[11px] text-gray-500">{caption}</p>}
    </div>
  );
}
