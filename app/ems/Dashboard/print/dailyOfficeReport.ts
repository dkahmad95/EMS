/**
 * "تقرير عمل يومي ( المكاتب )" — the organisation's daily office form (MHR-F21), built
 * from the dashboard's already-loaded data. One page per office.
 */
import { escapeHtml } from "@/app/utils/print";
import { fmtNum } from "../utils/chartTheme";
import { formatDateDisplay } from "../utils/date";

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

type EmpAgg = { total: Money; perDest: Map<string, Money> };

/** Tables A + B: revenue per employee per destination for one office. */
const revenueTables = (officeRows: DashboardRevenueRow[], officeName: string): string => {
  const dests = Array.from(
    new Set(officeRows.map((r) => r.destination?.name ?? "—")),
  ).sort(byName);
  const emps = new Map<string, EmpAgg>();
  const officeTotal = money();
  const destTotal = new Map<string, Money>(dests.map((d) => [d, money()]));

  for (const r of officeRows) {
    const name = r.employee?.name ?? "—";
    const dest = r.destination?.name ?? "—";
    let e = emps.get(name);
    if (!e) {
      e = { total: money(), perDest: new Map() };
      emps.set(name, e);
    }
    let dm = e.perDest.get(dest);
    if (!dm) {
      dm = money();
      e.perDest.set(dest, dm);
    }
    addRow(dm, r);
    addRow(e.total, r);
    addRow(officeTotal, r);
    addRow(destTotal.get(dest)!, r);
  }
  const names = Array.from(emps.keys()).sort(byName);
  const get = (e: EmpAgg, d: string) => e.perDest.get(d) ?? money();

  // Table A — counts per destination + revenue
  const headA =
    `<tr><th rowspan="2" class="name">المندوب</th><th rowspan="2">عدد الإيصالات</th>` +
    (dests.length ? `<th colspan="${dests.length}">الوجهات (العدد)</th>` : "") +
    `<th rowspan="2">الإيرادات</th></tr>` +
    `<tr>${dests.map((d) => `<th>${escapeHtml(d)}</th>`).join("")}</tr>`;
  const bodyA = names
    .map((n) => {
      const e = emps.get(n)!;
      return (
        `<tr>${nameCell(n)}${numCell(e.total.count)}` +
        dests.map((d) => numCell(get(e, d).count)).join("") +
        moneyCell(e.total) + `</tr>`
      );
    })
    .join("");
  const footA =
    `<tr>${nameCell(`إجمالي ${officeName}`)}${numCell(officeTotal.count, true)}` +
    dests.map((d) => numCell(destTotal.get(d)!.count, true)).join("") +
    moneyCell(officeTotal) + `</tr>`;

  // Table B — count / LBP / USD per destination
  const headB =
    `<tr><th rowspan="2" class="name">المندوب</th>` +
    dests.map((d) => `<th colspan="3">${escapeHtml(d)}</th>`).join("") +
    `<th rowspan="2">الإجمالي</th></tr>` +
    `<tr>${dests.map(() => `<th>العدد</th><th>ل.ل</th><th>$</th>`).join("")}</tr>`;
  const trio = (m: Money) =>
    numCell(m.count) +
    cell(m.lbp ? fmtNum(m.lbp, 0) : "", "num") +
    cell(m.usd ? fmtNum(m.usd, 2) : "", "num");
  const bodyB = names
    .map((n) => {
      const e = emps.get(n)!;
      return `<tr>${nameCell(n)}${dests.map((d) => trio(get(e, d))).join("")}${moneyCell(e.total)}</tr>`;
    })
    .join("");
  const footB =
    `<tr>${nameCell("إجمالي إيرادات المكتب العامة")}` +
    dests.map((d) => trio(destTotal.get(d)!)).join("") +
    moneyCell(officeTotal) + `</tr>`;

  const empty = `<tr><td colspan="${3 + dests.length}" class="empty">لا توجد إيرادات ضمن الفلاتر المحددة</td></tr>`;
  return (
    `<table class="rep"><thead>${headA}</thead><tbody>${bodyA || empty}</tbody><tfoot>${footA}</tfoot></table>` +
    `<table class="rep"><thead>${headB}</thead><tbody>${bodyB || `<tr><td colspan="${2 + dests.length * 3}" class="empty">—</td></tr>`}</tbody><tfoot>${footB}</tfoot></table>`
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

const officePage = (
  office: { id: number; name: string },
  input: DailyReportInput,
  origin: string,
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

  return (
    `<section class="page">` +
    `<table class="hdr"><tr>` +
    `<td class="hdr-r"><div class="org">جمعية المبرات الخيرية</div><div>دائرة العلاقات والتكفل</div>` +
    `<div class="code">الرمز: MHR-F21 &nbsp;·&nbsp; الاصدار: 01</div></td>` +
    `<td class="hdr-c"><div class="bism">باسمه تعالى</div><div class="ttl">تقرير عمل يومي ( المكاتب )</div></td>` +
    `<td class="hdr-l"><img src="${escapeHtml(origin)}/almabbaratLogo.webp" alt="" /></td>` +
    `</tr></table>` +
    `<p class="line"><span>الإسم: <b>${escapeHtml(username)}</b></span>` +
    `<span>المكتب: <b>${escapeHtml(office.name)}</b></span>` +
    `<span>التاريخ: <b dir="ltr">${escapeHtml(rangeText(dateFrom, dateTo))}</b></span></p>` +
    `<h2>الإنتاجية والإيرادات المالية:</h2>` +
    revenueTables(officeRows, office.name) +
    `<h2>الإستقطاب والتوزيع / تجميد و سحب:</h2>` +
    `<div class="two">` +
    collectionTable(officeCols, names, "عدد القجج الموزعة", "عدد الكفالات الجديدة") +
    collectionTable(officeFreezed, names, "عدد القجج المسحوبة", "عدد الكفالات المجمدة") +
    `</div>` +
    `<p class="sign">اسم المرسل والتوقيع: <b>${escapeHtml(username)}</b><span class="sigline"></span></p>` +
    `</section>`
  );
};

export const DAILY_REPORT_CSS = `
  @page { size: A4 landscape; margin: 12mm; }
  body { margin: 0; }
  .page { page-break-after: always; }
  .page:last-child { page-break-after: auto; }
  table.hdr { border-bottom: 2px solid #111827; margin-bottom: 8px; }
  table.hdr td { border: 0; vertical-align: middle; padding: 4px 6px; }
  .hdr-r { width: 40%; font-size: 13px; }
  .hdr-r .org { font-size: 16px; font-weight: 700; }
  .hdr-r .code { color: #4b5563; font-size: 11px; margin-top: 2px; }
  .hdr-c { text-align: center; }
  .hdr-c .bism { font-size: 12px; color: #4b5563; }
  .hdr-c .ttl { font-size: 18px; font-weight: 700; margin-top: 2px; }
  .hdr-l { text-align: left; width: 20%; }
  .hdr-l img { height: 64px; }
  .line { display: flex; flex-wrap: wrap; gap: 8px 32px; font-size: 13px; margin: 6px 0 10px; }
  h2 { font-size: 14px; margin: 12px 0 6px; }
  table.rep { margin-bottom: 10px; }
  table.rep th, table.rep td { text-align: center; padding: 4px 6px; font-size: 11px; vertical-align: middle; }
  table.rep th.name, table.rep td.name { text-align: right; min-width: 120px; }
  table.rep td.money { white-space: nowrap; direction: rtl; text-align: center; }
  table.rep td.empty { color: #6b7280; padding: 8px; }
  .two { display: flex; gap: 16px; align-items: flex-start; }
  .two > table { width: 50%; }
  .sign { margin-top: 26px; font-size: 13px; display: flex; align-items: flex-end; gap: 12px; }
  .sign .sigline { display: inline-block; width: 220px; border-bottom: 1px solid #111827; }
`;

/** Build the report HTML for the offices in scope (see DailyReportInput.officeIds). */
export const buildDailyOfficeReportHtml = (input: DailyReportInput): string => {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const nameById = new Map<number, string>(input.offices.map((o) => [o.id, o.name]));
  for (const r of input.rows) if (r.office?.id && !nameById.has(r.office.id)) nameById.set(r.office.id, r.office.name);

  const hasData = (id: number) =>
    input.rows.some((r) => r.office?.id === id) ||
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
  return offices.map((o) => officePage(o, input, origin)).join("");
};
