"use client";

import { useState } from "react";
import { Button } from "@/app/Components/Button";
import { Input } from "@/app/Components/Input";
import DeleteModal from "@/app/Components/DeleteModal";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useOffices } from "@/server/store/offices";
import { useCities } from "@/server/store/cities";
import * as api from "../../../../../server/services/api/offices/offices";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";

export default function OfficesTab() {
  const queryClient = useQueryClient();
  const { data: offices } = useOffices();
  const { data: cities } = useCities();
  const [deleteId, setDeleteID] = useState<number | undefined>(undefined);
  
  // Form state management
  const [formState, setFormState] = useState<Office>({
    name: "",
    address: "",
    city_id: 0,
    id: undefined,
  });
  const [openDeleteDS, setOpenDeleteDS] = useState(false);

  // Create mutation
  const { mutateAsync: createOffice } = useMutation({
    mutationFn: (data: Office) => api.createOffice(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offices"] });
      handleResetForm();
    },
    onError: (error) => {
      message.error("حدث خطأ أثناء إنشاء المكتب.");
    }
  });

  // Update mutation
  const { mutateAsync: updateOffice } = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Office }) =>
      api.updateOffice(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offices"] });
      handleResetForm();
    },
    onError: (error) => {
      message.error("حدث خطأ أثناء تحديث المكتب.");
    }
  });

  // Delete mutation
  const { mutateAsync: deleteOffice } = useMutation({
    mutationFn: (id: number) => api.deleteOffice(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offices"] });
      setDeleteID(undefined);
      setOpenDeleteDS(false);
    },
    onError: (error) => {
      message.error("حدث خطأ أثناء حذف المكتب.");
    }
  });

  const handleSaveOffice = async () => {
    if (!formState.name.trim() || !formState.address.trim() || !formState.city_id) return;

    const officeData: Office = {
      name: formState.name.trim(),
      address: formState.address.trim(),
      city_id: formState.city_id,
    };

    if (formState.id !== undefined && formState.id !== null) {
      // Update existing office
      await updateOffice({
        id: formState.id,
        data: officeData,
      });
    } else {
      // Create new office
      await createOffice(officeData);
    }
  };

  const setFormData = (office: Office) => {
    setFormState({
      name: office.name,
      address: office.address,
      city_id: office.city_id,
      id: office.id,
    });
  };

  const handleResetForm = () => {
    setFormState({
      name: "",
      address: "",
      city_id: 0,
      id: undefined,
    });
  };

  const getCityName = (cityId: number) => {
    const city = cities?.find(c => c.id === cityId);
    return city?.name || "";
  };

  const isEditing = formState.id !== null && formState.id !== undefined;
  const isFormValid = formState.name.trim().length > 0 && formState.address.trim().length > 0 && formState.city_id > 0;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-gray-700">المكاتب</h2>

      <div className="flex flex-col md:flex-row gap-2 mb-4 bg-white p-4 rounded shadow">
        <Input
          placeholder="أدخل اسم المكتب"
          value={formState.name}
          onChange={(e) =>
            setFormState((prev) => ({ ...prev, name: e.target.value }))
          }
        />
        <Input
          placeholder="أدخل عنوان المكتب"
          value={formState.address}
          onChange={(e) =>
            setFormState((prev) => ({ ...prev, address: e.target.value }))
          }
        />
        <select
          value={formState.city_id || ""}
          onChange={(e) =>
            setFormState((prev) => ({
              ...prev,
              city_id: Number(e.target.value),
            }))
          }
          className="border rounded p-2 text-gray-700"
        >
          <option value="">اختر المدينة</option>
          {cities?.map((city) => (
            <option key={city.id} value={city.id}>
              {city.name}
            </option>
          ))}
        </select>
        <Button
          onClick={handleSaveOffice}
          disabled={!isFormValid}
          className={`flex items-center gap-2 text-white ${
            isFormValid
              ? isEditing
                ? "bg-blue-700 hover:bg-blue-600"
                : "bg-green-700 hover:bg-green-600"
              : "bg-gray-400 cursor-not-allowed"
          }`}>
          {isEditing ? "تحديث" : "إضافة"}
        </Button>
      </div>

      <ul className="space-y-2">
        {offices?.map((office) => (
          <li
            key={office.id}
            className="p-3 bg-white shadow rounded text-gray-700 flex justify-between items-center">
            <div>
              <div className="font-medium">{office.name}</div>
              <div className="text-sm text-gray-500">{office.address}</div>
              <div className="text-sm text-gray-500">({getCityName(office.city_id)})</div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setFormData(office)}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                title="تعديل">
                <PencilIcon className="w-5 h-5 text-gray-700" />
              </button>

              <button
                onClick={() => {
                  setDeleteID(office.id);
                  setOpenDeleteDS(true);
                }}
                className="p-2 rounded-lg bg-red-100 hover:bg-red-200 transition-colors"
                title="حذف">
                <TrashIcon className="w-5 h-5 text-red-600" />
              </button>
            </div>
          </li>
        ))}
      </ul>

      {deleteId !== undefined && deleteId !== null && (
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
