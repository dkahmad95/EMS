"use client";

import { useState } from "react";
import { Button } from "@/app/Components/Button";
import { Input } from "@/app/Components/Input";
import DeleteModal from "@/app/Components/DeleteModal";
import { PencilIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/outline";

export default function PermissionsTab() {
  const [permission, setPermission] = useState("");
  const [permissions, setPermissions] = useState<string[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  const handleAddOrUpdate = () => {
    if (!permission.trim()) return;

    if (editingIndex !== null) {
      const updated = [...permissions];
      updated[editingIndex] = permission.trim();
      setPermissions(updated);
      setEditingIndex(null);
    } else {
      if (permissions.includes(permission.trim())) return;
      setPermissions([...permissions, permission.trim()]);
    }

    setPermission("");
  };

  const handleEdit = (index: number) => {
    setPermission(permissions[index]);
    setEditingIndex(index);
  };

  const handleDelete = () => {
    if (deleteIndex !== null) {
      setPermissions(permissions.filter((_, i) => i !== deleteIndex));
      setDeleteIndex(null);
      setOpenDelete(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-gray-700">الصلاحيات</h2>

      {/* Input + Add Button */}
      <div className="flex gap-2 mb-4 bg-white p-4 rounded shadow">
        <Input
          placeholder="أدخل اسم الصلاحية (مثال: إدارة الموظفين)"
          value={permission}
          onChange={(e) => setPermission(e.target.value)}
        />
         <Button
          onClick={handleAddOrUpdate}
          disabled={!permission.trim()}
          className={`flex items-center gap-2 text-white ${
            permission.trim()
              ? "bg-green-700 hover:bg-green-600"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
       
          {editingIndex !== null ? "تحديث" : "إضافة"}
        </Button>
      </div>

      {/* Permissions List */}
      <ul className="space-y-2">
        {permissions.map((perm, index) => (
          <li
            key={index}
            className="p-3 bg-white shadow rounded text-gray-700 flex justify-between items-center"
          >
            <span className="font-medium">{perm}</span>

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

      {/* Delete Modal */}
      <DeleteModal
        open={openDelete}
        setOpen={setOpenDelete}
        Title="حذف الصلاحية"
        Body="هل أنت متأكد أنك تريد حذف هذه الصلاحية؟"
        handleClick={handleDelete}
      />
    </div>
  );
}
