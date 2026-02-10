"use client";

import { useState } from "react";
import { Button } from "@/app/Components/Button";
import { Input } from "@/app/Components/Input";
import DeleteModal from "@/app/Components/DeleteModal";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createPermissionGroup,
  updatePermissionGroup,
  deletePermissionGroup,
} from "@/server/services/api/permissionGroups/permissionGroups";
import { usePermissionGroups } from "@/server/store/permissionGroups";

export default function PermissionGroupsTab() {
  const queryClient = useQueryClient();
  const [groupName, setGroupName] = useState("");
  const [permissions, setPermissions] = useState<OfficePermissions>({
    employees: { create: false, read: false, update: false, delete: false },
    revenues: { create: false, read: false, update: false, delete: false },
    users: { create: false, read: false, update: false, delete: false },
    dashboard: { access: false },
    control_panel: { access: false },
  });
  const [editId, setEditId] = useState<number | null>(null);

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);

  const { data: groups, isLoading, error } = usePermissionGroups();

  const createMutation = useMutation({
    mutationFn: createPermissionGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["permissionGroups"] });
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: PermissionGroup }) =>
      updatePermissionGroup(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["permissionGroups"] });
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deletePermissionGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["permissionGroups"] });
      setOpenDeleteModal(false);
      setSelectedGroupId(null);
    },
  });

  const resetForm = () => {
    setGroupName("");
    setPermissions({
      control_panel: { access: false },
      employees: { create: false, read: false, update: false, delete: false },
      revenues: { create: false, read: false, update: false, delete: false },
      users: { create: false, read: false, update: false, delete: false },
      dashboard: { access: false },
    });
    setEditId(null);
  };

  const handlePermissionChange = (
    resource: keyof OfficePermissions,
    action: string,
    value: boolean
  ) => {
    setPermissions((prev) => ({
      ...prev,
      [resource]: {
        ...prev[resource],
        [action]: value,
      },
    }));
  };

  const handleSaveGroup = () => {
    if (!groupName.trim()) return;

    const groupData: PermissionGroup = {
      name: groupName.trim(),
      permissions,
    };

    if (editId !== null) {
      updateMutation.mutate({ id: editId, data: groupData });
    } else {
      createMutation.mutate(groupData);
    }
  };

  const handleEditGroup = (group: PermissionGroup) => {
    if (!group.id) return;
    setGroupName(group.name);
    setPermissions(group.permissions);
    setEditId(group.id);
  };

  const handleDeleteGroup = (id: number) => {
    setSelectedGroupId(id);
    setOpenDeleteModal(true);
  };

  const confirmDeleteGroup = () => {
    if (selectedGroupId !== null) {
      deleteMutation.mutate(selectedGroupId);
    }
  };

  const isFormValid = groupName.trim().length > 0;
  const isSaving = createMutation.isPending || updateMutation.isPending;

  if (isLoading) {
    return (
      <div className="md:p-4">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">مجموعات الصلاحيات</h2>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="md:p-4">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">مجموعات الصلاحيات</h2>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          حدث خطأ أثناء تحميل البيانات. يرجى المحاولة مرة أخرى.
        </div>
      </div>
    );
  }

  return (
    <div className="md:p-4">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">مجموعات الصلاحيات</h2>

      <div className="flex flex-col gap-3 mb-4 bg-white shadow p-4 rounded">
        <Input
          placeholder="أدخل اسم المجموعة (مثال: الإدارة، الموارد البشرية)"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
        />

        <div className="space-y-4 text-gray-700">



          <div className="border-b pb-3">
            <h3 className="font-semibold mb-2">لوحة التحليل</h3>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={permissions.dashboard.access}
                onChange={(e) =>
                  handlePermissionChange("dashboard", "access", e.target.checked)
                }
              />
              الوصول
            </label>
          </div>

          <div className="border-b pb-3">
            <h3 className="font-semibold mb-2">قائمة الموظفين</h3>
            <div className="grid grid-cols-2 gap-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={permissions.employees.create}
                  onChange={(e) =>
                    handlePermissionChange("employees", "create", e.target.checked)
                  }
                />
                إنشاء
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={permissions.employees.read}
                  onChange={(e) =>
                    handlePermissionChange("employees", "read", e.target.checked)
                  }
                />
                قراءة
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={permissions.employees.update}
                  onChange={(e) =>
                    handlePermissionChange("employees", "update", e.target.checked)
                  }
                />
                تحديث
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={permissions.employees.delete}
                  onChange={(e) =>
                    handlePermissionChange("employees", "delete", e.target.checked)
                  }
                />
                حذف
              </label>
            </div>
          </div>

          <div className="border-b pb-3">
            <h3 className="font-semibold mb-2">الإيرادات</h3>
            <div className="grid grid-cols-2 gap-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={permissions.revenues.create}
                  onChange={(e) =>
                    handlePermissionChange("revenues", "create", e.target.checked)
                  }
                />
                إنشاء
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={permissions.revenues.read}
                  onChange={(e) =>
                    handlePermissionChange("revenues", "read", e.target.checked)
                  }
                />
                قراءة
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={permissions.revenues.update}
                  onChange={(e) =>
                    handlePermissionChange("revenues", "update", e.target.checked)
                  }
                />
                تحديث
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={permissions.revenues.delete}
                  onChange={(e) =>
                    handlePermissionChange("revenues", "delete", e.target.checked)
                  }
                />
                حذف
              </label>
            </div>
          </div>

          <div className="pb-3 border-b">
            <h3 className="font-semibold mb-2">إدارة المستخدمين</h3>
            <div className="grid grid-cols-2 gap-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={permissions.users.create}
                  onChange={(e) =>
                    handlePermissionChange("users", "create", e.target.checked)
                  }
                />
                إنشاء
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={permissions.users.read}
                  onChange={(e) =>
                    handlePermissionChange("users", "read", e.target.checked)
                  }
                />
                قراءة
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={permissions.users.update}
                  onChange={(e) =>
                    handlePermissionChange("users", "update", e.target.checked)
                  }
                />
                تحديث
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={permissions.users.delete}
                  onChange={(e) =>
                    handlePermissionChange("users", "delete", e.target.checked)
                  }
                />
                حذف
              </label>
            </div>
          </div>
          <div className="border-b pb-3">
            <h3 className="font-semibold mb-2">إدارة النظام</h3>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={permissions.control_panel.access}
                onChange={(e) =>
                  handlePermissionChange("control_panel", "access", e.target.checked)
                }
              />
              الوصول
            </label>
          </div>
        </div>

        <Button
          onClick={handleSaveGroup}
          disabled={!isFormValid || isSaving}
          className={`grid w-20 items-center gap-2 text-white ${isFormValid && !isSaving
            ? "bg-green-700 hover:bg-green-600"
            : "bg-gray-400 cursor-not-allowed"
            }`}
        >
          {isSaving ? "..." : editId !== null ? "تحديث" : "إضافة"}
        </Button>
      </div>

      <div className="space-y-3">
        {groups && groups.length > 0 ? (
          groups.map((group) => (
            <div
              key={group.id}
              className="p-3 bg-white shadow rounded flex justify-between items-start"
            >
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 mb-2">{group.name}</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  {group.permissions.dashboard.access && (
                    <div>✓ لوحة التحليل</div>
                  )}
                  {group.permissions.control_panel.access && (
                    <div>✓ إدارة النظام</div>
                  )}
                  {(group.permissions.employees.create ||
                    group.permissions.employees.read ||
                    group.permissions.employees.update ||
                    group.permissions.employees.delete) && (
                      <div>
                        ✓ الموظفين:{" "}
                        {[
                          group.permissions.employees.create && "إنشاء",
                          group.permissions.employees.read && "قراءة",
                          group.permissions.employees.update && "تحديث",
                          group.permissions.employees.delete && "حذف",
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      </div>
                    )}
                  {(group.permissions.revenues.create ||
                    group.permissions.revenues.read ||
                    group.permissions.revenues.update ||
                    group.permissions.revenues.delete) && (
                      <div>
                        ✓ الإيرادات:{" "}
                        {[
                          group.permissions.revenues.create && "إنشاء",
                          group.permissions.revenues.read && "قراءة",
                          group.permissions.revenues.update && "تحديث",
                          group.permissions.revenues.delete && "حذف",
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      </div>
                    )}
                  {(group.permissions.users.create ||
                    group.permissions.users.read ||
                    group.permissions.users.update ||
                    group.permissions.users.delete) && (
                      <div>
                        ✓ المستخدمين:{" "}
                        {[
                          group.permissions.users.create && "إنشاء",
                          group.permissions.users.read && "قراءة",
                          group.permissions.users.update && "تحديث",
                          group.permissions.users.delete && "حذف",
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      </div>
                    )}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEditGroup(group)}
                  className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                  title="تعديل"
                >
                  <PencilIcon className="w-5 h-5 text-gray-700" />
                </button>

                <button
                  onClick={() => group.id && handleDeleteGroup(group.id)}
                  className="p-2 rounded-lg bg-red-100 hover:bg-red-200 transition-colors"
                  title="حذف"
                >
                  <TrashIcon className="w-5 h-5 text-red-600" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 py-8">
            لا توجد مجموعات صلاحيات بعد
          </div>
        )}
      </div>

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