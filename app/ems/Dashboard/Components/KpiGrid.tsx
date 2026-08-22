"use client";
import {
  ArchiveBoxXMarkIcon,
  BanknotesIcon,
  CurrencyDollarIcon,
  GlobeAltIcon,
  ListBulletIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import type { ComponentType, SVGProps } from "react";
import type { DashboardCurrency, SeriesKey } from "../types";
import type { CollectionTotals, CurrencyTotals } from "../utils/aggregate";
import { SERIES_DEFAULT_LABEL, SERIES_ORDER, SERIES_UNIT, fmtNum } from "../utils/chartTheme";
import CollectionsKpiCard from "./CollectionsKpiCard";
import DestinationsKpiCard from "./DestinationsKpiCard";
import KpiCard, { type KpiAccent } from "./KpiCard";

type Props = {
  currencies: DashboardCurrency[];
  currencyTotals: CurrencyTotals;
  total: number;
  destinationCounts: { name: string; count: number }[];
  collections: CollectionTotals;
  freezed: CollectionTotals;
  loading?: boolean;
  collectionsLoading?: boolean;
  freezedLoading?: boolean;
};

const CURRENCY_CARD: Record<
  SeriesKey,
  { accent: KpiAccent; icon: ComponentType<SVGProps<SVGSVGElement>> }
> = {
  USD: { accent: "primary", icon: CurrencyDollarIcon },
  LBP: { accent: "accent", icon: BanknotesIcon },
  OTHERS: { accent: "warning", icon: GlobeAltIcon },
};

export default function KpiGrid({
  currencies,
  currencyTotals,
  total,
  destinationCounts,
  collections,
  freezed,
  loading = false,
  collectionsLoading = false,
  freezedLoading = false,
}: Props) {
  // Stable 3-card layout: always USD / LBP / OTHERS, labelled from the currencies lookup when present.
  const currencyCards = SERIES_ORDER.map((type) => {
    const c = currencies.find((x) => (x.currency_type as unknown as string) === type);
    return { type, label: c?.name ?? SERIES_DEFAULT_LABEL[type] };
  });

  return (
    <div className="space-y-4">
      {/* Row 1 — currency totals + record count */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {currencyCards.map(({ type, label }) => {
          const t = currencyTotals[type];
          const cfg = CURRENCY_CARD[type];
          return (
            <KpiCard
              key={type}
              label={`إجمالي ${label}`}
              value={fmtNum(t.total, type === "LBP" ? 0 : 2)}
              sub={`${fmtNum(t.count, 0)} سجل · ${SERIES_UNIT[type]}`}
              icon={cfg.icon}
              accent={cfg.accent}
              loading={loading}
            />
          );
        })}
        <KpiCard
          label="عدد الإيرادات"
          value={fmtNum(total, 0)}
          sub="سجل ضمن الفلاتر الحالية"
          icon={ListBulletIcon}
          accent="secondary"
          loading={loading}
        />
      </div>

      {/* Row 2 — destinations + collections */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <DestinationsKpiCard counts={destinationCounts} loading={loading} className="xl:col-span-2" />
        <CollectionsKpiCard
          title="استقطاب / توزيع"
          totals={collections}
          icon={UserGroupIcon}
          accent="secondary"
          loading={collectionsLoading}
        />
        <CollectionsKpiCard
          title="تجميد / سحب"
          totals={freezed}
          icon={ArchiveBoxXMarkIcon}
          accent="danger"
          loading={freezedLoading}
        />
      </div>
    </div>
  );
}
