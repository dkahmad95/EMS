"use client";
import OfficeReportsTable from "./Components/OfficeReportsTable";

const OfficeReportsPage = () => {
  return (
    <div className="flex flex-col h-full min-h-0 gap-4 animate-fade-in">
      <div className="page-header !mb-0 flex-none">
        <h1 className="page-title">تقرير عمل المكتب</h1>
        <p className="page-subtitle">تسجيل ومتابعة تقارير عمل المكتب اليومية</p>
      </div>
      <OfficeReportsTable />
    </div>
  );
};

export default OfficeReportsPage;
