"use client";

import { useState } from "react";
import { Button } from "@/app/Components/Button";
import { Input } from "@/app/Components/Input";
import DeleteModal from "@/app/Components/DeleteModal";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

export default function CurrenciesTab() {
  const [currencyName, setCurrencyName] = useState("");
  const [currencies, setCurrencies] = useState<{ id: number; name: string }[]>(
    []
  );
  const [editId, setEditId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [open, setOpen] = useState(false);

  const handleSaveCurrency = () => {
    if (!currencyName.trim()) return;

    if (editId !== null) {
      setCurrencies((prev) =>
        prev.map((currency) =>
          currency.id === editId
            ? { ...currency, name: currencyName.trim() }
            : currency
        )
      );
      setEditId(null);
    } else {
      setCurrencies((prev) => [
        ...prev,
        { id: Date.now(), name: currencyName.trim() },
      ]);
    }

    setCurrencyName("");
  };

  const handleDelete = () => {
    if (deleteId !== null) {
      setCurrencies((prev) => prev.filter((c) => c.id !== deleteId));
      setDeleteId(null);
      setOpen(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-gray-700">العملات</h2>

      <div className="flex flex-col md:flex-row gap-2 mb-4 bg-white p-4 rounded shadow">
        <Input
          placeholder="أدخل اسم العملة (مثل USD)"
          value={currencyName}
          onChange={(e) => setCurrencyName(e.target.value)}
        />
        <Button
          onClick={handleSaveCurrency}
          disabled={!currencyName.trim()}
          className={`flex items-center gap-2 text-white ${
            currencyName.trim()
              ? editId
                ? "bg-blue-700 hover:bg-blue-600"
                : "bg-green-700 hover:bg-green-600"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          {editId ? "تحديث" : "إضافة"}
        </Button>
      </div>

      <ul className="space-y-2">
        {currencies.map((currency) => (
          <li
            key={currency.id}
            className="p-3 bg-white shadow rounded text-gray-700 flex justify-between items-center"
          >
            <span className="font-medium">{currency.name}</span>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setCurrencyName(currency.name);
                  setEditId(currency.id);
                }}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                title="تعديل"
              >
                <PencilIcon className="w-5 h-5 text-gray-700" />
              </button>

              <button
                onClick={() => {
                  setDeleteId(currency.id);
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

      <DeleteModal
        open={open}
        setOpen={setOpen}
        Title="حذف العملة"
        Body="هل أنت متأكد أنك تريد حذف هذه العملة؟"
        handleClick={handleDelete}
      />
    </div>
  );
}
