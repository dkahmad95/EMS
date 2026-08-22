"use client";
import RevenuesTable from "./Components/RevenuesTable";

const RevenuesList = () => {
  return (
    <div className="flex flex-col h-full min-h-0 gap-4 animate-fade-in">
      <div className="page-header !mb-0 flex-none">
        <h1 className="page-title">الإيرادات</h1>
        <p className="page-subtitle">تسجيل وإدارة إيرادات الجمعية</p>
      </div>
      <RevenuesTable />
    </div>
  );
};

export default RevenuesList;
