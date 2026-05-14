"use client";

import { useState } from "react";
import { Button } from "@/app/Components/Button";
import { Input } from "@/app/Components/Input";
import DeleteModal from "@/app/Components/DeleteModal";
import FormModal from "@/app/Components/FormModal";
import { PencilIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/outline";
import { useEducationLevels } from "@/server/store/educationLevels";
import * as api from "../../../../../server/services/api/educationLevels/educationLevels";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import TabsSkeleton from "./SkeletonTabs";

export default function EducationLevelsTab() {
  const queryClient = useQueryClient();
  const { data, isLoading: educationLevelsLoading } = useEducationLevels();

  const [deleteId,     setDeleteID]    = useState<number | undefined>(undefined);
  const [loading,      setLoading]     = useState(false);
  const [error,        setError]       = useState<string | null>(null);
  const [formState,    setFormState]   = useState<EducationLevel>({ name: "", id: undefined });
  const [openDeleteDS, setOpenDeleteDS] = useState(false);
  const [isModalOpen,  setIsModalOpen] = useState(false);

  const { mutateAsync: createEducationLevel } = useMutation({
    mutationFn: (data: EducationLevel) => api.createEducationLevel(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["educationLevels"] });
      setIsModalOpen(false);
      handleResetForm();
      message.success("تم إنشاء المستوى التعليمي بنجاح");
    },
    onError: () => { message.error("حدث خطأ أثناء إنشاء المستوى التعليمي."); },
  });

  const { mutateAsync: updateEducationLevel } = useMutation({
    mutationFn: ({ id, data }: { id: number; data: EducationLevel }) => api.updateEducationLevel(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["educationLevels"] });
      setIsModalOpen(false);
      handleResetForm();
      message.success("تم تحديث المستوى التعليمي بنجاح");
    },
    onError: () => { message.error("حدث خطأ أثناء تحديث المستوى التعليمي."); },
  });

  const { mutateAsync: deleteEducationLevel } = useMutation({
    mutationFn: (id: number) => api.deleteEducationLevel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["educationLevels"] });
      setDeleteID(undefined);
      setOpenDeleteDS(false);
      message.success("تم حذف المستوى التعليمي بنجاح");
    },
    onError: () => { message.error("حدث خطأ أثناء حذف المستوى التعليمي."); },
  });

  const handleSaveEducationLevel = async () => {
    setError(null);
    if (!formState.name.trim()) { setError("يرجى إدخال اسم المستوى التعليمي"); return; }
    setLoading(true);
    try {
      const data: EducationLevel = { name: formState.name.trim() };
      if (formState.id != null) await updateEducationLevel({ id: formState.id, data });
      else await createEducationLevel(data);
    } catch { setError("حدث خطأ أثناء الحفظ، حاول مرة أخرى"); }
    finally { setLoading(false); }
  };

  const handleResetForm = () => { setFormState({ name: "", id: undefined }); setError(null); };
  const openCreateModal = () => { handleResetForm(); setIsModalOpen(true); };
  const openEditModal   = (l: EducationLevel) => { setFormState({ name: l.name, id: l.id }); setError(null); setIsModalOpen(true); };
  const closeModal      = () => { setIsModalOpen(false); handleResetForm(); };
  const isEditing       = formState.id != null;

  return (
    <div>
      {/* Header row */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="section-title mb-0">المستويات التعليمية</h2>
        <Button variant="primary" size="sm" onClick={openCreateModal}>
          <PlusIcon className="w-4 h-4" />
          إضافة
        </Button>
      </div>

      {/* List */}
      {educationLevelsLoading ? <TabsSkeleton /> : (
             <div className="h-[calc(100vh-260px)] overflow-y-auto pr-1">
        <ul className="space-y-2">
          {data?.map((level) => (
            <li key={level.id} className="settings-list-item">
              <span className="text-sm font-medium text-gray-900">{level.name}</span>
              <div className="flex gap-1.5">
                <button onClick={() => openEditModal(level)} className="table-action-edit" title="تعديل">
                  <PencilIcon className="w-4 h-4" />
                </button>
                <button onClick={() => { setDeleteID(level.id); setOpenDeleteDS(true); }} className="table-action-delete" title="حذف">
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </li>
          ))}
        </ul> 
        </div>
      )}

      {/* Form modal */}
      <FormModal
        open={isModalOpen}
        onClose={closeModal}
        title={isEditing ? "تعديل مستوى تعليمي" : "إضافة مستوى تعليمي"}
        onConfirm={handleSaveEducationLevel}
        isLoading={loading}
        confirmLabel={isEditing ? "تحديث" : "إضافة"}
      >
        <Input
          label="اسم المستوى التعليمي"
          placeholder="أدخل اسم المستوى التعليمي"
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
          Title="حذف المستوى التعليمي"
          Body="هل أنت متأكد أنك تريد حذف هذا المستوى؟"
          handleClick={() => deleteEducationLevel(deleteId)}
        />
      )}
    </div>
  );
}
