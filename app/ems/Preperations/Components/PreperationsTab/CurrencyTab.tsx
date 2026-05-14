"use client";

import { useState } from "react";
import { Button } from "@/app/Components/Button";
import { Input } from "@/app/Components/Input";
import DeleteModal from "@/app/Components/DeleteModal";
import FormModal from "@/app/Components/FormModal";
import { PencilIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/outline";
import { useCurrencies } from "@/server/store/currencies";
import * as api from "../../../../../server/services/api/currencies/currencies";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import TabsSkeleton from "./SkeletonTabs";

export default function CurrenciesTab() {
  const queryClient = useQueryClient();
  const { data, isLoading: currenciesLoading } = useCurrencies();

  const [deleteId,     setDeleteID]    = useState<number | undefined>(undefined);
  const [loading,      setLoading]     = useState(false);
  const [errors,       setErrors]      = useState<{ code?: string }>({});
  const [formState,    setFormState]   = useState<Currency>({ name: "", code: "", id: undefined });
  const [openDeleteDS, setOpenDeleteDS] = useState(false);
  const [isModalOpen,  setIsModalOpen] = useState(false);

  const { mutateAsync: createCurrency } = useMutation({
    mutationFn: (data: Currency) => api.createCurrency(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currencies"] });
      setIsModalOpen(false);
      handleResetForm();
      message.success("تم إضافة العملة بنجاح");
    },
    onError: () => { message.error("حدث خطأ أثناء إنشاء العملة."); },
  });

  const { mutateAsync: updateCurrency } = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Currency }) => api.updateCurrency(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currencies"] });
      setIsModalOpen(false);
      handleResetForm();
      message.success("تم تحديث العملة بنجاح");
    },
    onError: () => { message.error("حدث خطأ أثناء تحديث العملة."); },
  });

  const { mutateAsync: deleteCurrency } = useMutation({
    mutationFn: (id: number) => api.deleteCurrency(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currencies"] });
      setDeleteID(undefined);
      setOpenDeleteDS(false);
      message.success("تم حذف العملة بنجاح");
    },
    onError: () => { message.error("حدث خطأ أثناء حذف العملة."); },
  });

  const handleSaveCurrency = async () => {
    setErrors({});
    if (!formState.name.trim()) { message.error("يرجى إدخال اسم العملة"); return; }
    if (!formState.code.trim()) { setErrors({ code: "يرجى إدخال كود العملة" }); return; }
    if (formState.code.trim().length > 3) { setErrors({ code: "يجب أن يكون كود العملة أقل من 4 أحرف" }); return; }
    setLoading(true);
    try {
      const data: Currency = { name: formState.name.trim(), code: formState.code.trim() };
      if (formState.id != null) await updateCurrency({ id: formState.id, data });
      else await createCurrency(data);
    } catch { /* handled */ }
    finally { setLoading(false); }
  };

  const handleResetForm = () => { setFormState({ name: "", code: "", id: undefined }); setErrors({}); };
  const openCreateModal = () => { handleResetForm(); setIsModalOpen(true); };
  const openEditModal   = (c: Currency) => { setFormState({ name: c.name, code: c.code, id: c.id }); setErrors({}); setIsModalOpen(true); };
  const closeModal      = () => { setIsModalOpen(false); handleResetForm(); };
  const isEditing       = formState.id != null;
  const isFormValid     = formState.name.trim().length > 0 && formState.code.trim().length > 0 && formState.code.trim().length < 4;

  return (
    <div>
      {/* Header row */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="section-title mb-0">العملات</h2>
        <Button variant="primary" size="sm" onClick={openCreateModal}>
          <PlusIcon className="w-4 h-4" />
          إضافة
        </Button>
      </div>

      {/* List */}
      {currenciesLoading ? <TabsSkeleton /> : (
         <div className="h-[calc(100vh-260px)] overflow-y-auto pr-1">
        <ul className="space-y-2">
          {data?.map((currency) => (
            <li key={currency.id} className="settings-list-item">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-900">{currency.name}</span>
                <span className="badge badge-primary">{currency.code}</span>
              </div>
              <div className="flex gap-1.5">
                <button onClick={() => openEditModal(currency)} className="table-action-edit" title="تعديل">
                  <PencilIcon className="w-4 h-4" />
                </button>
                <button onClick={() => { setDeleteID(currency.id); setOpenDeleteDS(true); }} className="table-action-delete" title="حذف">
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
        title={isEditing ? "تعديل عملة" : "إضافة عملة"}
        onConfirm={handleSaveCurrency}
        isLoading={loading}
        confirmLabel={isEditing ? "تحديث" : "إضافة"}
      >
        <Input
          label="اسم العملة"
          placeholder="مثال: دولار أمريكي"
          value={formState.name}
          onChange={(e) => setFormState((p) => ({ ...p, name: e.target.value }))}
        />
        <Input
          label="كود العملة"
          placeholder="مثال: USD (أقل من 4 أحرف)"
          value={formState.code}
          onChange={(e) => setFormState((p) => ({ ...p, code: e.target.value }))}
          error={errors.code}
        />
      </FormModal>

      {/* Delete modal */}
      {deleteId != null && (
        <DeleteModal
          open={openDeleteDS}
          setOpen={setOpenDeleteDS}
          Title="حذف العملة"
          Body="هل أنت متأكد أنك تريد حذف هذه العملة؟"
          handleClick={() => deleteCurrency(deleteId)}
        />
      )}
    </div>
  );
}
