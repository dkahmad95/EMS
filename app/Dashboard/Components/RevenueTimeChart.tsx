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
  [currency: string]: string | number; // period is string, currencies are numbers
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

  // Last 30 days array
  const getLast30Days = () => {
    const days: string[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push(formatDate(d));
    }
    return days;
  };

  // Get all currencies dynamically
  const currencies = Array.from(new Set(data.map((r) => r.currency)));

  let chartData: ChartDataItem[] = [];

  if (period === "daily") {
    const last30Days = getLast30Days();
    chartData = last30Days.map((day) => ({ period: day }));

    data.forEach((r) => {
      const day = formatDate(new Date(r.date));
      const index = chartData.findIndex((d) => d.period === day);
      if (index >= 0) {
        chartData[index][r.currency] =
          (chartData[index][r.currency] as number || 0) + r.revenueAmount;
      }
    });
  } else {
    const aggregated: Record<string, ChartDataItem> = {};
    data.forEach((r) => {
      const key = formatDate(new Date(r.date));
      if (!aggregated[key]) aggregated[key] = { period: key };
      aggregated[key][r.currency] =
        (aggregated[key][r.currency] as number || 0) + r.revenueAmount;
    });
    chartData = Object.values(aggregated);
  }

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
        <BarChart data={chartData}>
          <XAxis dataKey="period" />
          <YAxis
            type="number"
            direction={"ltr"}
            orientation="right"
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
              stackId="a"
              fill={
                ["#166534", "#f59e0b", "#b91c1c", "#2563eb", "#9333ea"][i % 5]
              }
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
