export function DataTableSkeleton() {
  return (
    <div className="rounded-xl border border-gray-200 overflow-hidden bg-white shadow-card">
      {/* Header row */}
      <div className="bg-gray-50 border-b-2 border-gray-200 px-4 py-3 flex items-center gap-4">
        <div className="skeleton-shimmer h-4 w-4 rounded" />
        {[180, 140, 130, 150, 120, 110, 140].map((w, i) => (
          <div key={i} className="skeleton-shimmer h-4 rounded" style={{ width: `${w}px` }} />
        ))}
      </div>

      {/* Data rows */}
      {[...Array(6)].map((_, rowIdx) => (
        <div
          key={rowIdx}
          className="px-4 py-3.5 flex items-center gap-4 border-b border-gray-100 last:border-0"
        >
          <div className="skeleton-shimmer h-4 w-4 rounded" />
          {[160, 100, 110, 130, 90, 80, 120].map((w, colIdx) => (
            <div
              key={colIdx}
              className="skeleton-shimmer h-3.5 rounded"
              style={{ width: `${w - (rowIdx % 3) * 10}px` }}
            />
          ))}
        </div>
      ))}

      {/* Footer */}
      <div className="bg-gray-50 border-t-2 border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="skeleton-shimmer h-4 w-40 rounded" />
        <div className="flex gap-2">
          <div className="skeleton-shimmer h-8 w-8 rounded-lg" />
          <div className="skeleton-shimmer h-8 w-8 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
