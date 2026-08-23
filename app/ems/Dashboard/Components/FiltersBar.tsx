"use client";
import { useState } from "react";
import { Autocomplete, Chip, MenuItem, TextField } from "@mui/material";
import { AdjustmentsHorizontalIcon, ArrowPathIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { Button } from "@/app/Components/Button";
import type { DashboardFiltersApi } from "../hooks/useDashboardFilters";
import type { AmountMode, DashboardCurrency } from "../types";
import { addDays, startOfMonth, todayLocal } from "../utils/date";

type OfficeOption = { id: number; name: string };

type Props = {
  f: DashboardFiltersApi;
  employees: Employee[];
  offices: OfficeOption[];
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
  "& .MuiChip-root": { fontFamily: "Cairo, sans-serif", height: 22, fontSize: 12 },
} as const;

const AMOUNT_MODES: { value: AmountMode; label: string }[] = [
  { value: "gt", label: "أكبر من" },
  { value: "lt", label: "أصغر من" },
  { value: "between", label: "بين" },
];

/** Shared props for the multi-select autocompletes (chips, "+N" overflow, stays open). */
const multiProps = {
  multiple: true as const,
  size: "small" as const,
  limitTags: 1,
  disableCloseOnSelect: true,
  getLimitTagsText: (more: number) => `+${more}`,
  sx: fieldSx,
};

type TagProps = { key: string } & Record<string, unknown>;

/** Compact chips for selected values. */
function renderChips<T>(getLabel: (o: T) => string) {
  return function renderTags(value: readonly T[], getTagProps: (p: { index: number }) => unknown) {
    return value.map((option, index) => {
      const { key, ...tagProps } = getTagProps({ index }) as TagProps;
      return <Chip key={key} label={getLabel(option)} size="small" {...tagProps} />;
    });
  };
}

export default function FiltersBar({ f, employees, offices, currencies, destinations }: Props) {
  const { filters, patch, reset, setRange, setAmountMode, isAmountInvalid, activeCount } = f;
  const [open, setOpen] = useState(false);

  const employeeValue = employees.filter((e) => e.id != null && filters.employee_ids.includes(e.id));
  const officeValue = offices.filter((o) => filters.office_ids.includes(o.id));
  const currencyValue = currencies.filter((c) =>
    filters.currency_types.includes(c.currency_type as unknown as CurrencyType),
  );
  const destinationValue = destinations.filter(
    (d) => d.id != null && filters.destination_ids.includes(d.id),
  );

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

        {/* 4 multi-selects + 2 dates + amount group (2 cols) = 8 columns on 2xl, 4 on lg */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-8">
          <Autocomplete
            {...multiProps}
            options={employees}
            getOptionLabel={(o) => o.name ?? ""}
            isOptionEqualToValue={(o, v) => o.id === v.id}
            value={employeeValue}
            onChange={(_, v) =>
              patch({ employee_ids: v.map((e) => e.id).filter((id): id is number => id != null) })
            }
            renderTags={renderChips<Employee>((o) => o.name)}
            noOptionsText="لا يوجد موظفون"
            renderInput={(p) => <TextField {...p} label="الموظفون" />}
          />

          <Autocomplete
            {...multiProps}
            options={offices}
            getOptionLabel={(o) => o.name ?? ""}
            isOptionEqualToValue={(o, v) => o.id === v.id}
            value={officeValue}
            onChange={(_, v) => patch({ office_ids: v.map((o) => o.id) })}
            renderTags={renderChips<OfficeOption>((o) => o.name)}
            noOptionsText="لا توجد مكاتب"
            renderInput={(p) => <TextField {...p} label="المكاتب" />}
          />

          <Autocomplete
            {...multiProps}
            options={currencies}
            getOptionLabel={(o) => o.name ?? ""}
            isOptionEqualToValue={(o, v) => o.currency_type === v.currency_type}
            value={currencyValue}
            onChange={(_, v) =>
              patch({
                currency_types: v
                  .map((c) => c.currency_type as unknown as CurrencyType | undefined)
                  .filter((t): t is CurrencyType => !!t),
              })
            }
            renderTags={renderChips<DashboardCurrency>((o) => o.name)}
            noOptionsText="لا توجد عملات"
            renderInput={(p) => <TextField {...p} label="العملات" />}
          />

          <Autocomplete
            {...multiProps}
            options={destinations}
            getOptionLabel={(o) => o.name ?? ""}
            isOptionEqualToValue={(o, v) => o.id === v.id}
            value={destinationValue}
            onChange={(_, v) =>
              patch({ destination_ids: v.map((d) => d.id).filter((id): id is number => id != null) })
            }
            renderTags={renderChips<Destination>((o) => o.name)}
            noOptionsText="لا توجد وجهات"
            renderInput={(p) => <TextField {...p} label="الوجهات" />}
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

          {/* Amount: mode + bounds (spans 2 columns; one caption under the whole group) */}
          <div className="flex flex-col sm:col-span-2 lg:col-span-2 2xl:col-span-2">
            <div className="flex items-start gap-2">
              <TextField
                select
                label="المبلغ"
                size="small"
                value={filters.amount_mode}
                onChange={(e) => setAmountMode(e.target.value as AmountMode)}
                sx={{ ...fieldSx, width: 116, minWidth: 116, flex: "0 0 auto" }}
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
                  slotProps={{ htmlInput: { min: 0, step: "any", inputMode: "decimal" } }}
                  sx={{ ...fieldSx, flex: "1 1 0", minWidth: 0 }}
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
                  helperText={isAmountInvalid ? "الحد الأدنى أكبر من الأعلى" : undefined}
                  slotProps={{ htmlInput: { min: 0, step: "any", inputMode: "decimal" } }}
                  sx={{ ...fieldSx, flex: "1 1 0", minWidth: 0 }}
                />
              )}
            </div>
            <p className="mt-1 whitespace-nowrap text-[11px] leading-4 text-gray-500">على المبلغ الأصلي</p>
          </div>
        </div>
      </div>
    </section>
  );
}
