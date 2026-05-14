"use client";

import React, {useState} from "react";
import {BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend} from "recharts";
import {RevenueRecord} from "../utils/types";

interface Props {
  data: RevenueRecord[];
}

type Period = "daily" | "monthly" | "yearly";

type ChartDataItem = {
  period: string;
  [currency: string]: number | string;
};

const CHART_COLORS = ["#4f46e5", "#f59e0b", "#f43f5e", "#0ea5e9", "#7c3aed"];

const periodLabels: Record<Period, string> = {
  daily: "يومياً",
  monthly: "شهرياً",
  yearly: "سنوياً",
};

// ✅ Normalize currency
const normalizeAmount = (amount: number, currency: string) => {
  if (currency === "لبناني") return amount / 100000;
  return amount;
};

export default function RevenueTimeChart({data}: Props) {
  const [period, setPeriod] = useState<Period>("daily");

  const formatDate = (date: Date) => {
    if (period === "monthly") return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}`;

    if (period === "yearly") return `${date.getFullYear()}`;

    return date.toISOString().split("T")[0];
  };

  const getChartData = (): ChartDataItem[] => {
    const aggregated: Record<string, ChartDataItem> = {};

    data.forEach((r) => {
      const key = formatDate(new Date(r.date));

      if (!aggregated[key]) {
        aggregated[key] = {period: key};
      }

      const value = normalizeAmount(r.revenueAmount, r.currency);

      aggregated[key][r.currency] = ((aggregated[key][r.currency] as number) || 0) + value;
    });

    return Object.values(aggregated).sort(
      (a, b) => new Date(a.period as string).getTime() - new Date(b.period as string).getTime(),
    );
  };

  const chartData = getChartData();
  const currencies = Array.from(new Set(data.map((r) => r.currency)));

  return (
    <div>
      {/* Period selector */}
      <div className="flex flex-col mb-5">
        <div className="flex gap-1.5 mb-5">
          {(Object.entries(periodLabels) as [Period, string][]).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setPeriod(key)}
              className={`px-4 py-1.5 text-sm rounded-lg font-medium transition-all duration-150 cursor-pointer
              ${
                period === key ? "bg-primary-600 text-white shadow-sm" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}>
              {label}
            </button>
          ))}
        </div>{" "}
        <p className="text-xs text-gray-500 mt-1">
          * يتم عرض قيمة الليرة اللبنانية لتسهيل قراءة الأرقام بعد قسمتها على 100,000. (مثال: 1,000,000 ليرة تظهر كـ 10)
        </p>
      </div>

      <ResponsiveContainer width="100%" height={380}>
        <BarChart data={chartData} margin={{top: 8, right: 0, left: 0, bottom: 4}} barCategoryGap="20%">
          <XAxis
            dataKey="period"
            tick={{
              fill: "#9ca3af",
              fontSize: 11,
              fontFamily: "Cairo, sans-serif",
            }}
            axisLine={{stroke: "#f3f4f6"}}
            tickLine={false}
          />

          <YAxis
            type="number"
            orientation="right"
            direction={"ltr"}
            width={70}
            tickFormatter={(val) => val.toLocaleString()}
            tick={{
              fill: "#9ca3af",
              fontSize: 11,
              fontFamily: "Cairo, sans-serif",
            }}
            axisLine={false}
            tickLine={false}
          />

          <Tooltip
            formatter={(value?: number, name?: string): [string, string] => [
              value?.toLocaleString() ?? "0",
              name ?? "",
            ]}
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "10px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              fontFamily: "Cairo, sans-serif",
              fontSize: 13,
            }}
            cursor={{fill: "#f3f4f6"}}
          />

          <Legend
            wrapperStyle={{
              fontFamily: "Cairo, sans-serif",
              fontSize: 12,
              paddingTop: 12,
            }}
          />

          {/* One bar per currency (NOT stacked → side-by-side) */}
          {currencies.map((currency, i) => (
            <Bar
              key={currency}
              dataKey={currency}
              fill={CHART_COLORS[i % CHART_COLORS.length]}
              barSize={18}
              radius={[4, 4, 0, 0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
