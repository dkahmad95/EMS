"use client";
import type { SeriesDef } from "../types";

/** HTML legend rendered in the card header (RTL-safe, unlike recharts <Legend>). */
export default function ChartLegend({ series }: { series: SeriesDef[] }) {
  if (!series.length) return null;
  return (
    <ul className="flex flex-wrap items-center gap-x-4 gap-y-1" aria-label="مفتاح الرسم">
      {series.map((s) => (
        <li key={s.key} className="flex items-center gap-1.5 text-xs text-gray-600">
          <span
            className="inline-block h-2.5 w-2.5 rounded-full ring-2 ring-white"
            style={{ backgroundColor: s.color }}
            aria-hidden="true"
          />
          <span>{s.label}</span>
        </li>
      ))}
    </ul>
  );
}
