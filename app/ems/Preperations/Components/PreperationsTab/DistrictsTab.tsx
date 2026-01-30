"use client";

import { useState } from "react";
import { Button } from "@/app/Components/Button";
import { Input } from "@/app/Components/Input";
import DeleteModal from "@/app/Components/DeleteModal";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useDistricts } from "@/server/store/districts";
import { useGovernorates } from "@/server/store/governorates";
import * as api from "../../../../../server/services/api/districts/districts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";

export default function DistrictsTab() {
  const queryClient = useQueryClient();
  const { data: districts } = useDistricts();
  const { data: governorates } = useGovernorates();
  const [deleteId, setDeleteID] = useState<number | undefined>(undefined);
  
  // Form state management
  const [formState, setFormState] = useState<District>({
    name: "",
    governorate_id: 0,
    id: undefined,
  });
  const [openDeleteDS, setOpenDeleteDS] = useState(false);

  // Create mutation
  const { mutateAsync: createDistrict } = useMutation({
    mutationFn: (data: District) => api.createDistrict(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["districts"] });
      handleResetForm();
    },
    onError: (error) => {
      message.error("حدث خطأ أثناء إنشاء القضاء.");
    }
  });

  // Update mutation
  const { mutateAsync: updateDistrict } = useMutation({
    mutationFn: ({ id, data }: { id: number; data: District }) =>
      api.updateDistrict(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["districts"] });
      handleResetForm();
    },
    onError: (error) => {
      message.error("حدث خطأ أثناء تحديث القضاء.");
    }
  });

  // Delete mutation
  const { mutateAsync: deleteDistrict } = useMutation({
    mutationFn: (id: number) => api.deleteDistrict(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["districts"] });
      setDeleteID(undefined);
      setOpenDeleteDS(false);
    },
    onError: (error) => {
      message.error("حدث خطأ أثناء حذف القضاء.");
    }
  });

  const handleSaveDistrict = async () => {
    if (!formState.name.trim() || !formState.governorate_id) return;

    const districtData: District = {
      name: formState.name.trim(),
      governorate_id: formState.governorate_id,
    };

    if (formState.id !== undefined && formState.id !== null) {
      // Update existing district
      await updateDistrict({
        id: formState.id,
        data: districtData,
      });
    } else {
      // Create new district
      await createDistrict(districtData);
    }
  };

  const setFormData = (district: District) => {
    setFormState({
      name: district.name,
      governorate_id: district.governorate_id,
      id: district.id,
    });
  };

  const handleResetForm = () => {
    setFormState({
      name: "",
      governorate_id: 0,
      id: undefined,
    });
  };

  const getGovernorateName = (governorateId: number) => {
    const governorate = governorates?.find(g => g.id === governorateId);
    return governorate?.name || "";
  };

  const isEditing = formState.id !== null && formState.id !== undefined;
  const isFormValid = formState.name.trim().length > 0 && formState.governorate_id > 0;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-gray-700">الأقضية</h2>

      <div className="flex flex-col md:flex-row gap-2 mb-4 bg-white p-4 rounded shadow">
        <Input
          placeholder="أدخل اسم القضاء"
          value={formState.name}
          onChange={(e) =>
            setFormState((prev) => ({ ...prev, name: e.target.value }))
          }
        />
        <select
          value={formState.governorate_id || ""}
          onChange={(e) =>
            setFormState((prev) => ({
              ...prev,
              governorate_id: Number(e.target.value),
            }))
          }
          className="border rounded p-2 text-gray-700"
        >
          <option value="">اختر المحافظة</option>
          {governorates?.map((gov) => (
            <option key={gov.id} value={gov.id}>
              {gov.name}
            </option>
          ))}
        </select>
        <Button
          onClick={handleSaveDistrict}
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
        {districts?.map((district) => (
          <li
            key={district.id}
            className="p-3 bg-white shadow rounded text-gray-700 flex justify-between items-center">
            <div>
              <span className="font-medium">{district.name}</span>
              <span className="text-sm text-gray-500 mr-2">
                ({getGovernorateName(district.governorate_id)})
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setFormData(district)}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                title="تعديل">
                <PencilIcon className="w-5 h-5 text-gray-700" />
              </button>

              <button
                onClick={() => {
                  setDeleteID(district.id);
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
          Title="حذف القضاء"
          Body="هل أنت متأكد أنك تريد حذف هذا القضاء؟"
          handleClick={() => deleteDistrict(deleteId)}
        />
      )}
    </div>
  );
}
