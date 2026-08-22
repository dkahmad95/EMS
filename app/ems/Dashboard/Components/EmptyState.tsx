"use client";
import { InboxIcon } from "@heroicons/react/24/outline";
import { Button } from "@/app/Components/Button";

type Props = {
  message?: string;
  hint?: string;
  onReset?: () => void;
  compact?: boolean;
};

export default function EmptyState({
  message = "لا توجد بيانات للفلاتر المحددة",
  hint,
  onReset,
  compact = false,
}: Props) {
  return (
    <div
      className={`flex h-full w-full flex-col items-center justify-center text-center ${
        compact ? "gap-2 py-4" : "gap-3 py-8"
      }`}
      role="status"
    >
      <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
        <InboxIcon className="h-6 w-6" aria-hidden="true" />
      </span>
      <p className="text-sm font-semibold text-gray-700">{message}</p>
      {hint && <p className="text-xs text-gray-500">{hint}</p>}
      {onReset && (
        <Button variant="outline" size="sm" onClick={onReset} className="mt-1">
          إعادة تعيين الفلاتر
        </Button>
      )}
    </div>
  );
}
