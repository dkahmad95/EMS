"use client";

import { useState } from "react";
import { Button } from "@/app/Components/Button";
import { Input } from "@/app/Components/Input";
import DeleteModal from "@/app/Components/DeleteModal";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

export default function DestinationsTab() {
  const [destinationName, setDestinationName] = useState("");
  const [destinations, setDestinations] = useState<
    { id: number; name: string }[]
  >([]);
  const [editId, setEditId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [open, setOpen] = useState(false);

  const handleSaveDestination = () => {
    if (!destinationName.trim()) return;

    if (editId !== null) {
      setDestinations((prev) =>
        prev.map((dest) =>
          dest.id === editId
            ? { ...dest, name: destinationName.trim() }
            : dest
        )
      );
      setEditId(null);
    } else {
      setDestinations((prev) => [
        ...prev,
        { id: Date.now(), name: destinationName.trim() },
      ]);
    }

    setDestinationName("");
  };

  const handleDelete = () => {
    if (deleteId !== null) {
      setDestinations((prev) => prev.filter((d) => d.id !== deleteId));
      setDeleteId(null);
      setOpen(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-gray-700">الوجهات</h2>

      {/* Input + Button */}
      <div className="flex flex-col md:flex-row gap-2 mb-4 bg-white p-4 rounded shadow">
        <Input
          placeholder="أدخل اسم الوجهة"
          value={destinationName}
          onChange={(e) => setDestinationName(e.target.value)}
        />
        <Button
          onClick={handleSaveDestination}
          disabled={!destinationName.trim()}
          className={`flex items-center gap-2 text-white ${
            destinationName.trim()
              ? editId
                ? "bg-blue-700 hover:bg-blue-600"
                : "bg-green-700 hover:bg-green-600"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          {editId ? "تحديث" : "إضافة"}
        </Button>
      </div>

      {/* List of destinations */}
      <ul className="space-y-2">
        {destinations.map((destination) => (
          <li
            key={destination.id}
            className="p-3 bg-white shadow rounded text-gray-700 flex justify-between items-center"
          >
            <span className="font-medium">{destination.name}</span>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setDestinationName(destination.name);
                  setEditId(destination.id);
                }}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                title="تعديل"
              >
                <PencilIcon className="w-5 h-5 text-gray-700" />
              </button>

              <button
                onClick={() => {
                  setDeleteId(destination.id);
                  setOpen(true);
                }}
                className="p-2 rounded-lg bg-red-100 hover:bg-red-200 transition-colors"
                title="حذف"
              >
                <TrashIcon className="w-5 h-5 text-red-600" />
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Delete Modal */}
      <DeleteModal
        open={open}
        setOpen={setOpen}
        Title="حذف الوجهة"
        Body="هل أنت متأكد أنك تريد حذف هذه الوجهة؟"
        handleClick={handleDelete}
      />
    </div>
  );
}
