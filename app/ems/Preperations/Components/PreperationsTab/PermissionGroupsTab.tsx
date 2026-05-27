"use client";

import { useState } from "react";
import { Button } from "@/app/Components/Button";
import { Input } from "@/app/Components/Input";
import DeleteModal from "@/app/Components/DeleteModal";
import FormModal from "@/app/Components/FormModal";
import { PencilIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/outline";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createPermissionGroup,
  updatePermissionGroup,
  deletePermissionGroup,
} from "@/server/services/api/permissionGroups/permissionGroups";
import { usePermissionGroups } from "@/server/store/permissionGroups";

const checkboxCls =
  "w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer accent-indigo-600";

const labelFor = (key: string) =>
  key === "create"
    ? "إنشاء"
    : key === "read"
      ? "قراءة"
      : key === "update"
        ? "تحديث"
        : key === "delete"
          ? "حذف"
          : "الوصول";

const PermSection = ({
  title,
  keys,
  permissions,
  resource,
  onChange,
}: {
  title: string;
  keys: string[];
  permissions: any;
  resource: string;
  onChange: (resource: any, action: string, value: boolean) => void;
}) => (
  <div className="border border-gray-100 rounded-xl p-4 bg-gray-50/50">
    <h3 className="text-sm font-semibold text-gray-700 mb-3">{title}</h3>
    <div className="grid grid-cols-2 gap-2">
      {keys.map((key) => (
        <label key={key} className="flex items-center gap-2 cursor-pointer text-sm text-gray-600 select-none">
          <input
            type="checkbox"
            className={checkboxCls}
            checked={permissions[resource]?.[key] ?? false}
            onChange={(e) => onChange(resource, key, e.target.checked)}
          />
          {labelFor(key)}
        </label>
      ))}
    </div>
  </div>
);

const defaultPermissions = () => ({
  employees: { create: false, read: false, update: false, delete: false },
  revenues: { create: false, read: false, update: false, delete: false },
  users: { create: false, read: false, update: false, delete: false },
  collections: { create: false, read: false, update: false, delete: false },
  dashboard: { access: false },
  control_panel: { access: false },
});

export default function PermissionGroupsTab() {
  const queryClient = useQueryClient();

  const [groupName, setGroupName] = useState("");
  const [permissions, setPermissions] = useState<any>(defaultPermissions());
  const [editId, setEditId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);

  const { data: groups, isLoading, error } = usePermissionGroups();

  const createMutation = useMutation({
    mutationFn: createPermissionGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["permissionGroups"] });
      setIsModalOpen(false);
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: PermissionGroup }) => updatePermissionGroup(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["permissionGroups"] });
      setIsModalOpen(false);
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
    setPermissions(defaultPermissions());
    setEditId(null);
  };

  const handlePermissionChange = (resource: keyof Permissions, action: string, value: boolean) => {
    setPermissions((prev: any) => ({
      ...prev,
      [resource]: { ...prev[resource], [action]: value },
    }));
  };

  const handleSaveGroup = () => {
    if (!groupName.trim()) return;
    const groupData: PermissionGroup = { name: groupName.trim(), permissions };
    if (editId !== null) updateMutation.mutate({ id: editId, data: groupData });
    else createMutation.mutate(groupData);
  };

  const openCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (group: PermissionGroup) => {
    if (!group.id) return;
    setGroupName(group.name);
    setPermissions(group.permissions);
    setEditId(group.id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const isFormValid = groupName.trim().length > 0;
  const isSaving = createMutation.isPending || updateMutation.isPending;
  const isEditing = editId !== null;

  if (isLoading) {
    return (
      <div>
        <h2 className="section-title">مجموعات الصلاحيات</h2>
        <div className="flex justify-center items-center h-48">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-t-transparent border-primary-500" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h2 className="section-title">مجموعات الصلاحيات</h2>
        <div className="card p-4 border-r-4 border-danger-400 text-sm text-danger-700">
          حدث خطأ أثناء تحميل البيانات. يرجى المحاولة مرة أخرى.
        </div>
      </div>
    );
  }


  const toggleAllPermissions = (value: boolean) => {
    const updated: any = {};

    Object.keys(permissions).forEach((resource) => {
      updated[resource] = {};

      Object.keys(permissions[resource]).forEach((action) => {
        updated[resource][action] = value;
      });
    });

    setPermissions(updated);
  };

  const allChecked = Object.values(permissions).every((resource: any) => Object.values(resource).every(Boolean));

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="section-title mb-0">مجموعات الصلاحيات</h2>
        <Button variant="primary" size="sm" onClick={openCreateModal}>
          <PlusIcon className="w-4 h-4" />
          إضافة مجموعة
        </Button>
      </div>

      <div className="h-[calc(100vh-260px)] overflow-y-auto pr-1">
        <div className="space-y-3">
          {groups && groups.length > 0 ? (
            groups.map((group) => (
              <div key={group.id} className="settings-list-item items-start">
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-gray-900 mb-1.5">{group.name}</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {group.permissions.dashboard.access && <span className="badge badge-primary">لوحة التحليل</span>}
                    {group.permissions.control_panel.access && (
                      <span className="badge badge-primary">إدارة النظام</span>
                    )}
                    {(["employees", "revenues", "users", "collections"] as const).map((res) => {
                      const perms = group.permissions[res];
                      const active = Object.entries(perms)
                        .filter(([, v]) => v)
                        .map(([k]) => labelFor(k));
                      if (!active.length) return null;
                      return (
                        <span key={res} className="badge badge-primary">
                          {res === "employees"
                            ? "الموظفين"
                            : res === "revenues"
                              ? "الإيرادات"
                              : res === "users"
                                ? "المستخدمين"
                                : "التحصيلات"}:{" "}
                          {active.join("، ")}
                        </span>
                      );
                    })}
                  </div>
                </div>
                <div className="flex gap-1.5 flex-shrink-0 mt-1">
                  <button onClick={() => openEditModal(group)} className="table-action-edit" title="تعديل">
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (group.id) {
                        setSelectedGroupId(group.id);
                        setOpenDeleteModal(true);
                      }
                    }}
                    className="table-action-delete"
                    title="حذف">
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-sm text-gray-400 py-10">لا توجد مجموعات صلاحيات بعد</div>
          )}
        </div>
      </div>

      <FormModal
        open={isModalOpen}
        onClose={closeModal}
        title={isEditing ? "تعديل مجموعة صلاحيات" : "إضافة مجموعة صلاحيات"}
        onConfirm={handleSaveGroup}
        isLoading={isSaving}
        confirmLabel={isEditing ? "تحديث" : "إضافة"}
        size="lg">
        <Input
          label="اسم المجموعة"
          placeholder="مثال: الإدارة، الموارد البشرية"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
        />
        <div className="flex items-center gap-2 mb-4">
          <input
            type="checkbox"
            className={checkboxCls}
            checked={allChecked}
            onChange={(e) => toggleAllPermissions(e.target.checked)}
          />
          <label className="text-sm text-gray-700 font-medium">تحديد  جميع الصلاحيات</label>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-700 mb-3">الصلاحيات</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

            <PermSection
              title="لوحة التحليل"
              keys={["access"]}
              resource="dashboard"
              permissions={permissions}
              onChange={handlePermissionChange}
            />
            <PermSection
              title="إدارة النظام"
              keys={["access"]}
              resource="control_panel"
              permissions={permissions}
              onChange={handlePermissionChange}
            />
            <PermSection
              title="قائمة الموظفين"
              keys={["create", "read", "update", "delete"]}
              resource="employees"
              permissions={permissions}
              onChange={handlePermissionChange}
            />
            <PermSection
              title="الإيرادات"
              keys={["create", "read", "update", "delete"]}
              resource="revenues"
              permissions={permissions}
              onChange={handlePermissionChange}
            />
            <PermSection
              title="إدارة المستخدمين"
              keys={["create", "read", "update", "delete"]}
              resource="users"
              permissions={permissions}
              onChange={handlePermissionChange}
            />
            <PermSection
              title="التحصيلات"
              keys={["create", "read", "update", "delete"]}
              resource="collections"
              permissions={permissions}
              onChange={handlePermissionChange}
            />
          </div>
        </div>
      </FormModal>

      <DeleteModal
        open={openDeleteModal}
        setOpen={setOpenDeleteModal}
        Title="حذف المجموعة"
        Body="هل أنت متأكد أنك تريد حذف هذه المجموعة؟"
        handleClick={() => {
          if (selectedGroupId !== null) deleteMutation.mutate(selectedGroupId);
        }}
      />
    </div>
  );
}
