"use client";

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell
} from "recharts";
import { RevenueRecord } from "../utils/types";

interface Props {
  data: RevenueRecord[];
  groupBy: "employeeName" | "office" | "currency" | "destination";
}

const COLORS = ['#4f46e5', '#7c3aed', '#0ea5e9', '#10b981', '#f59e0b', '#f43f5e', '#8b5cf6'];

const chartTitles: Record<string, string> = {
  employeeName: "الإيرادات حسب الموظف",
  office:       "الإيرادات حسب المكتب",
  currency:     "الإيرادات حسب العملة",
  destination:  "الإيرادات حسب الوجهة",
};

const chartIcons: Record<string, React.ReactNode> = {
  employeeName: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  office: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  ),
  currency: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  destination: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
};

export default function RevenueChart({ data, groupBy }: Props) {
  const chartData = Object.values(
    data.reduce((acc: any, r) => {
      const key = r[groupBy as keyof RevenueRecord];
      acc[key] = acc[key] || { name: key, value: 0 };
      acc[key].value += r.revenueAmount;
      return acc;
    }, {})
  );

  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 mb-5">
        <div className="p-2 bg-primary-100 rounded-lg text-primary-600">
          {chartIcons[groupBy]}
        </div>
        <h3 className="text-sm font-semibold text-gray-900">{chartTitles[groupBy]}</h3>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={chartData} margin={{ top: 4, right: 0, left: 0, bottom: 4 }}>
          <XAxis
            dataKey="name"
            tick={{ fill: '#9ca3af', fontSize: 11, fontFamily: 'Cairo, sans-serif' }}
            axisLine={{ stroke: '#f3f4f6' }}
            tickLine={false}
          />
          <YAxis
            type="number"
            direction="ltr"
            orientation="right"
            width={64}
            tickFormatter={(val) => val.toLocaleString()}
            tick={{ fill: '#9ca3af', fontSize: 11, fontFamily: 'Cairo, sans-serif' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '10px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              fontFamily: 'Cairo, sans-serif',
              fontSize: 13,
            }}
            labelStyle={{ color: '#111827', fontWeight: 600 }}
            itemStyle={{ color: '#4f46e5' }}
            cursor={{ fill: '#f3f4f6' }}
          />
          <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={48}>
            {(chartData as any[]).map((_entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
