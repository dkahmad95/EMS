"use client";
import CollectionsTable from "./Components/CollectionsTable";

const CollectionsPage = () => {
  return (
    <div className="space-y-5 animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">التحصيلات</h1>
        <p className="page-subtitle">تسجيل وإدارة تحصيلات الجمعية</p>
      </div>
      <CollectionsTable />
    </div>
  );
};

export default CollectionsPage;
