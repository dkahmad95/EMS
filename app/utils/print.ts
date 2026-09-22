/**
 * Minimal RTL print helpers. Reports are printed from a hidden same-page iframe with
 * self-contained inline CSS: no popup (popup blockers silently kill `window.open("")`
 * in production) and no fighting MUI's styles with @media print.
 *
 * `@page { margin: 0 }` suppresses the browser's own header/footer (title, date, URL,
 * page number): Chrome/Edge only draw them inside the page margins. Our own margins come
 * from the `.sheet` wrapper table, whose thead/tfoot spacer rows repeat on every page.
 */

export const escapeHtml = (v: unknown): string =>
  String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const PAGE_GAP = "12mm";

const BASE_CSS = `
  * { box-sizing: border-box; }
  @page { size: A4; margin: 0; }
  html, body { margin: 0; padding: 0; }
  body { font-family: 'Cairo', 'Segoe UI', Tahoma, sans-serif; color: #111827; direction: rtl; }
  h1 { font-size: 20px; margin: 0 0 4px; }
  .meta { display: flex; flex-wrap: wrap; gap: 6px 18px; font-size: 12px; color: #4b5563; margin: 0 0 16px; }
  .meta b { color: #111827; font-weight: 600; }
  table { width: 100%; border-collapse: collapse; font-size: 12px; }
  thead { display: table-header-group; }
  tfoot { display: table-footer-group; }
  th, td { border: 1px solid #d1d5db; padding: 6px 8px; text-align: right; vertical-align: top; }
  th { background: #f3f4f6; font-weight: 700; }
  tfoot td { background: #f9fafb; font-weight: 700; }
  .num { direction: ltr; text-align: left; font-variant-numeric: tabular-nums; white-space: nowrap; }
  .pre { white-space: pre-wrap; word-break: break-word; }
  tr { page-break-inside: avoid; }
  /* page frame: repeating spacer rows = top/bottom margins on every printed page */
  table.sheet { width: 100%; border: 0; }
  table.sheet > thead > tr > td, table.sheet > tbody > tr > td, table.sheet > tfoot > tr > td {
    border: 0; padding: 0; background: transparent; font-weight: inherit;
  }
  table.sheet > thead > tr > td.gap, table.sheet > tfoot > tr > td.gap { height: ${PAGE_GAP}; }
  table.sheet > tbody > tr { page-break-inside: auto; }
  table.sheet > tbody > tr > td.content { padding: 0 ${PAGE_GAP}; vertical-align: top; }
`;

const FRAME_ID = "ems-print-frame";
let printing = false;

const getFrame = (): HTMLIFrameElement => {
  let frame = document.getElementById(FRAME_ID) as HTMLIFrameElement | null;
  if (!frame) {
    frame = document.createElement("iframe");
    frame.id = FRAME_ID;
    frame.setAttribute("aria-hidden", "true");
    frame.setAttribute("title", "print");
    Object.assign(frame.style, {
      position: "fixed",
      right: "0",
      bottom: "0",
      width: "0",
      height: "0",
      border: "0",
      opacity: "0",
      pointerEvents: "none",
    });
    document.body.appendChild(frame);
  }
  return frame;
};

/** Full self-contained RTL document (base CSS + sheet wrapper) for a report body. */
export const buildPrintDocument = (title: string, bodyHtml: string, extraCss = ""): string => {
  const sheet =
    `<table class="sheet"><thead><tr><td class="gap"></td></tr></thead>` +
    `<tbody><tr><td class="content">${bodyHtml}</td></tr></tbody>` +
    `<tfoot><tr><td class="gap"></td></tr></tfoot></table>`;
  return (
    `<!doctype html><html dir="rtl" lang="ar"><head><meta charset="utf-8" />` +
    `<title>${escapeHtml(title)}</title>` +
    `<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap" rel="stylesheet" />` +
    `<style>${BASE_CSS}${extraCss}</style></head><body>${sheet}</body></html>`
  );
};

/** Render an RTL document into the hidden iframe and open the browser print dialog. */
export function openPrintWindow(title: string, bodyHtml: string, extraCss = ""): void {
  if (typeof window === "undefined" || printing) return;
  printing = true;

  const frame = getFrame();
  frame.onload = async () => {
    const w = frame.contentWindow;
    const doc = frame.contentDocument;
    try {
      // best effort: let the Cairo web font land before the print dialog snapshots the page
      const fontsReady = doc?.fonts?.ready ?? Promise.resolve();
      await Promise.race([fontsReady, new Promise((r) => setTimeout(r, 600))]);
      w?.focus();
      w?.print();
    } catch {
      /* ignore — nothing more we can do without a print dialog */
    } finally {
      printing = false;
    }
  };

  frame.srcdoc = buildPrintDocument(title, bodyHtml, extraCss);
  // safety net: never leave the guard stuck if onload does not fire
  setTimeout(() => {
    printing = false;
  }, 5000);
}
