"use client";
import { BuildingOffice2Icon, CalendarDaysIcon, CurrencyDollarIcon } from "@heroicons/react/24/outline";
import { usePermissions } from "@/app/hooks/usePermissions";
import { fmtNum } from "../utils/chartTheme";
import { formatDateDisplay } from "../utils/date";

type Props = {
  dateFrom: string;
  dateTo: string;
  lbpRate: number | null;
  /** names of offices chosen in the dashboard filter (overrides the switcher chip) */
  selectedOffices?: string[];
};

const Chip = ({
  icon: Icon,
  children,
  title,
}: {
  icon: typeof CalendarDaysIcon;
  children: React.ReactNode;
  title?: string;
}) => (
  <span
    title={title}
    className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-700 shadow-card tabular-nums"
  >
    <Icon className="h-3.5 w-3.5 text-gray-400" aria-hidden="true" />
    {children}
  </span>
);

export default function DashboardHeader({ dateFrom, dateTo, lbpRate, selectedOffices = [] }: Props) {
  const { availableOffices, currentOfficeId } = usePermissions();
  const switcherName =
    currentOfficeId == null
      ? "جميع المكاتب"
      : availableOffices.find((o) => o.office_id === currentOfficeId)?.office_name ?? "المكتب الحالي";
  const officeName =
    selectedOffices.length === 0
      ? switcherName
      : selectedOffices.length === 1
        ? selectedOffices[0]
        : `${selectedOffices.length} مكاتب محددة`;

  const rangeText =
    dateFrom && dateTo
      ? dateFrom === dateTo
        ? formatDateDisplay(dateFrom)
        : `${formatDateDisplay(dateFrom)} — ${formatDateDisplay(dateTo)}`
      : dateFrom
        ? `من ${formatDateDisplay(dateFrom)}`
        : dateTo
          ? `حتى ${formatDateDisplay(dateTo)}`
          : "كل الفترات";

  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 className="page-title">لوحة التحليل</h1>
        <p className="page-subtitle mt-1">نظرة عامة على الإيرادات والاستقطاب حسب الفلاتر المحددة</p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Chip icon={CalendarDaysIcon} title="الفترة المحددة">
          <span dir="ltr">{rangeText}</span>
        </Chip>
        <Chip icon={BuildingOffice2Icon} title="المكتب">
          {officeName}
        </Chip>
        {lbpRate != null && lbpRate > 0 && (
          <Chip icon={CurrencyDollarIcon} title="سعر صرف الليرة المعتمد">
            <span dir="ltr">1 $ = {fmtNum(lbpRate, 0)} ل.ل</span>
          </Chip>
        )}
      </div>
    </div>
  );
}
