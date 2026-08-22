"use client";

const Bar = ({ className = "" }: { className?: string }) => (
  <div className={`skeleton-shimmer ${className}`} aria-hidden="true" />
);

export function KpiSkeleton() {
  return (
    <div className="kpi-card border-r-4 border-gray-200">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 space-y-3">
          <Bar className="h-3 w-24" />
          <Bar className="h-7 w-32" />
          <Bar className="h-3 w-20" />
        </div>
        <Bar className="h-10 w-10 rounded-xl" />
      </div>
    </div>
  );
}

export function ChartSkeleton({ bodyOnly = false }: { bodyOnly?: boolean }) {
  const body = (
    <div className="flex h-full w-full items-end gap-2 px-2 pb-2" aria-hidden="true">
      {[55, 80, 40, 95, 60, 72, 35, 88].map((h, i) => (
        <div key={i} className="skeleton-shimmer flex-1" style={{ height: `${h}%` }} />
      ))}
    </div>
  );
  if (bodyOnly) return body;
  return (
    <div className="card p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="space-y-2">
          <Bar className="h-4 w-40" />
          <Bar className="h-3 w-28" />
        </div>
        <Bar className="h-3 w-24" />
      </div>
      <div className="h-[280px] md:h-[340px]">{body}</div>
    </div>
  );
}

export function TableSkeleton() {
  return (
    <div className="card p-5">
      <div className="mb-4 flex items-center justify-between">
        <Bar className="h-4 w-32" />
        <Bar className="h-5 w-16 rounded-full" />
      </div>
      <div className="space-y-2">
        <Bar className="h-10 w-full" />
        {Array.from({ length: 8 }).map((_, i) => (
          <Bar key={i} className="h-9 w-full" />
        ))}
      </div>
    </div>
  );
}

/** Full-page placeholder mirroring the real dashboard grid (used by next/dynamic loading). */
export function DashboardSkeleton() {
  return (
    <div className="space-y-5" aria-busy="true" aria-label="جارٍ تحميل لوحة التحليل">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <Bar className="h-7 w-44" />
          <Bar className="h-3 w-64" />
        </div>
        <div className="flex gap-2">
          <Bar className="h-7 w-36 rounded-full" />
          <Bar className="h-7 w-28 rounded-full" />
        </div>
      </div>
      <div className="card p-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Bar key={i} className="h-10 w-full" />
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <KpiSkeleton key={i} />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="xl:col-span-2">
          <KpiSkeleton />
        </div>
        <KpiSkeleton />
        <KpiSkeleton />
      </div>
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <ChartSkeleton key={i} />
        ))}
      </div>
      <ChartSkeleton />
      <TableSkeleton />
    </div>
  );
}
