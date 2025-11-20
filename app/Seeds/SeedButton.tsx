"use client";

import { Button } from "../Components/Button";
import { seedDummyData } from "./SeedDummyData";


export default function SeedButton() {
  return (
    <Button
      onClick={seedDummyData}
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
    >
     إدخال بيانات تجريبية
    </Button>
  );
}
