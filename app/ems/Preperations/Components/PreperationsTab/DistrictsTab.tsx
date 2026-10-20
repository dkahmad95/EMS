"use client";

import { useState } from "react";
import { Button } from "@/app/Components/Button";
import { Input } from "@/app/Components/Input";
import DeleteModal from "@/app/Components/DeleteModal";
import FormModal from "@/app/Components/FormModal";
import { PencilIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/outline";
import { useDistricts } from "@/server/store/districts";
import { useGovernorates } from "@/server/store/governorates";
import * as api from "../../../../../server/services/api/districts/districts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import TabsSkeleton from "./SkeletonTabs";
import { EmptyState } from "@/app/Components/EmptyState";
import { Select } from "@/app/Components/Select";

export default function DistrictsTab() {
  const queryClient = useQueryClient();
  const { data: districts, isLoading: districtsLoading } = useDistricts();
  const { data: governorates } = useGovernorates();

  const [deleteId,     setDeleteID]    = useState<number | undefined>(undefined);
  const [loading,      setLoading]     = useState(false);
  const [error,        setError]       = useState<string | null>(null);
  const [formState,    setFormState]   = useState<District>({ name: "", governorate_id: 0, id: undefined });
  const [openDeleteDS, setOpenDeleteDS] = useState(false);
  const [isModalOpen,  setIsModalOpen] = useState(false);

  const { mutateAsync: createDistrict } = useMutation({
    mutationFn: (data: District) => api.createDistrict(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["districts"] });
      setIsModalOpen(false);
      handleResetForm();
      message.success("تم إنشاء القضاء بنجاح");
    },
    onError: () => { message.error("حدث خطأ أثناء إنشاء القضاء."); },
  });

  const { mutateAsync: updateDistrict } = useMutation({
    mutationFn: ({ id, data }: { id: number; data: District }) => api.updateDistrict(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["districts"] });
      setIsModalOpen(false);
      handleResetForm();
      message.success("تم تحديث القضاء بنجاح");
    },
    onError: () => { message.error("حدث خطأ أثناء تحديث القضاء."); },
  });

  const { mutateAsync: deleteDistrict } = useMutation({
    mutationFn: (id: number) => api.deleteDistrict(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["districts"] });
      setDeleteID(undefined);
      setOpenDeleteDS(false);
      message.success("تم حذف القضاء بنجاح");
    },
    onError: () => { message.error("حدث خطأ أثناء حذف القضاء."); },
  });

  const handleSaveDistrict = async () => {
    setError(null);
    if (!formState.name.trim() || !formState.governorate_id) {
      setError("يرجى إدخال اسم القضاء واختيار المحافظة");
      return;
    }
    setLoading(true);
    try {
      const data: District = { name: formState.name.trim(), governorate_id: formState.governorate_id };
      if (formState.id != null) await updateDistrict({ id: formState.id, data });
      else await createDistrict(data);
    } catch { setError("حدث خطأ أثناء الحفظ، حاول مرة أخرى"); }
    finally { setLoading(false); }
  };

  const handleResetForm = () => { setFormState({ name: "", governorate_id: 0, id: undefined }); setError(null); };
  const openCreateModal = () => { handleResetForm(); setIsModalOpen(true); };
  const openEditModal   = (d: District) => { setFormState({ name: d.name, governorate_id: d.governorate_id, id: d.id }); setError(null); setIsModalOpen(true); };
  const closeModal      = () => { setIsModalOpen(false); handleResetForm(); };

  const getGovernorateName = (id: number) => governorates?.find((g) => g.id === id)?.name || "";
  const isEditing   = formState.id != null;
  const isFormValid = formState.name.trim().length > 0 && formState.governorate_id > 0;

  return (
    <div>
      {/* Header row */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="section-title mb-0">الأقضية</h2>
        <Button variant="primary" size="sm" onClick={openCreateModal}>
          <PlusIcon className="w-4 h-4" aria-hidden="true" />
          إضافة
        </Button>
      </div>

      {/* List */}
      {districtsLoading ? <TabsSkeleton /> : (
             <div className="h-[calc(100vh-260px)] overflow-y-auto pe-1">
        {districts && districts.length > 0 ? (
          <ul className="space-y-2">
            {districts?.map((district) => (
              <li key={district.id} className="settings-list-item">
                <div>
                  <span className="text-sm font-medium text-gray-900">{district.name}</span>
                  <span className="text-xs text-gray-400 ms-2">({getGovernorateName(district.governorate_id)})</span>
                </div>
                <div className="flex gap-1.5">
                  <button type="button" onClick={() => openEditModal(district)} className="table-action-edit" title="تعديل" aria-label="تعديل">
                    <PencilIcon className="w-4 h-4" aria-hidden="true" />
                  </button>
                  <button type="button" onClick={() => { setDeleteID(district.id); setOpenDeleteDS(true); }} className="table-action-delete" title="حذف" aria-label="حذف">
                    <TrashIcon className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState
            title="الأقضية"
            action={
              <Button variant="primary" size="sm" onClick={openCreateModal}>
                <PlusIcon className="w-4 h-4" aria-hidden="true" />
                إضافة
              </Button>
            }
          />
        )}
        </div>
      )}

      {/* Form modal */}
      <FormModal
        open={isModalOpen}
        onClose={closeModal}
        title={isEditing ? "تعديل قضاء" : "إضافة قضاء"}
        onConfirm={handleSaveDistrict}
        isLoading={loading}
        confirmLabel={isEditing ? "تحديث" : "إضافة"}
      >
        <Input
          label="اسم القضاء"
          placeholder="أدخل اسم القضاء"
          value={formState.name}
          onChange={(e) => setFormState((p) => ({ ...p, name: e.target.value }))}
        />
        <Select
          label="المحافظة"
          value={formState.governorate_id || ""}
          onChange={(e) => setFormState((p) => ({ ...p, governorate_id: Number(e.target.value) }))}
        >
          <option value="">اختر المحافظة</option>
          {governorates?.map((gov) => (
            <option key={gov.id} value={gov.id}>{gov.name}</option>
          ))}
        </Select>
        {error && <p className="text-xs text-danger-600" role="alert">{error}</p>}
      </FormModal>

      {/* Delete modal */}
      {deleteId != null && (
        <DeleteModal
          open={openDeleteDS}
          setOpen={setOpenDeleteDS}
          Title="حذف القضاء"
          Body="هل أنت متأكد أنك تريد حذف هذا القضاء؟"
          handleClick={() => deleteDistrict(deleteId)}
        />
      )}
    </div>
  );
}
