"use client";

import { useState } from "react";
import { Button } from "@/app/Components/Button";
import { Input } from "@/app/Components/Input";
import DeleteModal from "@/app/Components/DeleteModal";
import FormModal from "@/app/Components/FormModal";
import { PencilIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/outline";
import { useDestinations } from "@/server/store/destinations";
import * as api from "../../../../../server/services/api/destinations/destinations";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import TabsSkeleton from "./SkeletonTabs";

export default function DestinationsTab() {
  const queryClient = useQueryClient();
  const { data, isLoading: destinationsLoading } = useDestinations();

  const [deleteId,     setDeleteID]    = useState<number | undefined>(undefined);
  const [loading,      setLoading]     = useState(false);
  const [error,        setError]       = useState<string | null>(null);
  const [formState,    setFormState]   = useState<Destination>({ name: "", id: undefined });
  const [openDeleteDS, setOpenDeleteDS] = useState(false);
  const [isModalOpen,  setIsModalOpen] = useState(false);

  const { mutateAsync: createDestination } = useMutation({
    mutationFn: (data: Destination) => api.createDestination(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["destinations"] });
      setIsModalOpen(false);
      handleResetForm();
      message.success("تم إنشاء الوجهة بنجاح");
    },
    onError: () => { message.error("حدث خطأ أثناء إنشاء الوجهة."); },
  });

  const { mutateAsync: updateDestination } = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Destination }) => api.updateDestination(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["destinations"] });
      setIsModalOpen(false);
      handleResetForm();
      message.success("تم تحديث الوجهة بنجاح");
    },
    onError: () => { message.error("حدث خطأ أثناء تحديث الوجهة."); },
  });

  const { mutateAsync: deleteDestination } = useMutation({
    mutationFn: (id: number) => api.deleteDestination(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["destinations"] });
      setDeleteID(undefined);
      setOpenDeleteDS(false);
      message.success("تم حذف الوجهة بنجاح");
    },
    onError: () => { message.error("حدث خطأ أثناء حذف الوجهة."); },
  });

  const handleSaveDestination = async () => {
    setError(null);
    if (!formState.name.trim()) { setError("يرجى إدخال اسم الوجهة"); return; }
    setLoading(true);
    try {
      const data: Destination = { name: formState.name.trim() };
      if (formState.id != null) await updateDestination({ id: formState.id, data });
      else await createDestination(data);
    } catch { setError("حدث خطأ أثناء الحفظ، حاول مرة أخرى"); }
    finally { setLoading(false); }
  };

  const handleResetForm = () => { setFormState({ name: "", id: undefined }); setError(null); };
  const openCreateModal = () => { handleResetForm(); setIsModalOpen(true); };
  const openEditModal   = (d: Destination) => { setFormState({ name: d.name, id: d.id }); setError(null); setIsModalOpen(true); };
  const closeModal      = () => { setIsModalOpen(false); handleResetForm(); };
  const isEditing       = formState.id != null;

  return (
    <div>
      {/* Header row */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="section-title mb-0">الوجهات</h2>
        <Button variant="primary" size="sm" onClick={openCreateModal}>
          <PlusIcon className="w-4 h-4" />
          إضافة
        </Button>
      </div>

      {/* List */}
      {destinationsLoading ? <TabsSkeleton /> : (
          <div className="h-[calc(100vh-260px)] overflow-y-auto pr-1">
        <ul className="space-y-2">
          {data?.map((destination) => (
            <li key={destination.id} className="settings-list-item">
              <span className="text-sm font-medium text-gray-900">{destination.name}</span>
              <div className="flex gap-1.5">
                <button onClick={() => openEditModal(destination)} className="table-action-edit" title="تعديل">
                  <PencilIcon className="w-4 h-4" />
                </button>
                <button onClick={() => { setDeleteID(destination.id); setOpenDeleteDS(true); }} className="table-action-delete" title="حذف">
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
        title={isEditing ? "تعديل وجهة" : "إضافة وجهة"}
        onConfirm={handleSaveDestination}
        isLoading={loading}
        confirmLabel={isEditing ? "تحديث" : "إضافة"}
      >
        <Input
          label="اسم الوجهة"
          placeholder="أدخل اسم الوجهة"
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
          Title="حذف الوجهة"
          Body="هل أنت متأكد أنك تريد حذف هذه الوجهة؟"
          handleClick={() => deleteDestination(deleteId)}
        />
      )}
    </div>
  );
}
