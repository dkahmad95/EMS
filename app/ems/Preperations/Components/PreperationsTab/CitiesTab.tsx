"use client";

import { useState } from "react";
import { Button } from "@/app/Components/Button";
import { Input } from "@/app/Components/Input";
import DeleteModal from "@/app/Components/DeleteModal";
import FormModal from "@/app/Components/FormModal";
import { PencilIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/outline";
import { useCities } from "@/server/store/cities";
import { useDistricts } from "@/server/store/districts";
import * as api from "../../../../../server/services/api/cities/cities";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import TabsSkeleton from "./SkeletonTabs";

const selectCls = "w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 hover:border-gray-400 transition-all";

export default function CitiesTab() {
  const queryClient = useQueryClient();
  const { data: cities, isLoading: citiesLoading } = useCities();
  const { data: districts } = useDistricts();

  const [deleteId,     setDeleteID]    = useState<number | undefined>(undefined);
  const [loading,      setLoading]     = useState(false);
  const [errors,       setErrors]      = useState<{ name?: string; district?: string }>({});
  const [formState,    setFormState]   = useState<City>({ name: "", district_id: 0, id: undefined });
  const [openDeleteDS, setOpenDeleteDS] = useState(false);
  const [isModalOpen,  setIsModalOpen] = useState(false);

  const { mutateAsync: createCity } = useMutation({
    mutationFn: (data: City) => api.createCity(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cities"] });
      setIsModalOpen(false);
      handleResetForm();
      message.success("تم إنشاء المدينة بنجاح");
    },
    onError: () => { message.error("حدث خطأ أثناء إنشاء المدينة."); },
  });

  const { mutateAsync: updateCity } = useMutation({
    mutationFn: ({ id, data }: { id: number; data: City }) => api.updateCity(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cities"] });
      setIsModalOpen(false);
      handleResetForm();
      message.success("تم تحديث المدينة بنجاح");
    },
    onError: () => { message.error("حدث خطأ أثناء تحديث المدينة."); },
  });

  const { mutateAsync: deleteCity } = useMutation({
    mutationFn: (id: number) => api.deleteCity(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cities"] });
      setDeleteID(undefined);
      setOpenDeleteDS(false);
      message.success("تم حذف المدينة بنجاح");
    },
    onError: () => { message.error("حدث خطأ أثناء حذف المدينة."); },
  });

  const handleSaveCity = async () => {
    setErrors({});
    if (!formState.name.trim()) { setErrors((p) => ({ ...p, name: "يرجى إدخال اسم المدينة" })); return; }
    if (!formState.district_id) { setErrors((p) => ({ ...p, district: "يرجى اختيار القضاء" })); return; }
    setLoading(true);
    try {
      const data: City = { name: formState.name.trim(), district_id: formState.district_id };
      if (formState.id != null) await updateCity({ id: formState.id, data });
      else await createCity(data);
    } catch { /* handled */ }
    finally { setLoading(false); }
  };

  const handleResetForm = () => { setFormState({ name: "", district_id: 0, id: undefined }); setErrors({}); };
  const openCreateModal = () => { handleResetForm(); setIsModalOpen(true); };
  const openEditModal   = (city: City) => { setFormState({ name: city.name, district_id: city.district_id, id: city.id }); setErrors({}); setIsModalOpen(true); };
  const closeModal      = () => { setIsModalOpen(false); handleResetForm(); };

  const getDistrictName = (id: number) => districts?.find((d) => d.id === id)?.name || "";
  const isEditing   = formState.id != null;

  return (
    <div>
      {/* Header row */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="section-title mb-0">المدن</h2>
        <Button variant="primary" size="sm" onClick={openCreateModal}>
          <PlusIcon className="w-4 h-4" />
          إضافة
        </Button>
      </div>

      {/* List */}
      {citiesLoading ? <TabsSkeleton /> : (
        <ul className="space-y-2">
          {cities?.map((city) => (
            <li key={city.id} className="settings-list-item">
              <div>
                <span className="text-sm font-medium text-gray-900">{city.name}</span>
                <span className="text-xs text-gray-400 mr-2">({getDistrictName(city.district_id)})</span>
              </div>
              <div className="flex gap-1.5">
                <button onClick={() => openEditModal(city)} className="table-action-edit" title="تعديل">
                  <PencilIcon className="w-4 h-4" />
                </button>
                <button onClick={() => { setDeleteID(city.id); setOpenDeleteDS(true); }} className="table-action-delete" title="حذف">
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
        title={isEditing ? "تعديل مدينة" : "إضافة مدينة"}
        onConfirm={handleSaveCity}
        isLoading={loading}
        confirmLabel={isEditing ? "تحديث" : "إضافة"}
      >
        <Input
          label="اسم المدينة"
          placeholder="أدخل اسم المدينة"
          value={formState.name}
          onChange={(e) => setFormState((p) => ({ ...p, name: e.target.value }))}
          error={errors.name}
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">القضاء</label>
          <select
            value={formState.district_id || ""}
            onChange={(e) => setFormState((p) => ({ ...p, district_id: Number(e.target.value) }))}
            className={selectCls}
          >
            <option value="">اختر القضاء</option>
            {districts?.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
          {errors.district && <p className="text-xs text-rose-600 mt-1.5">{errors.district}</p>}
        </div>
      </FormModal>

      {/* Delete modal */}
      {deleteId != null && (
        <DeleteModal
          open={openDeleteDS}
          setOpen={setOpenDeleteDS}
          Title="حذف المدينة"
          Body="هل أنت متأكد أنك تريد حذف هذه المدينة؟"
          handleClick={() => deleteCity(deleteId)}
        />
      )}
    </div>
  );
}
