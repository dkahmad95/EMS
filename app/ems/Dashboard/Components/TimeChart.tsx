"use client";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { ChartDatum, Period, SeriesDef } from "../types";
import { CURSOR, GRID, TICK, fmtCompact } from "../utils/chartTheme";
import ChartCard from "./ChartCard";
import ChartLegend from "./ChartLegend";
import ChartTooltip from "./ChartTooltip";

type Props = {
  data: ChartDatum[];
  series: SeriesDef[];
  period: Period;
  onPeriodChange: (p: Period) => void;
  loading?: boolean;
  fetching?: boolean;
  onReset?: () => void;
};

const PERIODS: { value: Period; label: string }[] = [
  { value: "daily", label: "يومياً" },
  { value: "monthly", label: "شهرياً" },
  { value: "yearly", label: "سنوياً" },
];

function Segmented({ value, onChange }: { value: Period; onChange: (p: Period) => void }) {
  return (
    <div
      role="tablist"
      aria-label="تجميع حسب الفترة"
      className="inline-flex rounded-lg border border-gray-200 bg-gray-50 p-0.5"
    >
      {PERIODS.map((p) => {
        const active = p.value === value;
        return (
          <button
            key={p.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(p.value)}
            className={`cursor-pointer rounded-md px-3 py-1 text-xs font-medium transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 ${
              active
                ? "bg-white text-primary-700 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {p.label}
          </button>
        );
      })}
    </div>
  );
}

const SUBTITLE: Record<Period, string> = {
  daily: "مجموع الإيرادات لكل يوم (بالدولار)",
  monthly: "مجموع الإيرادات لكل شهر (بالدولار)",
  yearly: "مجموع الإيرادات لكل سنة (بالدولار)",
};

/** Revenues over time with a daily / monthly / yearly segmented control. */
export default function TimeChart({
  data,
  series,
  period,
  onPeriodChange,
  loading,
  fetching,
  onReset,
}: Props) {
  const many = data.length > 12;

  return (
    <ChartCard
      title="الإيرادات مع مرور الوقت"
      subtitle={SUBTITLE[period]}
      header={
        <>
          <ChartLegend series={series} />
          <Segmented value={period} onChange={onPeriodChange} />
        </>
      }
      loading={loading}
      fetching={fetching}
      empty={!loading && data.length === 0}
      onReset={onReset}
    >
      <div dir="ltr" className="h-full w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 8, right: 4, bottom: 0, left: 4 }}
            barGap={2}
            barCategoryGap={many ? "15%" : "25%"}
          >
            <CartesianGrid vertical={false} stroke={GRID} />
            <XAxis
              dataKey="name"
              tick={TICK}
              tickLine={false}
              axisLine={{ stroke: "#e5e7eb" }}
              interval={many ? "preserveStartEnd" : 0}
              minTickGap={12}
              height={30}
            />
            <YAxis
              orientation="right"
              width={64}
              tick={TICK}
              tickLine={false}
              axisLine={false}
              tickFormatter={fmtCompact}
            />
            <Tooltip
              content={(p) => <ChartTooltip {...p} />}
              cursor={{ fill: CURSOR }}
              wrapperStyle={{ outline: "none", zIndex: 10 }}
            />
            {series.map((s) => (
              <Bar
                key={s.key}
                dataKey={s.key}
                name={s.label}
                fill={s.color}
                radius={[6, 6, 0, 0]}
                maxBarSize={28}
                isAnimationActive={false}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
