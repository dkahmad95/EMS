"use client";

import { useState } from "react";
import { Button } from "@/app/Components/Button";
import { Input } from "@/app/Components/Input";
import DeleteModal from "@/app/Components/DeleteModal";
import FormModal from "@/app/Components/FormModal";
import { PencilIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/outline";
import { useOffices } from "@/server/store/offices";
import { useCities } from "@/server/store/cities";
import * as api from "../../../../../server/services/api/offices/offices";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import TabsSkeleton from "./SkeletonTabs";

const selectCls = "w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 hover:border-gray-400 transition-all";

export default function OfficesTab() {
  const queryClient = useQueryClient();
  const { data: offices, isLoading: officesLoading } = useOffices();
  const { data: cities } = useCities();

  const [deleteId,     setDeleteID]    = useState<number | undefined>(undefined);
  const [loading,      setLoading]     = useState(false);
  const [error,        setError]       = useState<string | null>(null);
  const [formState,    setFormState]   = useState<Office>({ name: "", address: "", city_id: 0, id: undefined });
  const [openDeleteDS, setOpenDeleteDS] = useState(false);
  const [isModalOpen,  setIsModalOpen] = useState(false);

  const { mutateAsync: createOffice } = useMutation({
    mutationFn: (data: Office) => api.createOffice(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offices"] });
      setIsModalOpen(false);
      handleResetForm();
      message.success("تم إنشاء المكتب بنجاح");
    },
    onError: () => message.error("حدث خطأ أثناء إنشاء المكتب."),
  });

  const { mutateAsync: updateOffice } = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Office }) => api.updateOffice(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offices"] });
      setIsModalOpen(false);
      handleResetForm();
      message.success("تم تحديث المكتب بنجاح");
    },
    onError: () => message.error("حدث خطأ أثناء تحديث المكتب."),
  });

  const { mutateAsync: deleteOffice } = useMutation({
    mutationFn: (id: number) => api.deleteOffice(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offices"] });
      setDeleteID(undefined);
      setOpenDeleteDS(false);
      message.success("تم حذف المكتب بنجاح");
    },
    onError: () => message.error("حدث خطأ أثناء حذف المكتب."),
  });

  const handleSaveOffice = async () => {
    setError(null);
    if (!formState.name.trim() || !formState.address.trim() || !formState.city_id) {
      setError("يرجى إدخال جميع الحقول المطلوبة");
      return;
    }
    setLoading(true);
    try {
      const data: Office = { name: formState.name.trim(), address: formState.address.trim(), city_id: formState.city_id };
      if (formState.id != null) await updateOffice({ id: formState.id, data });
      else await createOffice(data);
    } catch { setError("حدث خطأ أثناء الحفظ، حاول مرة أخرى"); }
    finally { setLoading(false); }
  };

  const handleResetForm = () => { setFormState({ name: "", address: "", city_id: 0, id: undefined }); setError(null); };
  const openCreateModal = () => { handleResetForm(); setIsModalOpen(true); };
  const openEditModal   = (o: Office) => { setFormState({ name: o.name, address: o.address, city_id: o.city_id, id: o.id }); setError(null); setIsModalOpen(true); };
  const closeModal      = () => { setIsModalOpen(false); handleResetForm(); };

  const getCityName = (id: number) => cities?.find((c) => c.id === id)?.name || "";
  const isEditing   = formState.id != null;
  const isFormValid = !!(formState.name.trim() && formState.address.trim() && formState.city_id > 0);

  return (
    <div>
      {/* Header row */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="section-title mb-0">المكاتب</h2>
        <Button variant="primary" size="sm" onClick={openCreateModal}>
          <PlusIcon className="w-4 h-4" />
          إضافة
        </Button>
      </div>

      {/* List */}
      {officesLoading ? <TabsSkeleton /> : (
        <ul className="space-y-2">
          {offices?.map((office) => (
            <li key={office.id} className="settings-list-item">
              <div>
                <div className="text-sm font-medium text-gray-900">{office.name}</div>
                <div className="text-xs text-gray-400">{office.address} · {getCityName(office.city_id)}</div>
              </div>
              <div className="flex gap-1.5">
                <button onClick={() => openEditModal(office)} className="table-action-edit" title="تعديل">
                  <PencilIcon className="w-4 h-4" />
                </button>
                <button onClick={() => { setDeleteID(office.id); setOpenDeleteDS(true); }} className="table-action-delete" title="حذف">
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
        title={isEditing ? "تعديل مكتب" : "إضافة مكتب"}
        onConfirm={handleSaveOffice}
        isLoading={loading}
        confirmLabel={isEditing ? "تحديث" : "إضافة"}
      >
        <Input
          label="اسم المكتب"
          placeholder="أدخل اسم المكتب"
          value={formState.name}
          onChange={(e) => setFormState((p) => ({ ...p, name: e.target.value }))}
        />
        <Input
          label="العنوان"
          placeholder="أدخل عنوان المكتب"
          value={formState.address}
          onChange={(e) => setFormState((p) => ({ ...p, address: e.target.value }))}
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">المدينة</label>
          <select
            value={formState.city_id || ""}
            onChange={(e) => setFormState((p) => ({ ...p, city_id: Number(e.target.value) }))}
            className={selectCls}
          >
            <option value="">اختر المدينة</option>
            {cities?.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        {error && <p className="text-xs text-rose-600">{error}</p>}
      </FormModal>

      {/* Delete modal */}
      {deleteId != null && (
        <DeleteModal
          open={openDeleteDS}
          setOpen={setOpenDeleteDS}
          Title="حذف المكتب"
          Body="هل أنت متأكد أنك تريد حذف هذا المكتب؟"
          handleClick={() => deleteOffice(deleteId)}
        />
      )}
    </div>
  );
}
