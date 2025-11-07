export interface RevenueEntry {
  id: number;
  employeeName: string;
  office: string;
  date: string;
  revenueAmount: number;
  currency: string;
  notes?: string;
  destination?: string;
}

export const employees = [
  "أحمد دكماك",
  "سارة خليل",
  "علي منصور",
  "لينا فارس",
  "محمد رباح",
  "نور حيدر",
  "جواد ناصر",
];

export const offices = ["بيروت", "طرابلس", "صيدا", "زحلة", "صور"];

export const destinations = ["الكفالة ", " صدقات", "اخرى"];

export const initialRevenues: RevenueEntry[] = [
  { id: 1, employeeName: "أحمد دكماك", office: "بيروت", date: "2025-11-01", revenueAmount: 2500, currency: "ل.ل", notes: "تبرعات الأفراد", destination: "الكفالة" },
  { id: 2, employeeName: "سارة خليل", office: "طرابلس", date: "2025-11-01", revenueAmount: 1800, currency: "دولار", notes: "مبيعات ثابتة", destination: "صدقات" },
  { id: 3, employeeName: "علي منصور", office: "صيدا", date: "2025-11-02", revenueAmount: 3100, currency: "ل.ل", notes: "نتائج ممتازة", destination: "أخرى" },
  { id: 4, employeeName: "لينا فارس", office: "زحلة", date: "2025-11-02", revenueAmount: 1500, currency: "دولار", notes: "تسليم سريع", destination: "الكفالة" },
  { id: 5, employeeName: "أحمد دكماك", office: "بيروت", date: "2025-11-03", revenueAmount: 2750, currency: "ل.ل", notes: "زيادة في التبرعات", destination: "صدقات" },
  { id: 6, employeeName: "سارة خليل", office: "طرابلس", date: "2025-11-03", revenueAmount: 2200, currency: "دولار", notes: "تعامل ممتاز", destination: "أخرى" },
  { id: 7, employeeName: "علي منصور", office: "صيدا", date: "2025-11-04", revenueAmount: 1950, currency: "ل.ل", notes: "حملة جديدة", destination: "الكفالة" },
  { id: 8, employeeName: "لينا فارس", office: "زحلة", date: "2025-11-04", revenueAmount: 1600, currency: "دولار", notes: "تفاعل جيد", destination: "صدقات" },
  { id: 9, employeeName: "أحمد دكماك", office: "بيروت", date: "2025-11-05", revenueAmount: 3400, currency: "ل.ل", notes: "تبرعات إضافية", destination: "أخرى" },
  { id: 10, employeeName: "سارة خليل", office: "طرابلس", date: "2025-11-05", revenueAmount: 2900, currency: "دولار", notes: "يوم مميز", destination: "الكفالة" },
  { id: 11, employeeName: "علي منصور", office: "صيدا", date: "2025-11-06", revenueAmount: 3050, currency: "ل.ل", notes: "مساهمات شركات", destination: "صدقات" },
  { id: 12, employeeName: "لينا فارس", office: "زحلة", date: "2025-11-06", revenueAmount: 2400, currency: "دولار", notes: "تبرعات مدارس", destination: "أخرى" },
  { id: 13, employeeName: "أحمد دكماك", office: "بيروت", date: "2025-11-07", revenueAmount: 2800, currency: "ل.ل", notes: "حملة خيرية", destination: "الكفالة" },
  { id: 14, employeeName: "سارة خليل", office: "طرابلس", date: "2025-11-07", revenueAmount: 2100, currency: "دولار", notes: "مساعدات غذائية", destination: "صدقات" },
  { id: 15, employeeName: "علي منصور", office: "صيدا", date: "2025-11-08", revenueAmount: 2700, currency: "ل.ل", notes: "تبرعات الشركات", destination: "أخرى" },
  { id: 16, employeeName: "لينا فارس", office: "زحلة", date: "2025-11-08", revenueAmount: 2000, currency: "دولار", notes: "مبيعات إضافية", destination: "الكفالة" },
  { id: 17, employeeName: "أحمد دكماك", office: "بيروت", date: "2025-11-09", revenueAmount: 3500, currency: "ل.ل", notes: "تبرعات خاصة", destination: "صدقات" },
  { id: 18, employeeName: "سارة خليل", office: "طرابلس", date: "2025-11-09", revenueAmount: 2600, currency: "دولار", notes: "إيرادات مناسبة عامة", destination: "أخرى" },
  { id: 19, employeeName: "علي منصور", office: "صيدا", date: "2025-11-10", revenueAmount: 2950, currency: "ل.ل", notes: "تبرعات مجتمعية", destination: "الكفالة" },
  { id: 20, employeeName: "لينا فارس", office: "زحلة", date: "2025-11-10", revenueAmount: 1700, currency: "دولار", notes: "مشاركة فعالة", destination: "صدقات" },
  { id: 21, employeeName: "أحمد دكماك", office: "بيروت", date: "2025-11-11", revenueAmount: 3900, currency: "ل.ل", notes: "حملة المدارس", destination: "أخرى" },
  { id: 22, employeeName: "سارة خليل", office: "طرابلس", date: "2025-11-11", revenueAmount: 2300, currency: "دولار", notes: "تبرعات إلكترونية", destination: "الكفالة" },
  { id: 23, employeeName: "علي منصور", office: "صيدا", date: "2025-11-12", revenueAmount: 2500, currency: "ل.ل", notes: "مساهمات من الجمعيات", destination: "صدقات" },
  { id: 24, employeeName: "لينا فارس", office: "زحلة", date: "2025-11-12", revenueAmount: 2100, currency: "دولار", notes: "يوم التبرع المفتوح", destination: "أخرى" },
  { id: 25, employeeName: "أحمد دكماك", office: "بيروت", date: "2025-11-13", revenueAmount: 3100, currency: "ل.ل", notes: "تحصيل ممتاز", destination: "الكفالة" },
];

