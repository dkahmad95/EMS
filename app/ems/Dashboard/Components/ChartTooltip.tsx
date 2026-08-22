"use client";
import type { ChartDatum } from "../types";
import { fmtNum } from "../utils/chartTheme";

/**
 * Loosely typed on purpose: recharts' TooltipContentProps is generic over ValueType/NameType
 * (not re-exported), so we accept the spread of whatever <Tooltip content={(p) => ...} /> passes.
 */
type TooltipItem = {
  dataKey?: unknown;
  name?: unknown;
  value?: unknown;
  color?: string;
  payload?: unknown;
};

type Props = {
  active?: boolean;
  payload?: ReadonlyArray<TooltipItem>;
  label?: unknown;
  /** Optional title override (e.g. full bucket label). */
  titleFormatter?: (label: unknown, datum?: ChartDatum) => string;
  [extra: string]: unknown;
};

/** RTL tooltip card: per-series value in USD units, plus the raw ل.ل sum for LBP. */
export default function ChartTooltip({ active, payload, label, titleFormatter }: Props) {
  if (!active || !payload || payload.length === 0) return null;

  const datum = payload[0]?.payload as ChartDatum | undefined;
  const title = titleFormatter ? titleFormatter(label, datum) : String(datum?.name ?? label ?? "");
  const total = payload.reduce((s, p) => s + (Number(p.value) || 0), 0);

  return (
    <div
      dir="rtl"
      className="min-w-[180px] rounded-xl border border-gray-200 bg-white/95 px-3 py-2.5 text-right shadow-dropdown backdrop-blur-sm"
      style={{ fontFamily: "Cairo, sans-serif" }}
    >
      <p className="mb-1.5 border-b border-gray-100 pb-1.5 text-xs font-semibold text-gray-900">
        {title}
      </p>
      <ul className="space-y-1.5">
        {payload.map((p) => {
          const key = String(p.dataKey ?? p.name ?? "");
          const rawLbp = key === "LBP" ? datum?.raw?.LBP : undefined;
          return (
            <li key={key} className="flex items-start justify-between gap-4 text-xs">
              <span className="flex items-center gap-1.5 text-gray-600">
                <span
                  className="inline-block h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: String(p.color ?? "#9ca3af") }}
                  aria-hidden="true"
                />
                {String(p.name ?? key)}
              </span>
              <span className="text-left tabular-nums">
                <span className="block font-semibold text-gray-900" dir="ltr">
                  {fmtNum(Number(p.value) || 0)} $
                </span>
                {rawLbp !== undefined && (
                  <span className="block text-[11px] text-gray-500" dir="ltr">
                    {fmtNum(rawLbp, 0)} ل.ل
                  </span>
                )}
              </span>
            </li>
          );
        })}
      </ul>
      {payload.length > 1 && (
        <p className="mt-1.5 flex items-center justify-between border-t border-gray-100 pt-1.5 text-xs">
          <span className="text-gray-600">الإجمالي</span>
          <span className="font-bold text-gray-900 tabular-nums" dir="ltr">
            {fmtNum(total)} $
          </span>
        </p>
      )}
    </div>
  );
}
