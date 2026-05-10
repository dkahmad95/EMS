"use client";

import { useState } from "react";
import { Button } from "@/app/Components/Button";
import { Input } from "@/app/Components/Input";
import DeleteModal from "@/app/Components/DeleteModal";
import FormModal from "@/app/Components/FormModal";
import { PencilIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/outline";
import { useGovernorates } from "@/server/store/governorates";
import * as api from "../../../../../server/services/api/governorates/governorates";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import TabsSkeleton from "./SkeletonTabs";

export default function GovernoratesTab() {
  const queryClient = useQueryClient();
  const { data, isLoading: governoratesLoading } = useGovernorates();

  const [deleteId,    setDeleteID]    = useState<number | undefined>(undefined);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState<string | null>(null);
  const [formState,   setFormState]   = useState<Governorate>({ name: "", id: undefined });
  const [openDeleteDS, setOpenDeleteDS] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { mutateAsync: createGovernorate } = useMutation({
    mutationFn: (data: Governorate) => api.createGovernorate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["governorates"] });
      setIsModalOpen(false);
      handleResetForm();
      message.success("تم إنشاء المحافظة بنجاح");
    },
    onError: () => { message.error("حدث خطأ أثناء إنشاء المحافظة."); },
  });

  const { mutateAsync: updateGovernorate } = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Governorate }) => api.updateGovernorate(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["governorates"] });
      setIsModalOpen(false);
      handleResetForm();
      message.success("تم تحديث المحافظة بنجاح");
    },
    onError: () => { message.error("حدث خطأ أثناء تحديث المحافظة."); },
  });

  const { mutateAsync: deleteGovernorate } = useMutation({
    mutationFn: (id: number) => api.deleteGovernorate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["governorates"] });
      setDeleteID(undefined);
      setOpenDeleteDS(false);
      message.success("تم حذف المحافظة بنجاح");
    },
    onError: () => { message.error("حدث خطأ أثناء حذف المحافظة."); },
  });

  const handleSaveGovernorate = async () => {
    setError(null);
    if (!formState.name.trim()) { setError("يرجى إدخال اسم المحافظة"); return; }
    setLoading(true);
    try {
      const data: Governorate = { name: formState.name.trim() };
      if (formState.id != null) await updateGovernorate({ id: formState.id, data });
      else await createGovernorate(data);
    } catch { setError("حدث خطأ أثناء الحفظ، حاول مرة أخرى"); }
    finally { setLoading(false); }
  };

  const handleResetForm  = () => { setFormState({ name: "", id: undefined }); setError(null); };
  const openCreateModal  = () => { handleResetForm(); setIsModalOpen(true); };
  const openEditModal    = (gov: Governorate) => { setFormState({ name: gov.name, id: gov.id }); setError(null); setIsModalOpen(true); };
  const closeModal       = () => { setIsModalOpen(false); handleResetForm(); };

  const isEditing   = formState.id != null;
  const isFormValid = formState.name.trim().length > 0;

  return (
    <div>
      {/* Header row */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="section-title mb-0">المحافظات</h2>
        <Button variant="primary" size="sm" onClick={openCreateModal}>
          <PlusIcon className="w-4 h-4" />
          إضافة
        </Button>
      </div>

      {/* List */}
      {governoratesLoading ? <TabsSkeleton /> : (
        <ul className="space-y-2">
          {data?.map((gov) => (
            <li key={gov.id} className="settings-list-item">
              <span className="text-sm font-medium text-gray-900">{gov.name}</span>
              <div className="flex gap-1.5">
                <button onClick={() => openEditModal(gov)} className="table-action-edit" title="تعديل">
                  <PencilIcon className="w-4 h-4" />
                </button>
                <button onClick={() => { setDeleteID(gov.id); setOpenDeleteDS(true); }} className="table-action-delete" title="حذف">
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Form modal */}
      <FormModal
        open={isModalOpen}
        onClose={closeModal}
        title={isEditing ? "تعديل محافظة" : "إضافة محافظة"}
        onConfirm={handleSaveGovernorate}
        isLoading={loading}
        confirmLabel={isEditing ? "تحديث" : "إضافة"}
      >
        <Input
          label="اسم المحافظة"
          placeholder="أدخل اسم المحافظة"
          value={formState.name}
          onChange={(e) => setFormState((p) => ({ ...p, name: e.target.value }))}
          error={error ?? undefined}
        />
      </FormModal>

      {/* Delete modal */}
      {deleteId != null && (
        <DeleteModal
          open={openDeleteDS}
          setOpen={setOpenDeleteDS}
          Title="حذف المحافظة"
          Body="هل أنت متأكد أنك تريد حذف هذه المحافظة؟"
          handleClick={() => deleteGovernorate(deleteId)}
        />
      )}
    </div>
  );
}
