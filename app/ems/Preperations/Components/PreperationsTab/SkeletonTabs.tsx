"use client";

import { Skeleton } from "antd";

interface TabsSkeletonProps {
  count?: number;
}

export default function TabsSkeleton({ count = 3 }: TabsSkeletonProps) {
  return (
    <div className="flex gap-6 border-b pb-3">
      {Array.from({ length: count }).map((_, index) => (
        <Skeleton.Input
          key={index}
          active
          size="default"
          style={{
            width: 120,
            height: 32,
            borderRadius: 8,
          }}
        />
      ))}
    </div>
  );
}
