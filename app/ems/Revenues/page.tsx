"use client";
import RevenuesTable from "./Components/RevenuesTable";

const RevenuesList = () => {
  return (
    <div className="space-y-5 animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">الإيرادات</h1>
        <p className="page-subtitle">تسجيل وإدارة إيرادات الجمعية</p>
      </div>
      <RevenuesTable />
    </div>
  );
};

export default RevenuesList;
