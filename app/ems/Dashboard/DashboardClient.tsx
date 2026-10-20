"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePermissions } from "@/app/hooks/usePermissions";
import { usePersistentState } from "@/app/hooks/usePersistentState";
import { DASHBOARD_PERIOD_KEY } from "@/app/utils/storageKeys";
import type { ChartDatum, Period } from "./types";
import { autoPeriod } from "./utils/date";
import { sumCollections } from "./utils/aggregate";
import { useDashboardFilters } from "./hooks/useDashboardFilters";
import { useDashboardData } from "./hooks/useDashboardData";
import { useChartData } from "./hooks/useChartData";
import { ErrorState } from "@/app/Components/ErrorState";
import DashboardHeader from "./Components/DashboardHeader";
import FiltersBar from "./Components/FiltersBar";
import KpiGrid from "./Components/KpiGrid";
import CategoryBarChart from "./Components/CategoryBarChart";
import TimeChart from "./Components/TimeChart";
import RevenuesTable from "./Components/RevenuesTable";
import PrintReportMenu from "./Components/PrintReportMenu";
import RevenueDrilldownDialog, { type DrillTarget } from "./Components/RevenueDrilldownDialog";

const PERIODS: Period[] = ["daily", "monthly", "yearly"];
const restorePeriod = (saved: unknown): Period | null =>
  PERIODS.includes(saved as Period) ? (saved as Period) : null;

/** Composition only — state lives in the hooks, presentation in the components. */
export default function DashboardClient() {
  const { currentOfficeId } = usePermissions();
  const f = useDashboardFilters(currentOfficeId);
  const d = useDashboardData(f, currentOfficeId);

  // Period: auto from the date range, user override resets when the range changes.
  // Persisted (like the filters) so it survives leaving and reopening the dashboard.
  const [periodOverride, setPeriodOverride] = usePersistentState<Period | null>(
    DASHBOARD_PERIOD_KEY,
    () => null,
    { restore: restorePeriod },
  );
  const { date_from, date_to } = f.filters;
  // Only a real range change clears the override (not the initial mount, which would
  // wipe the restored value).
  const rangeKey = `${date_from}|${date_to}`;
  const prevRangeKey = useRef(rangeKey);
  useEffect(() => {
    if (prevRangeKey.current === rangeKey) return;
    prevRangeKey.current = rangeKey;
    setPeriodOverride(null);
  }, [rangeKey, setPeriodOverride]);
  const period = periodOverride ?? autoPeriod(date_from || undefined, date_to || undefined);

  const charts = useChartData(d.rows, period, date_from || undefined, date_to || undefined);

  // Drill-down: clicking an office / employee bar lists that group's rows (same filters).
  const [drill, setDrill] = useState<DrillTarget | null>(null);
  const drillRows = useMemo(() => {
    if (!drill) return [];
    return d.rows.filter(
      (r) => (drill.kind === "office" ? r.office?.id : r.employee?.id) === drill.id,
    );
  }, [drill, d.rows]);
  const openDrill = (kind: DrillTarget["kind"]) => (datum: ChartDatum) => {
    if (datum.id == null) return;
    setDrill({ kind, id: datum.id, name: datum.name });
  };
  const collectionTotals = sumCollections(d.collections);
  const freezedTotals = sumCollections(d.freezed);

  const chartProps = { loading: d.allLoading, fetching: d.allFetching, onReset: f.reset };
  const selectedOfficeNames = d.offices
    .filter((o) => f.filters.office_ids.includes(o.id))
    .map((o) => o.name);
  // offices the daily report is pinned to: the multi-select wins, then the switcher, else all with data
  const reportOfficeIds = f.filters.office_ids.length
    ? f.filters.office_ids
    : currentOfficeId != null
      ? [currentOfficeId]
      : null;

  return (
    <div className="space-y-5">
      <DashboardHeader
        dateFrom={date_from}
        dateTo={date_to}
        lbpRate={d.meta.lbp_rate}
        selectedOffices={selectedOfficeNames}
        actions={
          <PrintReportMenu
            charts={charts}
            rows={d.rows}
            collections={d.collections}
            freezed={d.freezed}
            employees={d.employees}
            officeReports={d.officeReports}
            offices={d.offices}
            officeIds={reportOfficeIds}
            dateFrom={date_from}
            dateTo={date_to}
            lbpRate={d.meta.lbp_rate}
            selectedOffices={selectedOfficeNames}
            loading={d.allLoading}
          />
        }
      />

      <FiltersBar
        f={f}
        employees={d.employees}
        offices={d.offices}
        currencies={d.currencies}
        destinations={d.destinations}
      />

      {d.allError && !d.allLoading ? (
        <section className="card p-5" aria-label="خطأ في تحميل البيانات">
          <ErrorState
            title="تعذّر تحميل بيانات لوحة التحليل"
            description="تحقق من الاتصال ثم أعد المحاولة."
            onRetry={() => void d.refetchAll()}
          />
        </section>
      ) : (
        <>
          <KpiGrid
            currencies={d.currencies}
            currencyTotals={charts.currencyTotals}
            total={d.total}
            destinationCounts={charts.destinationCounts}
            collections={collectionTotals}
            freezed={freezedTotals}
            loading={d.allLoading}
            collectionsLoading={d.collectionsLoading}
            freezedLoading={d.freezedLoading}
          />

          <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
            <CategoryBarChart
              title="الإيرادات حسب الموظف"
              subtitle="مجموع الإيرادات لكل موظف (بالدولار)"
              data={charts.byEmployee.data}
              series={charts.byEmployee.series}
              onBarClick={openDrill("employee")}
              {...chartProps}
            />
            <CategoryBarChart
              title="الإيرادات حسب المكتب"
              subtitle="مجموع الإيرادات لكل مكتب (بالدولار)"
              data={charts.byOffice.data}
              series={charts.byOffice.series}
              onBarClick={openDrill("office")}
              {...chartProps}
            />
            <CategoryBarChart
              title="الإيرادات حسب الوجهة"
              subtitle="مجموع الإيرادات لكل وجهة (بالدولار)"
              data={charts.byDestination.data}
              series={charts.byDestination.series}
              {...chartProps}
            />
            <CategoryBarChart
              title="الإيرادات حسب العملة"
              subtitle="مجموع الإيرادات لكل عملة (محوّلة إلى الدولار)"
              data={charts.byCurrency.data}
              series={charts.byCurrency.series}
              {...chartProps}
            />
          </div>

          <TimeChart
            data={charts.byTime.data}
            series={charts.byTime.series}
            period={period}
            onPeriodChange={setPeriodOverride}
            {...chartProps}
          />

          <RevenuesTable
            rows={d.pageRows}
            total={d.pageTotal}
            loading={d.pageFetching}
            paginationModel={d.table.paginationModel}
            onPaginationModelChange={d.table.setPaginationModel}
          />
        </>
      )}

      <RevenueDrilldownDialog
        target={drill}
        rows={drillRows}
        dateFrom={date_from}
        dateTo={date_to}
        onClose={() => setDrill(null)}
      />
    </div>
  );
}
