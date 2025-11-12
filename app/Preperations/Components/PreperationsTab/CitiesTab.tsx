"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/app/Components/Button";
import { Input } from "@/app/Components/Input";
import DeleteModal from "@/app/Components/DeleteModal";
import { PencilIcon, TrashIcon, MagnifyingGlassIcon } from "@heroicons/react/24/solid";

export default function CitiesTab() {
  const [cityName, setCityName] = useState("");
  const [cities, setCities] = useState<{ id: number; name: string }[]>([]);
  const [editId, setEditId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  // ✅ Load from localStorage when mounted
  useEffect(() => {
    const stored = localStorage.getItem("cities");
    if (stored) setCities(JSON.parse(stored));
  }, []);

  // ✅ Save to localStorage whenever cities change
  useEffect(() => {
    localStorage.setItem("cities", JSON.stringify(cities));
  }, [cities]);

  const handleSaveCity = () => {
    if (!cityName.trim()) return;

    if (editId !== null) {
      setCities((prev) =>
        prev.map((city) =>
          city.id === editId ? { ...city, name: cityName.trim() } : city
        )
      );
      setEditId(null);
    } else {
      // prevent duplicates
      if (cities.some((c) => c.name === cityName.trim())) return;
      setCities((prev) => [...prev, { id: Date.now(), name: cityName.trim() }]);
    }

    setCityName("");
  };

  const handleDelete = () => {
    if (deleteId !== null) {
      setCities((prev) => prev.filter((city) => city.id !== deleteId));
      setDeleteId(null);
      setOpen(false);
    }
  };

  // ✅ Filter by search text
  const filteredCities = useMemo(() => {
    return cities.filter((city) =>
      city.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [cities, search]);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-gray-700">المدن</h2>

      {/* Add / Edit Form */}
      <div className="flex flex-col md:flex-row gap-2 mb-4 bg-white p-4 rounded shadow">
        <Input
          placeholder="أدخل اسم المدينة"
          value={cityName}
          onChange={(e) => setCityName(e.target.value)}
        />
        <Button
          onClick={handleSaveCity}
          disabled={!cityName.trim()}
          className={`flex items-center gap-2 text-white ${
            cityName.trim()
              ? editId
                ? "bg-blue-700 hover:bg-blue-600"
                : "bg-green-700 hover:bg-green-600"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          {editId ? "تحديث" : "إضافة"}
        </Button>
      </div>

      {/* Search Field */}
      <div className="flex items-center gap-2 mb-4 bg-white p-4 rounded shadow">
        <MagnifyingGlassIcon className="w-5 h-5 text-gray-600" />
        <Input
          placeholder="ابحث عن مدينة..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* City List */}
      <ul className="space-y-2">
        {filteredCities.length > 0 ? (
          filteredCities.map((city) => (
            <li
              key={city.id}
              className="p-3 bg-white shadow rounded text-gray-700 flex justify-between items-center"
            >
              <span className="font-medium">{city.name}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setCityName(city.name);
                    setEditId(city.id);
                  }}
                  className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                  title="تعديل"
                >
                  <PencilIcon className="w-5 h-5 text-gray-700" />
                </button>

                <button
                  onClick={() => {
                    setDeleteId(city.id);
                    setOpen(true);
                  }}
                  className="p-2 rounded-lg bg-red-100 hover:bg-red-200 transition-colors"
                  title="حذف"
                >
                  <TrashIcon className="w-5 h-5 text-red-600" />
                </button>
              </div>
            </li>
          ))
        ) : (
          <li className="text-center text-gray-500 mt-4">لا توجد مدن</li>
        )}
      </ul>

      {/* Delete Confirmation Modal */}
      <DeleteModal
        open={open}
        setOpen={setOpen}
        Title="حذف المدينة"
        Body="هل أنت متأكد أنك تريد حذف هذه المدينة؟"
        handleClick={handleDelete}
      />
    </div>
  );
}
