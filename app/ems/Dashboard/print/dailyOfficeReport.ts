/**
 * Office form reports built from the dashboard's already-loaded data, one page per office:
 *  - "daily":       تقرير عمل يومي ( المكاتب ) (form MHR-F21) — revenue + collections tables
 *  - "collections": الإستقطاب والتوزيع / تجميد و سحب only
 */
import { escapeHtml } from "@/app/utils/print";
import { fmtNum } from "../utils/chartTheme";
import { formatDateDisplay } from "../utils/date";
import { FORM_HEADER_CSS, formHeaderHtml, signatureHtml } from "./formHeader";

export type OfficeReportKind = "daily" | "collections";

export type DailyReportInput = {
  /** full filtered revenue set (all=true) */
  rows: DashboardRevenueRow[];
  collections: Collection[];
  freezed: Collection[];
  employees: Employee[];
  offices: { id: number; name: string }[];
  /** offices pinned by the filter / switcher; null = every office that has data */
  officeIds: number[] | null;
  dateFrom: string;
  dateTo: string;
  username: string;
};

type Money = { lbp: number; usd: number; count: number };
const money = (): Money => ({ lbp: 0, usd: 0, count: 0 });

/** LBP stays raw; USD and OTHERS use display_amount (OTHERS is already ÷ rate = USD). */
const addRow = (m: Money, r: DashboardRevenueRow) => {
  const t = (r.currency?.currency_type as unknown as string) ?? "OTHERS";
  if (t === "LBP") m.lbp += Number(r.revenue_amount) || 0;
  else m.usd += Number(r.display_amount) || 0;
  m.count += 1;
};

/**
 * "620,000 ل.ل + 280 $" like the form; "—" when empty. Each amount is an isolated LTR
 * run so the RTL cell keeps "number unit + number unit" order (safe HTML: numbers only).
 */
const fmtMoney = (m: Money): string => {
  const parts: string[] = [];
  if (m.lbp) parts.push(`<span dir="ltr">${fmtNum(m.lbp, 0)} ل.ل</span>`);
  if (m.usd) parts.push(`<span dir="ltr">${fmtNum(m.usd, 2)} $</span>`);
  return parts.length ? parts.join(" + ") : "—";
};

const byName = (a: string, b: string) => a.localeCompare(b, "ar");
const cell = (v: string, cls = "") => `<td${cls ? ` class="${cls}"` : ""}>${v}</td>`;
const nameCell = (v: string) => cell(escapeHtml(v), "name");
const numCell = (n: number, showZero = false) =>
  cell(n || showZero ? fmtNum(n, 0) : "", "num");
const moneyCell = (m: Money) => cell(fmtMoney(m), "money");

const collectionType = (c: Collection): string => c.collection_type as unknown as string;
const collectionEmployee = (c: Collection): string =>
  c.employee?.name ?? c.employeeName ?? "—";

/** The form's fixed destination groups: two named destinations, everything else combined. */
type GroupKey = "internal" | "orphanBox" | "other";
const GROUPS: { key: GroupKey; label: string; id?: number; name?: string }[] = [
  { key: "internal", label: "تكفل داخلي", id: 2, name: "تكفل داخلي" },
  { key: "orphanBox", label: "قجة الايتام", id: 4, name: "قجة الايتام" },
  { key: "other", label: "وجهات مختلفة" },
];
/** loose Arabic compare: collapse spaces, unify alef/hamza forms */
const norm = (s: string) => s.replace(/[أإآ]/g, "ا").replace(/\s+/g, " ").trim();
const groupOf = (r: DashboardRevenueRow): GroupKey => {
  const name = norm(r.destination?.name ?? "");
  const id = r.destination?.id;
  const byLabel = GROUPS.find((g) => g.name && norm(g.name) === name);
  if (byLabel) return byLabel.key;
  const byId = GROUPS.find((g) => g.id != null && g.id === id);
  return byId?.key ?? "other";
};
type Groups = Record<GroupKey, Money>;
const groups = (): Groups => ({ internal: money(), orphanBox: money(), other: money() });

type EmpAgg = { total: Money; perGroup: Groups };

/** Tables A + B: revenue per employee per destination group for one office. */
const revenueTables = (officeRows: DashboardRevenueRow[], officeName: string): string => {
  const emps = new Map<string, EmpAgg>();
  const officeTotal = money();
  const groupTotal = groups();

  for (const r of officeRows) {
    const name = r.employee?.name ?? "—";
    const g = groupOf(r);
    let e = emps.get(name);
    if (!e) {
      e = { total: money(), perGroup: groups() };
      emps.set(name, e);
    }
    addRow(e.perGroup[g], r);
    addRow(e.total, r);
    addRow(officeTotal, r);
    addRow(groupTotal[g], r);
  }
  const names = Array.from(emps.keys()).sort(byName);

  // Table A — receipt counts per group + revenue
  const headA =
    `<tr><th rowspan="2" class="name">المندوب</th><th rowspan="2">عدد الإيصالات</th>` +
    `<th colspan="${GROUPS.length}">الوجهات (العدد)</th><th rowspan="2">الإيرادات</th></tr>` +
    `<tr>${GROUPS.map((g) => `<th>${g.label}</th>`).join("")}</tr>`;
  const bodyA = names
    .map((n) => {
      const e = emps.get(n)!;
      return (
        `<tr>${nameCell(n)}${numCell(e.total.count, true)}` +
        GROUPS.map((g) => numCell(e.perGroup[g.key].count, true)).join("") +
        moneyCell(e.total) +
        `</tr>`
      );
    })
    .join("");
  const footA =
    `<tr>${nameCell(`إجمالي ${officeName}`)}${numCell(officeTotal.count, true)}` +
    GROUPS.map((g) => numCell(groupTotal[g.key].count, true)).join("") +
    moneyCell(officeTotal) +
    `</tr>`;

  // Table B — count / LBP / USD per group
  const headB =
    `<tr><th rowspan="2" class="name">المندوب</th>` +
    GROUPS.map((g) => `<th colspan="3">${g.label}</th>`).join("") +
    `<th rowspan="2">الإجمالي</th></tr>` +
    `<tr>${GROUPS.map(() => `<th>العدد</th><th>ل.ل</th><th>$</th>`).join("")}</tr>`;
  const trio = (m: Money) =>
    numCell(m.count, true) +
    cell(m.lbp ? fmtNum(m.lbp, 0) : "", "num") +
    cell(m.usd ? fmtNum(m.usd, 2) : "", "num");
  const bodyB = names
    .map((n) => {
      const e = emps.get(n)!;
      return `<tr>${nameCell(n)}${GROUPS.map((g) => trio(e.perGroup[g.key])).join("")}${moneyCell(e.total)}</tr>`;
    })
    .join("");
  const footB =
    `<tr>${nameCell("إجمالي إيرادات المكتب العامة")}` +
    GROUPS.map((g) => trio(groupTotal[g.key])).join("") +
    moneyCell(officeTotal) +
    `</tr>`;

  const emptyA = `<tr><td colspan="${3 + GROUPS.length}" class="empty">لا توجد إيرادات ضمن الفلاتر المحددة</td></tr>`;
  const emptyB = `<tr><td colspan="${2 + GROUPS.length * 3}" class="empty">—</td></tr>`;
  return (
    `<table class="rep"><thead>${headA}</thead><tbody>${bodyA || emptyA}</tbody><tfoot>${footA}</tfoot></table>` +
    `<table class="rep"><thead>${headB}</thead><tbody>${bodyB || emptyB}</tbody><tfoot>${footB}</tfoot></table>`
  );
};

/** Tables C / D: BOX + SPONSORSHIP counts per employee (zeros shown, like the form). */
const collectionTable = (
  cols: Collection[],
  names: string[],
  boxLabel: string,
  sponsorshipLabel: string,
): string => {
  const agg = new Map<string, { box: number; sp: number }>(
    names.map((n) => [n, { box: 0, sp: 0 }]),
  );
  for (const c of cols) {
    const n = collectionEmployee(c);
    let a = agg.get(n);
    if (!a) {
      a = { box: 0, sp: 0 };
      agg.set(n, a);
    }
    const t = collectionType(c);
    const cnt = Number(c.count) || 0;
    if (t === "BOX") a.box += cnt;
    else if (t === "SPONSORSHIP") a.sp += cnt;
  }
  const all = Array.from(agg.keys()).sort(byName);
  let box = 0;
  let sp = 0;
  const body = all
    .map((n) => {
      const a = agg.get(n)!;
      box += a.box;
      sp += a.sp;
      return `<tr>${nameCell(n)}${numCell(a.box, true)}${numCell(a.sp, true)}</tr>`;
    })
    .join("");
  return (
    `<table class="rep"><thead><tr><th class="name">الاسم</th><th>${boxLabel}</th><th>${sponsorshipLabel}</th></tr></thead>` +
    `<tbody>${body || `<tr><td colspan="3" class="empty">—</td></tr>`}</tbody>` +
    `<tfoot><tr>${nameCell("الإجمالي")}${numCell(box, true)}${numCell(sp, true)}</tr></tfoot></table>`
  );
};

const rangeText = (from: string, to: string): string =>
  from && to
    ? from === to
      ? formatDateDisplay(from)
      : `${formatDateDisplay(from)} — ${formatDateDisplay(to)}`
    : from
      ? `من ${formatDateDisplay(from)}`
      : to
        ? `حتى ${formatDateDisplay(to)}`
        : "كل الفترات";

type PageOptions = { title: string; code?: string; revenue: boolean; collections: boolean };

const KINDS: Record<OfficeReportKind, PageOptions> = {
  daily: {
    title: "تقرير عمل ( المكاتب )",
    code: "الرمز: MHR-F21 · الاصدار: 01",
    revenue: true,
    collections: true,
  },
  collections: {
    title: "تقرير الإستقطاب والتوزيع / تجميد و سحب",
    revenue: false,
    collections: true,
  },
};

const officePage = (
  office: { id: number; name: string },
  input: DailyReportInput,
  opts: PageOptions,
): string => {
  const { rows, collections, freezed, employees, username, dateFrom, dateTo } = input;
  const officeRows = rows.filter((r) => r.office?.id === office.id);
  const officeCols = collections.filter((c) => c.office_id === office.id);
  const officeFreezed = freezed.filter((c) => c.office_id === office.id);
  // every employee of the office + anyone who appears in its collection rows
  const names = Array.from(
    new Set([
      ...employees.filter((e) => e.office_id === office.id).map((e) => e.name),
      ...officeCols.map(collectionEmployee),
      ...officeFreezed.map(collectionEmployee),
    ]),
  );

  const revenue = opts.revenue
    ? `<h2>الإنتاجية والإيرادات المالية:</h2>` + revenueTables(officeRows, office.name)
    : "";
  const collected = opts.collections
    ? `<h2>الإستقطاب والتوزيع / تجميد و سحب:</h2><div class="two">` +
      collectionTable(officeCols, names, "عدد القجج الموزعة", "عدد الكفالات الجديدة") +
      collectionTable(officeFreezed, names, "عدد القجج المسحوبة", "عدد الكفالات المجمدة") +
      `</div>`
    : "";

  return (
    `<section class="page">` +
    formHeaderHtml({
      title: opts.title,
      code: opts.code,
      meta: [
        { label: "الإسم", value: username },
        { label: "المكتب", value: office.name },
        { label: "التاريخ", value: rangeText(dateFrom, dateTo), ltr: true },
      ],
    }) +
    revenue +
    collected +
    signatureHtml(username) +
    `</section>`
  );
};

export const DAILY_REPORT_CSS = `
  @page { size: A4 landscape; }
  .page { page-break-after: always; }
  .page:last-child { page-break-after: auto; }
  ${FORM_HEADER_CSS}
  h2 { font-size: 13px; margin: 8px 0 4px; }
  table.rep { margin-bottom: 8px; }
  table.rep th, table.rep td { text-align: center; padding: 3px 5px; font-size: 10.5px; vertical-align: middle; }
  table.rep th.name, table.rep td.name { text-align: right; min-width: 120px; }
  table.rep td.money { white-space: nowrap; direction: rtl; text-align: center; }
  table.rep td.empty { color: #6b7280; padding: 8px; }
  .two { display: flex; gap: 16px; align-items: flex-start; }
  .two > table { width: 50%; }
`;

/** Build the report HTML for the offices in scope (see DailyReportInput.officeIds). */
export const buildOfficeReportHtml = (input: DailyReportInput, kind: OfficeReportKind): string => {
  const opts = KINDS[kind];
  const nameById = new Map<number, string>(input.offices.map((o) => [o.id, o.name]));
  for (const r of input.rows) if (r.office?.id && !nameById.has(r.office.id)) nameById.set(r.office.id, r.office.name);

  const hasData = (id: number) =>
    (opts.revenue && input.rows.some((r) => r.office?.id === id)) ||
    input.collections.some((c) => c.office_id === id) ||
    input.freezed.some((c) => c.office_id === id);

  const ids = input.officeIds?.length
    ? input.officeIds
    : Array.from(nameById.keys()).filter(hasData);
  const offices = ids
    .map((id) => ({ id, name: nameById.get(id) ?? `مكتب #${id}` }))
    .sort((a, b) => byName(a.name, b.name));

  if (offices.length === 0) {
    return `<section class="page"><p class="empty">لا توجد بيانات ضمن الفلاتر المحددة.</p></section>`;
  }
  return offices.map((o) => officePage(o, input, opts)).join("");
};

export const buildDailyOfficeReportHtml = (input: DailyReportInput): string =>
  buildOfficeReportHtml(input, "daily");
