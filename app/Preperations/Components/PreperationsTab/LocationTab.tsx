// LocationTab.tsx
"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { Button } from "@/app/Components/Button";
import { Input } from "@/app/Components/Input";
import DeleteModal from "@/app/Components/DeleteModal";
import {
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

type Item = {
  id: number;
  name: string;
  parentId?: number; // for districts, links to governorate id
};

type Props = {
  title: string; // label shown on top, e.g. "المحافظات" or "الاقضية"
  storageKey: string; // localStorage key for items (e.g. 'governorates' or 'districts')
  placeholder: string;
  parentStorageKey?: string; // when provided, tie items to a parent (e.g. parentStorageKey='governorates' for districts)
  parentLabel?: string; // e.g. "المحافظة"
  parentPlaceholder?: string; // e.g. "اختر المحافظة"
};

export default function LocationTab({
  title,
  storageKey,
  placeholder,
  parentStorageKey,
  parentLabel = "المحافظة",
  parentPlaceholder = "اختر المحافظة",
}: Props) {
  const [name, setName] = useState("");
  const [items, setItems] = useState<Item[]>([]);
  const [editId, setEditId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const isFirstLoad = useRef(true);

  // parent state (if parentStorageKey provided)
  const [parents, setParents] = useState<{ id: number; name: string }[]>([]);
  const [selectedParentId, setSelectedParentId] = useState<number | "">("");

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored) setItems(JSON.parse(stored));

    if (parentStorageKey) {
      const p = localStorage.getItem(parentStorageKey);
      if (p) setParents(JSON.parse(p));
    }
  }, [storageKey, parentStorageKey]);

  // Save to localStorage
  useEffect(() => {
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return;
    }
    localStorage.setItem(storageKey, JSON.stringify(items));
  }, [items, storageKey]);

  const handleSave = () => {
    if (!name.trim()) return;

    // If this tab requires a parent, ensure one selected
    if (parentStorageKey && (selectedParentId === "" || selectedParentId === null)) {
      // you can replace alert with a nicer UI message
      alert(`يرجى اختيار ${parentLabel}`);
      return;
    }

    if (editId !== null) {
      setItems((prev) =>
        prev.map((item) =>
          item.id === editId
            ? { ...item, name: name.trim(), parentId: selectedParentId || undefined }
            : item
        )
      );
      setEditId(null);
    } else {
      if (items.some((i) => i.name === name.trim() && i.parentId === selectedParentId)) return;
      setItems((prev) => [
        ...prev,
        { id: Date.now(), name: name.trim(), parentId: selectedParentId || undefined },
      ]);
    }

    setName("");
    setSelectedParentId("");
  };

  const handleEdit = (item: Item) => {
    setName(item.name);
    setEditId(item.id);
    setSelectedParentId(item.parentId ?? "");
  };

  const handleDelete = () => {
    if (deleteId !== null) {
      setItems((prev) => prev.filter((i) => i.id !== deleteId));
      setDeleteId(null);
      setOpen(false);
    }
  };

  const filteredItems = useMemo(() => {
    return items.filter((i) =>
      i.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [items, search]);

  // helper: get parent name
  const getParentName = (pId?: number) => {
    if (!pId) return "";
    const p = parents.find((x) => x.id === pId);
    return p ? p.name : "";
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-gray-700">{title}</h2>

      {/* Add / Edit */}
      <div className="flex flex-col md:flex-row gap-2 mb-4 bg-white p-4 rounded shadow">
        <Input
          placeholder={placeholder}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* If parent required, show parent select */}
        {parentStorageKey && (
          <select
            value={selectedParentId ?? ""}
            onChange={(e) => setSelectedParentId(e.target.value ? Number(e.target.value) : "")}
            className="border rounded p-2"
            aria-label={parentLabel}
          >
            <option value="">{parentPlaceholder}</option>
            {parents.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        )}

        <Button
          onClick={handleSave}
          disabled={!name.trim()}
          className={`text-white ${
            name.trim()
              ? editId
                ? "bg-blue-700 hover:bg-blue-600"
                : "bg-green-700 hover:bg-green-600"
              : "bg-gray-400"
          }`}
        >
          {editId ? "تحديث" : "إضافة"}
        </Button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 mb-4 bg-white p-4 rounded shadow">
        <MagnifyingGlassIcon className="w-5 h-5 text-gray-600" />
        <Input
          placeholder="بحث..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* List */}
      <ul className="space-y-2">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <li
              key={item.id}
              className="p-3 bg-white shadow rounded flex justify-between items-center"
            >
              <div>
                <div className="font-medium">{item.name}</div>
                {parentStorageKey && (
                  <div className="text-sm text-gray-500">{getParentName(item.parentId)}</div>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(item)}
                  className="p-2 bg-gray-100 rounded"
                >
                  <PencilIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => {
                    setDeleteId(item.id);
                    setOpen(true);
                  }}
                  className="p-2 bg-red-100 rounded"
                >
                  <TrashIcon className="w-5 h-5 text-red-600" />
                </button>
              </div>
            </li>
          ))
        ) : (
          <li className="text-center text-gray-500">لا توجد بيانات</li>
        )}
      </ul>

      <DeleteModal
        open={open}
        setOpen={setOpen}
        Title={`حذف ${title}`}
        Body="هل أنت متأكد من الحذف؟"
        handleClick={handleDelete}
      />
    </div>
  );
}
