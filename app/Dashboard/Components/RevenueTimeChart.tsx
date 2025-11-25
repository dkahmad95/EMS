"use client";

import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { RevenueRecord } from "../utils/types";

interface Props {
  data: RevenueRecord[];
}

type Period = "daily" | "monthly" | "yearly";

export default function RevenueTimeChart({ data }: Props) {
  const [period, setPeriod] = useState<Period>("daily");

  // Helper function to format date by period
  const formatDate = (date: Date) => {
    if (period === "monthly") return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}`;
    if (period === "yearly") return `${date.getFullYear()}`;
    return date.toISOString().split("T")[0]; // YYYY-MM-DD for daily
  };

  // Get last 30 days array
  const getLast30Days = () => {
    const days: string[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push(formatDate(d));
    }
    return days;
  };

  let chartData: { period: string; revenue: number }[] = [];

  if (period === "daily") {
    const last30Days = getLast30Days();

    // Initialize with 0
    chartData = last30Days.map((day) => ({ period: day, revenue: 0 }));

    // Aggregate revenues
    data.forEach((r) => {
      const day = formatDate(new Date(r.date));
      const index = chartData.findIndex((d) => d.period === day);
      if (index >= 0) chartData[index].revenue += r.revenueAmount;
    });
  } else {
    // monthly/yearly aggregation
    const aggregated = Object.values(
      data.reduce((acc: Record<string, { period: string; revenue: number }>, r) => {
        const key = formatDate(new Date(r.date));
        if (!acc[key]) acc[key] = { period: key, revenue: 0 };
        acc[key].revenue += r.revenueAmount;
        return acc;
      }, {})
    );
    chartData = aggregated;
  }

  return (
    <div>
      {/* Period Selector */}
      <div className="mb-2 flex gap-2">
        <button
          className={`px-3 py-1 rounded ${period === "daily" ? "bg-green-800 text-white" : "bg-gray-200"}`}
          onClick={() => setPeriod("daily")}
        >
          يومياً
        </button>
        <button
          className={`px-3 py-1 rounded ${period === "monthly" ? "bg-green-800 text-white" : "bg-gray-200"}`}
          onClick={() => setPeriod("monthly")}
        >
          شهرياً
        </button>
        <button
          className={`px-3 py-1 rounded ${period === "yearly" ? "bg-green-800 text-white" : "bg-gray-200"}`}
          onClick={() => setPeriod("yearly")}
        >
          سنوياً
        </button>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <XAxis dataKey="period" />
           <YAxis
          type="number"
          direction={'ltr'}
          orientation="right"   // <-- moves labels to the right
          width={60}
          tickFormatter={(val) => val.toLocaleString()}
        />
          <Tooltip formatter={(value: number) => value.toLocaleString()} />
          <Bar dataKey="revenue" fill="#166534" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
