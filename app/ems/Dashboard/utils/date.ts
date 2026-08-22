import type { Period } from "../types";

const pad2 = (n: number) => String(n).padStart(2, "0");

/** Local date as YYYY-MM-DD (never toISOString — that would shift by timezone). */
export const toLocalISO = (d: Date): string =>
  `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;

export const todayLocal = (): string => toLocalISO(new Date());

/** Parse YYYY-MM-DD into a local Date (no timezone shift). */
export const parseLocal = (iso: string): Date => {
  const [y, m, d] = iso.slice(0, 10).split("-").map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
};

export const addDays = (iso: string, n: number): string => {
  const d = parseLocal(iso);
  d.setDate(d.getDate() + n);
  return toLocalISO(d);
};

/** First day of the month containing `iso` (defaults to today). */
export const startOfMonth = (iso: string = todayLocal()): string => `${iso.slice(0, 7)}-01`;

/** Whole days between two YYYY-MM-DD strings (to - from). */
export const daysBetween = (from: string, to: string): number => {
  const a = parseLocal(from).getTime();
  const b = parseLocal(to).getTime();
  return Math.round((b - a) / 86_400_000);
};

/** Bucket key by string slicing (dates arrive as YYYY-MM-DD). */
export const bucketKey = (date: string, period: Period): string => {
  const d = (date ?? "").slice(0, 10);
  if (period === "daily") return d;
  if (period === "monthly") return d.slice(0, 7);
  return d.slice(0, 4);
};

/** ≤31 days → daily, ≤366 → monthly, else yearly. Open ranges default to monthly. */
export const autoPeriod = (from?: string, to?: string): Period => {
  if (!from || !to) return "monthly";
  const days = Math.abs(daysBetween(from, to));
  if (days <= 31) return "daily";
  if (days <= 366) return "monthly";
  return "yearly";
};

/** DD/MM, MM/YYYY or YYYY depending on the period. */
export const formatBucketLabel = (key: string, period: Period): string => {
  if (period === "daily") {
    const [, m, d] = key.split("-");
    return `${d}/${m}`;
  }
  if (period === "monthly") {
    const [y, m] = key.split("-");
    return `${m}/${y}`;
  }
  return key;
};

/** YYYY-MM-DD → DD/MM/YYYY for display. */
export const formatDateDisplay = (iso?: string | null): string => {
  if (!iso) return "—";
  const [y, m, d] = iso.slice(0, 10).split("-");
  if (!y || !m || !d) return iso;
  return `${d}/${m}/${y}`;
};
