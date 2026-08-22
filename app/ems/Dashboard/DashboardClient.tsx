"use client";
import { useEffect, useState } from "react";
import { usePermissions } from "@/app/hooks/usePermissions";
import type { Period } from "./types";
import { autoPeriod } from "./utils/date";
import { sumCollections } from "./utils/aggregate";
import { useDashboardFilters } from "./hooks/useDashboardFilters";
import { useDashboardData } from "./hooks/useDashboardData";
import { useChartData } from "./hooks/useChartData";
import DashboardHeader from "./Components/DashboardHeader";
import FiltersBar from "./Components/FiltersBar";
import KpiGrid from "./Components/KpiGrid";
import CategoryBarChart from "./Components/CategoryBarChart";
import TimeChart from "./Components/TimeChart";
import RevenuesTable from "./Components/RevenuesTable";

/** Composition only — state lives in the hooks, presentation in the components. */
export default function DashboardClient() {
  const { currentOfficeId } = usePermissions();
  const f = useDashboardFilters(currentOfficeId);
  const d = useDashboardData(f, currentOfficeId);

  // Period: auto from the date range, user override resets when the range changes.
  const [periodOverride, setPeriodOverride] = useState<Period | null>(null);
  const { date_from, date_to } = f.filters;
  useEffect(() => setPeriodOverride(null), [date_from, date_to]);
  const period = periodOverride ?? autoPeriod(date_from || undefined, date_to || undefined);

  const charts = useChartData(d.rows, period, date_from || undefined, date_to || undefined);
  const collectionTotals = sumCollections(d.collections);
  const freezedTotals = sumCollections(d.freezed);

  const chartProps = { loading: d.allLoading, fetching: d.allFetching, onReset: f.reset };

  return (
    <div className="space-y-5 animate-fade-in">
      <DashboardHeader dateFrom={date_from} dateTo={date_to} lbpRate={d.meta.lbp_rate} />

      <FiltersBar f={f} employees={d.employees} currencies={d.currencies} destinations={d.destinations} />

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
          {...chartProps}
        />
        <CategoryBarChart
          title="الإيرادات حسب المكتب"
          subtitle="مجموع الإيرادات لكل مكتب (بالدولار)"
          data={charts.byOffice.data}
          series={charts.byOffice.series}
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
    </div>
  );
}
