"use client";
import { EmptyState as SharedEmptyState } from "@/app/Components/EmptyState";
import { Button } from "@/app/Components/Button";

type Props = {
  message?: string;
  hint?: string;
  onReset?: () => void;
  compact?: boolean;
};

/** Dashboard adapter over the shared EmptyState; keeps the old prop names and Arabic defaults. */
export default function EmptyState({
  message = "لا توجد بيانات للفلاتر المحددة",
  hint,
  onReset,
  compact = false,
}: Props) {
  return (
    <SharedEmptyState
      title={message}
      description={hint}
      compact={compact}
      action={
        onReset && (
          <Button variant="outline" size="sm" onClick={onReset}>
            إعادة تعيين الفلاتر
          </Button>
        )
      }
    />
  );
}
