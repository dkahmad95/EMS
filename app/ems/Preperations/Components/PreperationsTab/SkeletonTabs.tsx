"use client";

import { Skeleton } from "@/app/Components/Skeleton";

export default function TabsSkeleton({ count = 5 }: { count?: number }) {
  return (
    <ul className="space-y-2 mt-4" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <li key={i} className="settings-list-item">
          <Skeleton className="h-4" style={{ width: `${120 + (i % 3) * 40}px` }} />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <Skeleton className="h-8 w-8 rounded-lg" />
          </div>
        </li>
      ))}
    </ul>
  );
}
