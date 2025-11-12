"use client";

import { useState } from "react";
import { Button } from "@/app/Components/Button";
import { Input } from "@/app/Components/Input";
import { Select } from "@/app/Components/Select";
import DeleteModal from "@/app/Components/DeleteModal";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useLocalStorage } from "@/app/Storage/Hooks/useLocalStorage";

interface Office {
  name: string;
  city: string;
}

export default function OfficesTab() {
  const [offices, setOffices] = useLocalStorage<Office[]>("offices", []);
  const [officeName, setOfficeName] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  const cities = [
    { value: "beirut", label: "بيروت" },
    { value: "tripoli", label: "طرابلس" },
    { value: "saida", label: "صيدا" },
    { value: "tyre", label: "صور" },
    { value: "baalbek", label: "بعلبك" },
  ];

  const handleAddOrUpdate = () => {
    if (!officeName.trim() || !selectedCity.trim()) return;

    let updated;
    if (editingIndex !== null) {
      updated = [...offices];
      updated[editingIndex] = { name: officeName.trim(), city: selectedCity };
      setEditingIndex(null);
    } else {
      updated = [...offices, { name: officeName.trim(), city: selectedCity }];
    }

    setOffices(updated);
    setOfficeName("");
    setSelectedCity("");
  };

  const handleEdit = (index: number) => {
    const office = offices[index];
    setOfficeName(office.name);
    setSelectedCity(office.city);
    setEditingIndex(index);
  };

  const handleDelete = () => {
    if (deleteIndex !== null) {
      const updated = offices.filter((_, i) => i !== deleteIndex);
      setOffices(updated);
      setDeleteIndex(null);
      setOpenDelete(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-gray-700">المكاتب</h2>

      {/* Input + Select + Button */}
      <div className="flex flex-col md:flex-row gap-2 mb-4">
        <Input
          placeholder="أدخل اسم المكتب"
          value={officeName}
          onChange={(e) => setOfficeName(e.target.value)}
        />
        <Select
          label=""
          options={cities}
          value={selectedCity}
          onChange={(e: any) => setSelectedCity(e.target.value)}
        />
        <Button
          onClick={handleAddOrUpdate}
          disabled={!officeName.trim() || !selectedCity.trim()}
          className={`flex items-center gap-2 text-white ${
            officeName.trim() && selectedCity.trim()
              ? "bg-green-700 hover:bg-green-600"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          {editingIndex !== null ? "تحديث" : "إضافة"}
        </Button>
      </div>

      {/* Offices List */}
      <ul className="space-y-2">
        {offices.map((office, index) => (
          <li
            key={index}
            className="p-3 bg-white shadow rounded text-gray-700 flex justify-between items-center"
          >
            <div>
              <span className="font-medium">{office.name}</span>
              <span className="ml-2 text-sm text-gray-500">
                ({cities.find((c) => c.value === office.city)?.label})
              </span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(index)}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                title="تعديل"
              >
                <PencilIcon className="w-5 h-5 text-gray-700" />
              </button>

              <button
                onClick={() => {
                  setDeleteIndex(index);
                  setOpenDelete(true);
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

      {/* Delete Confirmation Modal */}
      <DeleteModal
        open={openDelete}
        setOpen={setOpenDelete}
        Title="حذف المكتب"
        Body="هل أنت متأكد أنك تريد حذف هذا المكتب؟"
        handleClick={handleDelete}
      />
    </div>
  );
}
