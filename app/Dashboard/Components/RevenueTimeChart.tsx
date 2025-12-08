"use client";

import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { RevenueRecord } from "../utils/types";

interface Props {
  data: RevenueRecord[];
}

type Period = "daily" | "monthly" | "yearly";

type ChartDataItem = {
  period: string;
  [currency: string]: number | string; // each currency value is a number, period is string
};

export default function RevenueTimeChart({ data }: Props) {
  const [period, setPeriod] = useState<Period>("daily");

  // Helper function to format date based on selected period
  const formatDate = (date: Date) => {
    if (period === "monthly")
      return `${date.getFullYear()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}`;
    if (period === "yearly") return `${date.getFullYear()}`;
    return date.toISOString().split("T")[0]; // YYYY-MM-DD for daily
  };

  // Aggregate data per period and currency
  const getChartData = (): ChartDataItem[] => {
    const aggregated: Record<string, ChartDataItem> = {};

    // Collect all periods
    data.forEach((r) => {
      const key = formatDate(new Date(r.date));
      if (!aggregated[key]) aggregated[key] = { period: key };
      aggregated[key][r.currency] =
        ((aggregated[key][r.currency] as number) || 0) + r.revenueAmount;
    });

    return Object.values(aggregated).sort(
      (a, b) => new Date(a.period).getTime() - new Date(b.period).getTime()
    );
  };

  const chartData = getChartData();

  // All currencies
  const currencies = Array.from(new Set(data.map((r) => r.currency)));

  const colors = ["#166534", "#f59e0b", "#b91c1c", "#2563eb", "#9333ea"];

  return (
    <div>
      {/* Period Selector */}
      <div className="mb-2 flex gap-2">
        <button
          className={`px-3 py-1 rounded ${
            period === "daily" ? "bg-green-800 text-white" : "bg-gray-200"
          }`}
          onClick={() => setPeriod("daily")}
        >
          يومياً
        </button>
        <button
          className={`px-3 py-1 rounded ${
            period === "monthly" ? "bg-green-800 text-white" : "bg-gray-200"
          }`}
          onClick={() => setPeriod("monthly")}
        >
          شهرياً
        </button>
        <button
          className={`px-3 py-1 rounded ${
            period === "yearly" ? "bg-green-800 text-white" : "bg-gray-200"
          }`}
          onClick={() => setPeriod("yearly")}
        >
          سنوياً
        </button>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
        >
          <XAxis dataKey="period" />
          <YAxis
            type="number"
            direction={"ltr"}
            orientation="right" // <-- moves labels to the right
            width={60}
            tickFormatter={(val) => val.toLocaleString()}
          />
          <Tooltip
            formatter={(value: number, name: string) =>
              `${value.toLocaleString()} ${name}`
            }
          />
          <Legend />
          {currencies.map((currency, i) => (
            <Bar
              key={currency}
              dataKey={currency}
              fill={colors[i % colors.length]}
              barSize={20}
              stackId={undefined} // separate bars instead of stacked
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
