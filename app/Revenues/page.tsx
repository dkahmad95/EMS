"use client";

import dynamic from "next/dynamic";

const RevenuesTable = dynamic(() => import("./Components/RevenueTable"), {
  ssr: false,
});

const RevenuesList = () => {
  return (
    <main className="w-full">
      

      <RevenuesTable />
    </main>
  );
};

export default RevenuesList;
