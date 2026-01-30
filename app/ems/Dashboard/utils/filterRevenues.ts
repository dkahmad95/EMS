import { RevenueRecord } from "./types";

interface Filters {
  office?: string;
  employeeName?: string;
  startDate?: string;
  endDate?: string;
  currency?: string; 
}

export const filterRevenues = (data: RevenueRecord[], filters: Filters) => {
  return data.filter((r) => {
    const date = new Date(r.date).getTime();
    const start = filters.startDate ? new Date(filters.startDate).getTime() : 0;
    const end = filters.endDate ? new Date(filters.endDate).getTime() : Date.now();

    return (
      (!filters.office || r.office === filters.office) &&
      (!filters.employeeName || r.employeeName === filters.employeeName) &&
      (!filters.currency || r.currency === filters.currency) && // <-- filter by currency
      date >= start &&
      date <= end
    );
  });
};
