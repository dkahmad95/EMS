import { SkeletonTable } from "./Skeleton";

type Props = {
  /** Fill the remaining flex height of the parent (matches DataTable fullHeight). */
  fullHeight?: boolean;
  className?: string;
};

export function DataTableSkeleton({ fullHeight = false, className }: Props) {
  return <SkeletonTable rows={fullHeight ? 12 : 6} fullHeight={fullHeight} className={className} />;
}
