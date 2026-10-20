import * as React from "react";
import clsx from "clsx";

type SkeletonProps = React.HTMLAttributes<HTMLDivElement> & {
  /** `true` (default) uses the moving shimmer; `false` the plain pulse. */
  shimmer?: boolean;
};

/** One placeholder block. Radius comes from `.skeleton` / `.skeleton-shimmer` (md); override with rounded-lg only. */
export function Skeleton({ className, shimmer = true, ...rest }: SkeletonProps) {
  return (
    <div
      className={clsx(shimmer ? "skeleton-shimmer" : "skeleton", className)}
      aria-hidden="true"
      {...rest}
    />
  );
}

type SkeletonTextProps = {
  lines?: number;
  className?: string;
};

/** A few text-height bars; the last one is shorter so it reads as a paragraph. */
export function SkeletonText({ lines = 3, className }: SkeletonTextProps) {
  return (
    <div className={clsx("space-y-2", className)} aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className={clsx("h-3.5", i === lines - 1 && lines > 1 ? "w-2/3" : "w-full")} />
      ))}
    </div>
  );
}

type SkeletonTableProps = {
  rows?: number;
  cols?: number;
  /** Fill the parent's remaining flex height (matches DataTable fullHeight). */
  fullHeight?: boolean;
  /** Leading checkbox cell on each row. */
  selectable?: boolean;
  /** Pagination footer. */
  footer?: boolean;
  className?: string;
};

const HEADER_WIDTHS = [180, 140, 130, 150, 120, 110, 140];
const CELL_WIDTHS = [160, 100, 110, 130, 90, 80, 120];

/** Header row + data rows in a `.card`, mirroring DataTable's layout. */
export function SkeletonTable({
  rows = 6,
  cols = 7,
  fullHeight = false,
  selectable = true,
  footer = true,
  className,
}: SkeletonTableProps) {
  const headers = Array.from({ length: cols }, (_, i) => HEADER_WIDTHS[i % HEADER_WIDTHS.length]);
  const cells = Array.from({ length: cols }, (_, i) => CELL_WIDTHS[i % CELL_WIDTHS.length]);

  return (
    <div
      className={clsx("card overflow-hidden", fullHeight && "flex-1 min-h-0 flex flex-col", className)}
      aria-hidden="true"
    >
      <div className="bg-gray-50 border-b-2 border-gray-200 px-4 py-3 flex items-center gap-4 flex-none">
        {selectable && <Skeleton className="h-4 w-4" />}
        {headers.map((w, i) => (
          <Skeleton key={i} className="h-4" style={{ width: `${w}px` }} />
        ))}
      </div>

      <div className={clsx(fullHeight && "flex-1 min-h-0 overflow-hidden")}>
        {Array.from({ length: rows }).map((_, rowIdx) => (
          <div
            key={rowIdx}
            className="px-4 py-3.5 flex items-center gap-4 border-b border-gray-100 last:border-0"
          >
            {selectable && <Skeleton className="h-4 w-4" />}
            {cells.map((w, colIdx) => (
              <Skeleton
                key={colIdx}
                className="h-3.5"
                style={{ width: `${w - (rowIdx % 3) * 10}px` }}
              />
            ))}
          </div>
        ))}
      </div>

      {footer && (
        <div className="bg-gray-50 border-t-2 border-gray-200 px-4 py-3 flex items-center justify-between flex-none">
          <Skeleton className="h-4 w-40" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <Skeleton className="h-8 w-8 rounded-lg" />
          </div>
        </div>
      )}
    </div>
  );
}
