"use client";

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
  groupBy: "employeeName" | "office" | "currency" | "destination";
}

const COLORS = [
  "#4f46e5",
  "#7c3aed",
  "#0ea5e9",
  "#10b981",
  "#f59e0b",
  "#f43f5e",
  "#8b5cf6",
];

const chartTitles: Record<string, string> = {
  employeeName: "الإيرادات حسب الموظف",
  office: "الإيرادات حسب المكتب",
  currency: "الإيرادات حسب العملة",
  destination: "الإيرادات حسب الوجهة",
};

export default function RevenueChart({ data, groupBy }: Props) {
  // ✅ Normalize LBP
  console.log("Original Data:", data);
  const NORMALIZED_DATA = data.map((r) => ({
    ...r,
    revenueAmount:
      r.currency === "لبناني"
        ? r.revenueAmount / 100000
        : r.revenueAmount,
  }));

  // Get unique currencies
  const currencies = [...new Set(data.map((r) => r.currency))];

  // Group data
  const chartData = Object.values(
    NORMALIZED_DATA.reduce((acc: any, r) => {
      const key = r[groupBy as keyof RevenueRecord];

      if (!acc[key]) {
        acc[key] = { name: key };
      }

      acc[key][r.currency] =
        (acc[key][r.currency] || 0) + r.revenueAmount;

      return acc;
    }, {})
  );

  return (
    <div className="card p-5">

      {/* Header */}
      <div className="flex flex-col mb-5">
        <h3 className="text-sm font-semibold text-gray-900">
          {chartTitles[groupBy]}
        </h3>

        <p className="text-xs text-gray-500 mt-1">
        *  يتم عرض قيمة الليرة اللبنانية لتسهيل قراءة الأرقام بعد قسمتها على 100,000. (مثال: 1,000,000 ليرة تظهر كـ 10) 
      </p>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={340}>
        <BarChart
          data={chartData}
          margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
          barCategoryGap="20%"
        >
          <XAxis
            dataKey="name"
            tick={{
              fill: "#9ca3af",
              fontSize: 11,
              fontFamily: "Cairo, sans-serif",
            }}
            axisLine={{ stroke: "#f3f4f6" }}
            tickLine={false}
          />

          <YAxis
            type="number"
            orientation="right"
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
            labelStyle={{
              color: "#111827",
              fontWeight: 600,
            }}
            cursor={{ fill: "#f3f4f6" }}
          />

          <Legend
            wrapperStyle={{
              fontSize: "12px",
              fontFamily: "Cairo, sans-serif",
            }}
          />

          {/* One bar per currency */}
          {currencies.map((currency, index) => (
            <Bar
              key={currency}
              dataKey={currency}
              fill={COLORS[index % COLORS.length]}
              radius={[6, 6, 0, 0]}
              maxBarSize={24}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}