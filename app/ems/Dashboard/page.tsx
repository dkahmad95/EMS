"use client";
import dynamic from "next/dynamic";
import { DashboardSkeleton } from "./Components/Skeletons";

// Charts/DataGrid are browser-only; skip SSR and keep the layout stable with a skeleton.
const DashboardClient = dynamic(() => import("./DashboardClient"), {
  ssr: false,
  loading: () => <DashboardSkeleton />,
});

export default function DashboardPage() {
  return <DashboardClient />;
}
