"use client";

interface Props {
  revenues: RevenueRecord[];
}

const currencyColors = [
  { icon: "text-primary-600", bg: "bg-primary-100", accent: "border-primary-400" },
  { icon: "text-secondary-600", bg: "bg-secondary-100", accent: "border-secondary-400" },
  { icon: "text-accent-600", bg: "bg-accent-100", accent: "border-accent-400" },
  { icon: "text-warning-600", bg: "bg-warning-100", accent: "border-warning-400" },
];

export default function RevenueSummary({ revenues }: Props) {
  const totalsByCurrency = revenues.reduce<Record<string, number>>((acc, r) => {
    if (!acc[r.currency]) acc[r.currency] = 0;
    acc[r.currency] += r.revenueAmount;
    return acc;
  }, {});

  const destinationsCount = revenues.reduce<Record<string, number>>((acc, r) => {
    if (!acc[r.destination]) acc[r.destination] = 0;
    acc[r.destination] += 1;
    return acc;
  }, {});

  const currencyEntries = Object.entries(totalsByCurrency);

  return (
    <div className="space-y-4">

      {/* Currency KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {currencyEntries.map(([currency, total], idx) => {
          const style = currencyColors[idx % currencyColors.length];
          return (
            <div
              key={currency}
              className={`card p-5 border-r-4 ${style.accent} hover:shadow-card-hover transition-all duration-200`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 ${style.bg} rounded-lg`}>
                  <svg className={`w-5 h-5 ${style.icon}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="badge badge-gray">{currency}</span>
              </div>
              <p className="text-xs text-gray-500 mb-1">إجمالي الإيرادات</p>
              <p className="text-2xl font-bold text-gray-900">{total.toLocaleString()}</p>
            </div>
          );
        })}
      </div>

      {/* Revenue count + destinations row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Revenue count */}
        <div className="card p-5 border-r-4 border-success-400">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-success-100 rounded-xl">
              <svg className="w-7 h-7 text-success-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-0.5">عدد الإيرادات</p>
              <p className="text-3xl font-bold text-gray-900">{revenues.length}</p>
            </div>
          </div>
        </div>

        {/* Destinations */}
        <div className="card p-5 border-r-4 border-secondary-400">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-secondary-100 rounded-lg">
              <svg className="w-5 h-5 text-secondary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-gray-700">الوجهات</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(destinationsCount).map(([dest, count]) => (
              <span
                key={dest}
                className="badge badge-primary"
              >
                {dest}
                <span className="font-bold mr-0.5">{count}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
