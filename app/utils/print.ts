/**
 * Minimal RTL print helpers. Reports are printed from a separate window with
 * self-contained inline CSS — this avoids fighting MUI's styles with @media print.
 */

export const escapeHtml = (v: unknown): string =>
  String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const BASE_CSS = `
  * { box-sizing: border-box; }
  body { font-family: 'Cairo', 'Segoe UI', Tahoma, sans-serif; color: #111827; margin: 24px; direction: rtl; }
  h1 { font-size: 20px; margin: 0 0 4px; }
  .meta { display: flex; flex-wrap: wrap; gap: 6px 18px; font-size: 12px; color: #4b5563; margin: 0 0 16px; }
  .meta b { color: #111827; font-weight: 600; }
  table { width: 100%; border-collapse: collapse; font-size: 12px; }
  thead { display: table-header-group; }
  th, td { border: 1px solid #d1d5db; padding: 6px 8px; text-align: right; vertical-align: top; }
  th { background: #f3f4f6; font-weight: 700; }
  tfoot td { background: #f9fafb; font-weight: 700; }
  .num { direction: ltr; text-align: left; font-variant-numeric: tabular-nums; white-space: nowrap; }
  .pre { white-space: pre-wrap; word-break: break-word; }
  tr { page-break-inside: avoid; }
  @media print { body { margin: 0; } }
`;

/** Open a new window with an RTL document and trigger the browser print dialog. */
export function openPrintWindow(title: string, bodyHtml: string, extraCss = ""): void {
  const w = window.open("", "_blank");
  if (!w) return;
  w.document.open();
  w.document.write(
    `<!doctype html><html dir="rtl" lang="ar"><head><meta charset="utf-8" />` +
      `<title>${escapeHtml(title)}</title>` +
      `<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap" rel="stylesheet" />` +
      `<style>${BASE_CSS}${extraCss}</style></head><body>${bodyHtml}</body></html>`,
  );
  w.document.close();
  w.onafterprint = () => w.close();
  // small delay so the document (and the Cairo font, best effort) is rendered first
  setTimeout(() => {
    try {
      w.focus();
      w.print();
    } catch {
      /* window already closed */
    }
  }, 400);
}
