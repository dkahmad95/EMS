export interface Employee {
  id: string;
  name: string;
  office: string;
}

export interface RevenueRecord {
  id: number;
  employeeName: string;
  office: string;
  destination: string;
  currency: string;
  date: string;
  revenueAmount: number;
  notes: string;
}
