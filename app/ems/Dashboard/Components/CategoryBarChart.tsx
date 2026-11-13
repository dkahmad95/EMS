"use client";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { ChartDatum, SeriesDef } from "../types";
import { CURSOR, GRID, TICK, fmtCompact, truncateLabel } from "../utils/chartTheme";
import ChartCard from "./ChartCard";
import ChartLegend from "./ChartLegend";
import ChartTooltip from "./ChartTooltip";

type Props = {
  title: string;
  subtitle?: string;
  data: ChartDatum[];
  series: SeriesDef[];
  loading?: boolean;
  fetching?: boolean;
  onReset?: () => void;
  /** Column click -> the clicked category datum (the chart gets a pointer cursor when set). */
  onBarClick?: (datum: ChartDatum) => void;
};

/** Grouped bars per category (one Bar per currency-type series). */
export default function CategoryBarChart({
  title,
  subtitle,
  data,
  series,
  loading,
  fetching,
  onReset,
  onBarClick,
}: Props) {
  const many = data.length > 8;
  // Chart-level click: the whole category column (the hover band) is the target, not just
  // the drawn bars — so short and zero-value bars are clickable too.
  const handleChartClick = onBarClick
    ? (state: { activeIndex?: number | string | null }) => {
        const i = state?.activeIndex;
        if (i == null || i === "") return;
        const datum = data[Number(i)];
        if (datum) onBarClick(datum);
      }
    : undefined;

  return (
    <ChartCard
      title={title}
      subtitle={subtitle}
      header={<ChartLegend series={series} />}
      loading={loading}
      fetching={fetching}
      empty={!loading && data.length === 0}
      onReset={onReset}
    >
      <div dir="ltr" className="h-full w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 8, right: 4, bottom: many ? 8 : 0, left: 4 }}
            barGap={2}
            barCategoryGap="22%"
            onClick={handleChartClick}
            style={onBarClick ? { cursor: "pointer" } : undefined}
          >
            <CartesianGrid vertical={false} stroke={GRID} />
            <XAxis
              dataKey="name"
              tick={TICK}
              tickLine={false}
              axisLine={{ stroke: GRID }}
              tickFormatter={(v: string) => truncateLabel(String(v))}
              interval={many ? "preserveStartEnd" : 0}
              angle={many ? -25 : 0}
              textAnchor={many ? "end" : "middle"}
              height={many ? 50 : 30}
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
