"use client";

import { useState } from "react";
import { Button } from "@/app/Components/Button";
import { Input } from "@/app/Components/Input";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import DeleteModal from "@/app/Components/DeleteModal"; // ✅ Import your modal

export default function PermissionGroupsTab() {
  const [groupName, setGroupName] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [groups, setGroups] = useState<
    { id: number; name: string; permissions: string[] }[]
  >([]);
  const [editId, setEditId] = useState<number | null>(null);

  // 🔴 Modal state
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);

  // Mock permissions list
  const permissionsList = [
    { value: "add_employee", label: "إضافة موظف" },
    { value: "edit_employee", label: "تعديل موظف" },
    { value: "view_reports", label: "عرض التقارير" },
    { value: "manage_offices", label: "إدارة المكاتب" },
  ];

  // Handle permission checkbox toggle
  const handlePermissionChange = (permValue: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permValue)
        ? prev.filter((p) => p !== permValue)
        : [...prev, permValue]
    );
  };

  // Add or update group
  const handleSaveGroup = () => {
    if (!groupName.trim() || selectedPermissions.length === 0) return;

    if (editId !== null) {
      // Edit mode
      setGroups((prev) =>
        prev.map((g) =>
          g.id === editId
            ? { ...g, name: groupName, permissions: selectedPermissions }
            : g
        )
      );
      setEditId(null);
    } else {
      // Add mode
      setGroups((prev) => [
        ...prev,
        {
          id: Date.now(),
          name: groupName.trim(),
          permissions: selectedPermissions,
        },
      ]);
    }

    setGroupName("");
    setSelectedPermissions([]);
  };

  // Edit group
  const handleEditGroup = (id: number) => {
    const group = groups.find((g) => g.id === id);
    if (!group) return;
    setGroupName(group.name);
    setSelectedPermissions(group.permissions);
    setEditId(id);
  };

  // Open delete confirmation modal
  const handleDeleteGroup = (id: number) => {
    setSelectedGroupId(id);
    setOpenDeleteModal(true);
  };

  // Confirm delete action
  const confirmDeleteGroup = () => {
    if (selectedGroupId !== null) {
      setGroups((prev) => prev.filter((g) => g.id !== selectedGroupId));
      setSelectedGroupId(null);
    }
  };

  return (
    <div className="md:p-4">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">
        مجموعات الصلاحيات
      </h2>

      {/* Input section */}
      <div className="flex flex-col gap-3 mb-4 bg-white shadow p-4 rounded">
        <Input
          placeholder="أدخل اسم المجموعة (مثال: الإدارة، الموارد البشرية)"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
        />

        {/* Permission checkboxes */}
        <div className="grid grid-cols-2 gap-2 text-gray-700">
          {permissionsList.map((perm) => (
            <label key={perm.value} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedPermissions.includes(perm.value)}
                onChange={() => handlePermissionChange(perm.value)}
              />
              {perm.label}
            </label>
          ))}
        </div>

        <Button
          onClick={handleSaveGroup}
          disabled={!groupName.trim()}
          className={`grid  w-20 items-center gap-2 text-white  ${
            groupName.trim()
              ? "bg-green-700 hover:bg-green-600"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
       
          {editId !== null ? "تحديث" : "إضافة"}
        </Button>
      </div>
     

      {/* Groups list */}
      <div className="space-y-3">
        {groups.map((group) => (
          <div
            key={group.id}
            className="p-3 bg-white shadow rounded flex justify-between items-start"
          >
            <div>
              <h3 className="font-semibold text-gray-800">{group.name}</h3>
              <ul className="text-sm flex md:flex-row md:gap-6 text-gray-600 mt-1 list-disc pr-4">
                {group.permissions.map((perm) => (
                  <li key={perm}>
                    {permissionsList.find((p) => p.value === perm)?.label ||
                      perm}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleEditGroup(group.id)}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                title="تعديل"
              >
                <PencilIcon className="w-5 h-5 text-gray-700" />
              </button>

              <button
                onClick={() => handleDeleteGroup(group.id)}
                className="p-2 rounded-lg bg-red-100 hover:bg-red-200 transition-colors"
                title="حذف"
              >
                <TrashIcon className="w-5 h-5 text-red-600" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 🗑️ Global Delete Modal */}
      <DeleteModal
        open={openDeleteModal}
        setOpen={setOpenDeleteModal}
        Title="حذف المجموعة"
        Body="هل أنت متأكد أنك تريد حذف هذه المجموعة؟"
        handleClick={confirmDeleteGroup}
      />
    </div>
  );
}
