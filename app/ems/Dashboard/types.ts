/** Local (non-global) types for the dashboard module. */

export type AmountMode = "gt" | "lt" | "between";
export type Period = "daily" | "monthly" | "yearly";

export type DashboardFilters = {
  /** multi-select ids (empty = no filter) */
  employee_ids: number[];
  office_ids: number[];
  destination_ids: number[];
  currency_types: CurrencyType[];
  /** YYYY-MM-DD or "" */
  date_from: string;
  /** YYYY-MM-DD or "" */
  date_to: string;
  amount_mode: AmountMode;
  /** kept as strings so the inputs stay controlled; "" = not set */
  amount_min: string;
  amount_max: string;
};

/** Series key = currency_type (USD | LBP | OTHERS). */
export type SeriesKey = "USD" | "LBP" | "OTHERS";

export type SeriesDef = {
  key: SeriesKey;
  /** legend label (from `chart_series`, e.g. "لورال" for LBP) */
  label: string;
  color: string;
};

/**
 * One bar group. `name` is the category/bucket label, `key` the stable sort key,
 * `total` the sum across series (USD units), `raw` the raw stored sum per series
 * (used by the tooltip to show the LBP amount in ل.ل). Each series key is also
 * present at the top level as the chart value (USD units).
 */
export type ChartDatum = {
  name: string;
  key: string;
  total: number;
  raw: Record<string, number>;
} & Record<string, string | number | Record<string, number>>;

export type CategoryKey = "employee" | "office" | "destination" | "currency";

/** Shape of rows from useDashboardCurrencies (Currency + dashboard-only fields). */
export type DashboardCurrency = Omit<Currency, "id"> & {
  id: number | null;
  currency_type?: CurrencyType;
};
