"use client";
import OfficeReportsTable from "./Components/OfficeReportsTable";

const OfficeReportsPage = () => {
  return (
    <div className="space-y-5 animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">تقرير عمل المكتب</h1>
        <p className="page-subtitle">تسجيل ومتابعة تقارير عمل المكتب اليومية</p>
      </div>
      <OfficeReportsTable />
    </div>
  );
};

export default OfficeReportsPage;
