"use client";
import { useState } from "react";
import { Autocomplete, MenuItem, TextField } from "@mui/material";
import { AdjustmentsHorizontalIcon, ArrowPathIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { Button } from "@/app/Components/Button";
import type { DashboardFiltersApi } from "../hooks/useDashboardFilters";
import type { AmountMode, DashboardCurrency } from "../types";
import { addDays, startOfMonth, todayLocal } from "../utils/date";

type Props = {
  f: DashboardFiltersApi;
  employees: Employee[];
  currencies: DashboardCurrency[];
  destinations: Destination[];
};

/** Shared MUI field styling (green focus ring = primary). */
const fieldSx = {
  width: "100%",
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
    fontSize: "14px",
    fontFamily: "Cairo, sans-serif",
    backgroundColor: "#fff",
    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#d1d5db" },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#16a34a", borderWidth: "2px" },
  },
  "& .MuiInputLabel-root": {
    fontFamily: "Cairo, sans-serif",
    fontSize: "14px",
    "&.Mui-focused": { color: "#15803d" },
  },
  "& .MuiFormHelperText-root": { fontFamily: "Cairo, sans-serif", marginInline: "4px" },
} as const;

const AMOUNT_MODES: { value: AmountMode; label: string }[] = [
  { value: "gt", label: "أكبر من" },
  { value: "lt", label: "أصغر من" },
  { value: "between", label: "بين" },
];

export default function FiltersBar({ f, employees, currencies, destinations }: Props) {
  const { filters, patch, reset, setRange, setAmountMode, isAmountInvalid, activeCount } = f;
  const [open, setOpen] = useState(false);

  const employeeValue = employees.find((e) => e.id === filters.employee_id) ?? null;
  const currencyValue =
    currencies.find((c) => (c.currency_type as unknown as string) === filters.currency_type) ?? null;
  const destinationValue = destinations.find((d) => d.id === filters.destination_id) ?? null;

  const today = todayLocal();
  const quick = [
    { label: "اليوم", apply: () => setRange(today, today) },
    { label: "آخر 7 أيام", apply: () => setRange(addDays(today, -6), today) },
    { label: "هذا الشهر", apply: () => setRange(startOfMonth(today), today) },
  ];

  const showMin = filters.amount_mode !== "lt";
  const showMax = filters.amount_mode !== "gt";

  return (
    <section className="card p-4 md:p-5" aria-label="فلاتر لوحة التحليل">
      {/* Title row */}
      <div className="flex items-center justify-between gap-3">
        <p className="flex items-center gap-2 text-sm font-semibold text-gray-900">
          <AdjustmentsHorizontalIcon className="h-4 w-4 text-gray-400" aria-hidden="true" />
          تصفية البيانات
          {activeCount > 0 && (
            <span className="badge bg-primary-50 text-primary-700 border border-primary-200 tabular-nums">
              {activeCount}
            </span>
          )}
        </p>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-1 sm:flex">
            {quick.map((q) => (
              <Button key={q.label} variant="ghost" size="sm" onClick={q.apply}>
                {q.label}
              </Button>
            ))}
          </div>
          <Button variant="muted" size="sm" onClick={reset} className="gap-1.5">
            <ArrowPathIcon className="h-3.5 w-3.5" aria-hidden="true" />
            إعادة تعيين
          </Button>
          {/* Mobile toggle */}
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="dashboard-filters-body"
            className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border border-gray-200 text-gray-600 transition-colors duration-200 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 sm:hidden"
          >
            <span className="sr-only">{open ? "إخفاء الفلاتر" : "إظهار الفلاتر"}</span>
            <ChevronDownIcon
              className={`h-4 w-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
              aria-hidden="true"
            />
          </button>
        </div>
      </div>

      {/* Body — collapsible below sm */}
      <div id="dashboard-filters-body" className={`${open ? "block" : "hidden"} mt-4 sm:block`}>
        {/* Mobile quick ranges */}
        <div className="mb-3 flex flex-wrap gap-1 sm:hidden">
          {quick.map((q) => (
            <Button key={q.label} variant="outline" size="sm" onClick={q.apply}>
              {q.label}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
          <Autocomplete
            options={employees}
            getOptionLabel={(o) => o.name ?? ""}
            isOptionEqualToValue={(o, v) => o.id === v.id}
            value={employeeValue}
            onChange={(_, v) => patch({ employee_id: v?.id ?? null })}
            size="small"
            noOptionsText="لا يوجد موظفون"
            renderInput={(p) => <TextField {...p} label="الموظف" />}
            sx={fieldSx}
          />

          <Autocomplete
            options={currencies}
            getOptionLabel={(o) => o.name ?? ""}
            isOptionEqualToValue={(o, v) => o.currency_type === v.currency_type}
            value={currencyValue}
            onChange={(_, v) => patch({ currency_type: (v?.currency_type ?? "") as CurrencyType | "" })}
            size="small"
            noOptionsText="لا توجد عملات"
            renderInput={(p) => <TextField {...p} label="العملة" />}
            sx={fieldSx}
          />

          <Autocomplete
            options={destinations}
            getOptionLabel={(o) => o.name ?? ""}
            isOptionEqualToValue={(o, v) => o.id === v.id}
            value={destinationValue}
            onChange={(_, v) => patch({ destination_id: v?.id ?? null })}
            size="small"
            noOptionsText="لا توجد وجهات"
            renderInput={(p) => <TextField {...p} label="الوجهة" />}
            sx={fieldSx}
          />

          <TextField
            type="date"
            label="من تاريخ"
            size="small"
            value={filters.date_from}
            onChange={(e) => patch({ date_from: e.target.value })}
            slotProps={{ inputLabel: { shrink: true }, htmlInput: { max: filters.date_to || undefined } }}
            sx={fieldSx}
          />

          <TextField
            type="date"
            label="إلى تاريخ"
            size="small"
            value={filters.date_to}
            onChange={(e) => patch({ date_to: e.target.value })}
            slotProps={{ inputLabel: { shrink: true }, htmlInput: { min: filters.date_from || undefined } }}
            sx={fieldSx}
          />

          {/* Amount: mode + bounds */}
          <div className="flex items-start gap-2 sm:col-span-2 lg:col-span-4 xl:col-span-1">
            <TextField
              select
              label="المبلغ"
              size="small"
              value={filters.amount_mode}
              onChange={(e) => setAmountMode(e.target.value as AmountMode)}
              sx={{ ...fieldSx, minWidth: 108, flex: "0 0 auto" }}
            >
              {AMOUNT_MODES.map((m) => (
                <MenuItem key={m.value} value={m.value} sx={{ fontFamily: "Cairo, sans-serif", fontSize: 14 }}>
                  {m.label}
                </MenuItem>
              ))}
            </TextField>
            {showMin && (
              <TextField
                type="number"
                label={filters.amount_mode === "between" ? "من" : "الحد"}
                size="small"
                value={filters.amount_min}
                onChange={(e) => patch({ amount_min: e.target.value })}
                error={isAmountInvalid}
                helperText={filters.amount_mode === "between" ? undefined : "على المبلغ الأصلي"}
                slotProps={{ htmlInput: { min: 0, step: "any", inputMode: "decimal" } }}
                sx={{ ...fieldSx, flex: 1, minWidth: 0 }}
              />
            )}
            {showMax && (
              <TextField
                type="number"
                label={filters.amount_mode === "between" ? "إلى" : "الحد"}
                size="small"
                value={filters.amount_max}
                onChange={(e) => patch({ amount_max: e.target.value })}
                error={isAmountInvalid}
                helperText={isAmountInvalid ? "الحد الأدنى أكبر من الأعلى" : "على المبلغ الأصلي"}
                slotProps={{ htmlInput: { min: 0, step: "any", inputMode: "decimal" } }}
                sx={{ ...fieldSx, flex: 1, minWidth: 0 }}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
