"use client";

import { useState } from "react";
import { Button } from "@/app/Components/Button";
import { Input } from "@/app/Components/Input";
import DeleteModal from "@/app/Components/DeleteModal";
import FormModal from "@/app/Components/FormModal";
import { PencilIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/outline";
import { useJobTitles } from "@/server/store/jobTitles";
import * as api from "../../../../../server/services/api/jobTitles/jobTitles";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import TabsSkeleton from "./SkeletonTabs";

export default function JobTitlesTab() {
  const queryClient = useQueryClient();
  const { data, isLoading: jobTitlesLoading } = useJobTitles();

  const [deleteId,     setDeleteID]    = useState<number | undefined>(undefined);
  const [loading,      setLoading]     = useState(false);
  const [error,        setError]       = useState<string | null>(null);
  const [formState,    setFormState]   = useState<JobTitle>({ name: "", id: undefined });
  const [openDeleteDS, setOpenDeleteDS] = useState(false);
  const [isModalOpen,  setIsModalOpen] = useState(false);

  const { mutateAsync: createJobTitle } = useMutation({
    mutationFn: (data: JobTitle) => api.createJobTitle(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobTitles"] });
      setIsModalOpen(false);
      handleResetForm();
      message.success("تم إنشاء الوظيفة بنجاح");
    },
    onError: () => { message.error("حدث خطأ أثناء إنشاء الوظيفة."); },
  });

  const { mutateAsync: updateJobTitle } = useMutation({
    mutationFn: ({ id, data }: { id: number; data: JobTitle }) => api.updateJobTitle(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobTitles"] });
      setIsModalOpen(false);
      handleResetForm();
      message.success("تم تحديث الوظيفة بنجاح");
    },
    onError: () => { message.error("حدث خطأ أثناء تحديث الوظيفة."); },
  });

  const { mutateAsync: deleteJobTitle } = useMutation({
    mutationFn: (id: number) => api.deleteJobTitle(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobTitles"] });
      setDeleteID(undefined);
      setOpenDeleteDS(false);
      message.success("تم حذف الوظيفة بنجاح");
    },
    onError: () => { message.error("حدث خطأ أثناء حذف الوظيفة."); },
  });

  const handleSaveJobTitle = async () => {
    setError(null);
    if (!formState.name.trim()) { setError("يرجى إدخال اسم الوظيفة"); return; }
    setLoading(true);
    try {
      const data: JobTitle = { name: formState.name.trim() };
      if (formState.id != null) await updateJobTitle({ id: formState.id, data });
      else await createJobTitle(data);
    } catch { setError("حدث خطأ أثناء الحفظ، حاول مرة أخرى"); }
    finally { setLoading(false); }
  };

  const handleResetForm = () => { setFormState({ name: "", id: undefined }); setError(null); };
  const openCreateModal = () => { handleResetForm(); setIsModalOpen(true); };
  const openEditModal   = (j: JobTitle) => { setFormState({ name: j.name, id: j.id }); setError(null); setIsModalOpen(true); };
  const closeModal      = () => { setIsModalOpen(false); handleResetForm(); };
  const isEditing       = formState.id != null;

  return (
    <div>
      {/* Header row */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="section-title mb-0">المسميات الوظيفية</h2>
        <Button variant="primary" size="sm" onClick={openCreateModal}>
          <PlusIcon className="w-4 h-4" />
          إضافة
        </Button>
      </div>

      {/* List */}
      {jobTitlesLoading ? <TabsSkeleton /> : (
             <div className="h-[calc(100vh-260px)] overflow-y-auto pr-1">
        <ul className="space-y-2">
          {data?.map((title) => (
            <li key={title.id} className="settings-list-item">
              <span className="text-sm font-medium text-gray-900">{title.name}</span>
              <div className="flex gap-1.5">
                <button onClick={() => openEditModal(title)} className="table-action-edit" title="تعديل">
                  <PencilIcon className="w-4 h-4" />
                </button>
                <button onClick={() => { setDeleteID(title.id); setOpenDeleteDS(true); }} className="table-action-delete" title="حذف">
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
        title={isEditing ? "تعديل مسمى وظيفي" : "إضافة مسمى وظيفي"}
        onConfirm={handleSaveJobTitle}
        isLoading={loading}
        confirmLabel={isEditing ? "تحديث" : "إضافة"}
      >
        <Input
          label="اسم الوظيفة"
          placeholder="أدخل اسم الوظيفة"
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
          Title="حذف الوظيفة"
          Body="هل أنت متأكد أنك تريد حذف هذه الوظيفة؟"
          handleClick={() => deleteJobTitle(deleteId)}
        />
      )}
    </div>
  );
}
