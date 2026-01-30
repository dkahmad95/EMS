"use client";
import { Box, Typography } from "@mui/material";
import { RevenueRecord } from "../utils/types";

interface Props {
  revenues: RevenueRecord[];
}

export default function RevenueSummary({ revenues }: Props) {
  // Calculate total revenues per currency
  const totalsByCurrency = revenues.reduce<Record<string, number>>((acc, r) => {
    if (!acc[r.currency]) acc[r.currency] = 0;
    acc[r.currency] += r.revenueAmount;
    return acc;
  }, {});

  // Count revenues per destination
  const destinationsCount = revenues.reduce<Record<string, number>>((acc, r) => {
    if (!acc[r.destination]) acc[r.destination] = 0;
    acc[r.destination] += 1;
    return acc;
  }, {});

  const summaryCards = [
    {
      title: "عدد الإيرادات",
      value: revenues.length.toString(),
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      gradient: "from-accent-500 to-accent-600",
      bgGradient: "from-accent-50 to-accent-100",
      textColor: "text-accent-700",
      iconBg: "bg-accent-100",
      iconColor: "text-accent-600",
    },
  ];

  return (
    <div className="space-y-4">
      {/* Currency Totals */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Object.entries(totalsByCurrency).map(([currency, total]) => (
          <div
            key={currency}
            className="card card-hover group relative overflow-hidden"
          >
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full blur-3xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-soft">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                  {currency}
                </span>
              </div>
              <p className="text-sm font-medium text-slate-600 mb-1">إجمالي الإيرادات</p>
              <p className="text-2xl font-bold text-slate-900">{total.toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Revenue Count Card */}
        <div className="card card-hover group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-accent-100 to-accent-200 rounded-full blur-3xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
          
          <div className="relative z-10 flex items-center gap-4">
            <div className="p-4 bg-gradient-to-br from-accent-500 to-accent-600 rounded-xl shadow-soft">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600 mb-1">عدد الإيرادات</p>
              <p className="text-3xl font-bold text-slate-900">{revenues.length}</p>
            </div>
          </div>
        </div>

        {/* Destinations Card */}
        <div className="card card-hover group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-secondary-100 to-secondary-200 rounded-full blur-3xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-xl shadow-soft">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-slate-600">الوجهات</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(destinationsCount).map(([dest, count]) => (
                <span
                  key={dest}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-secondary-50 to-secondary-100 text-secondary-700 rounded-lg text-sm font-medium border border-secondary-200/50"
                >
                  {dest}: <span className="font-bold">{count}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
