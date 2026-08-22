"use client";
import CollectionsTable from "./Components/CollectionsTable";

const CollectionsPage = () => {
  return (
    <div className="flex flex-col h-full min-h-0 gap-4 animate-fade-in">
      <div className="page-header !mb-0 flex-none">
        <h1 className="page-title">إستقطاب</h1>
        <p className="page-subtitle">تسجيل وإدارة الإستقطاب </p>
      </div>
      <CollectionsTable />
    </div>
  );
};

export default CollectionsPage;
