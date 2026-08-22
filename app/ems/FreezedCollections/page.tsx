"use client";
import FreezedCollectionsTable from "./Components/FreezedCollectionsTable";

const FreezedCollectionsPage = () => {
  return (
    <div className="flex flex-col h-full min-h-0 gap-4 animate-fade-in">
      <div className="page-header !mb-0 flex-none">
        <h1 className="page-title">تجميد/سحب</h1>
        <p className="page-subtitle">تسجيل وإدارة التجميد/السحب</p>
      </div>
      <FreezedCollectionsTable />
    </div>
  );
};

export default FreezedCollectionsPage;
