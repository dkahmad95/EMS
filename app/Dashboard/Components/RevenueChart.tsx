// RevenueChart.tsx
"use client";

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";
import { RevenueRecord } from "../utils/types";

interface Props {
  data: RevenueRecord[];
  groupBy: "employeeName" | "office" | "currency" | "destination";
}

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
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} >
        <XAxis dataKey="name" />
       <YAxis
          type="number"
          direction={'ltr'}
          orientation="right"   // <-- moves labels to the right
          width={60}
          tickFormatter={(val) => val.toLocaleString()}
        />
        <Tooltip />
        <Bar dataKey="value" fill="#166534" />
      </BarChart>
    </ResponsiveContainer>
  );
}
