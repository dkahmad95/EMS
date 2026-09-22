/**
 * Shared organisation header + signature line for every printed report
 * (the layout of the daily office form MHR-F21).
 */
import { escapeHtml } from "@/app/utils/print";

export type HeaderMeta = { label: string; value: string; ltr?: boolean };
export type FormHeaderOptions = {
  title: string;
  /** e.g. "الرمز: MHR-F21 · الاصدار: 01" — only for reports that have a form code */
  code?: string;
  /** the "الإسم: … المكتب: … التاريخ: …" line under the header */
  meta?: HeaderMeta[];
};

const origin = (): string => (typeof window !== "undefined" ? window.location.origin : "");

export const formHeaderHtml = ({ title, code, meta = [] }: FormHeaderOptions): string => {
  const line = meta.length
    ? `<p class="line">${meta
        .map(
          (m) =>
            `<span>${escapeHtml(m.label)}: <b${m.ltr ? ' dir="ltr"' : ""}>${escapeHtml(m.value)}</b></span>`,
        )
        .join("")}</p>`
    : "";
  return (
    `<table class="hdr"><tr>` +
    `<td class="hdr-r"><div class="org">جمعية المبرات الخيرية</div><div>دائرة العلاقات والتكفل</div>` +
    (code ? `<div class="code">${escapeHtml(code)}</div>` : "") +
    `</td>` +
    `<td class="hdr-c"><div class="bism">باسمه تعالى</div><div class="ttl">${escapeHtml(title)}</div></td>` +
    `<td class="hdr-l"><img src="${escapeHtml(origin())}/almabbaratLogo.webp" alt="" /></td>` +
    `</tr></table>` +
    line
  );
};

export const signatureHtml = (username: string): string =>
  `<p class="sign">اسم المرسل والتوقيع: <b>${escapeHtml(username)}</b><span class="sigline"></span></p>`;

export const FORM_HEADER_CSS = `
  table.hdr { border-bottom: 2px solid #111827; margin-bottom: 6px; }
  table.hdr td { border: 0; vertical-align: middle; padding: 2px 6px; }
  .hdr-r { width: 40%; font-size: 13px; }
  .hdr-r .org { font-size: 16px; font-weight: 700; }
  .hdr-r .code { color: #4b5563; font-size: 11px; margin-top: 2px; }
  .hdr-c { text-align: center; }
  .hdr-c .bism { font-size: 12px; color: #4b5563; }
  .hdr-c .ttl { font-size: 18px; font-weight: 700; margin-top: 2px; }
  .hdr-l { text-align: left; width: 20%; }
  .hdr-l img { height: 56px; }
  .line { display: flex; flex-wrap: wrap; gap: 6px 32px; font-size: 13px; margin: 4px 0 8px; }
  .sign { margin-top: 16px; font-size: 13px; display: flex; align-items: flex-end; gap: 12px; }
  .sign .sigline { display: inline-block; width: 220px; border-bottom: 1px solid #111827; }
`;
