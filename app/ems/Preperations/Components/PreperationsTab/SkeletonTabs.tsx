"use client";

export default function TabsSkeleton({ count = 5 }: { count?: number }) {
  return (
    <ul className="space-y-2 mt-4">
      {Array.from({ length: count }).map((_, i) => (
        <li key={i} className="settings-list-item">
          <div className="skeleton-shimmer h-4 rounded" style={{ width: `${120 + (i % 3) * 40}px` }} />
          <div className="flex gap-2">
            <div className="skeleton-shimmer h-8 w-8 rounded-lg" />
            <div className="skeleton-shimmer h-8 w-8 rounded-lg" />
          </div>
        </li>
      ))}
    </ul>
  );
}
