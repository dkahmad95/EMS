"use client";

import { useState } from "react";
import { Button } from "@/app/Components/Button";
import { Input } from "@/app/Components/Input";
import DeleteModal from "@/app/Components/DeleteModal";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useCities } from "@/server/store/cities";
import { useDistricts } from "@/server/store/districts";
import * as api from "../../../../../server/services/api/cities/cities";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import TabsSkeleton from "./SkeletonTabs";
import Loader from "@/app/Components/Loader";

export default function CitiesTab() {
  const queryClient = useQueryClient();
  const { data: cities, isLoading: citiesLoading } = useCities();
  const { data: districts } = useDistricts();

  const [deleteId, setDeleteID] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; district?: string }>({});

  const [formState, setFormState] = useState<City>({
    name: "",
    district_id: 0,
    id: undefined,
  });
  const [openDeleteDS, setOpenDeleteDS] = useState(false);

  // Create mutation
  const { mutateAsync: createCity } = useMutation({
    mutationFn: (data: City) => api.createCity(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cities"] });
      handleResetForm();
      message.success("تم إنشاء المدينة بنجاح");
    },
    onError: () => {
      message.error("حدث خطأ أثناء إنشاء المدينة.");
    },
  });

  // Update mutation
  const { mutateAsync: updateCity } = useMutation({
    mutationFn: ({ id, data }: { id: number; data: City }) =>
      api.updateCity(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cities"] });
      handleResetForm();
      message.success("تم تحديث المدينة بنجاح");
    },
    onError: () => {
      message.error("حدث خطأ أثناء تحديث المدينة.");
    },
  });

  // Delete mutation
  const { mutateAsync: deleteCity } = useMutation({
    mutationFn: (id: number) => api.deleteCity(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cities"] });
      setDeleteID(undefined);
      setOpenDeleteDS(false);
      message.success("تم حذف المدينة بنجاح");
    },
    onError: () => {
      message.error("حدث خطأ أثناء حذف المدينة.");
    },
  });

  const handleSaveCity = async () => {
    setErrors({}); // reset errors

    // Validation
    if (!formState.name.trim()) {
      setErrors((prev) => ({ ...prev, name: "يرجى إدخال اسم المدينة" }));
      return;
    }
    if (!formState.district_id) {
      setErrors((prev) => ({ ...prev, district: "يرجى اختيار القضاء" }));
      return;
    }

    setLoading(true);
    const cityData: City = {
      name: formState.name.trim(),
      district_id: formState.district_id,
    };

    try {
      if (formState.id !== undefined && formState.id !== null) {
        await updateCity({ id: formState.id, data: cityData });
      } else {
        await createCity(cityData);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const setFormData = (city: City) => {
    setFormState({
      name: city.name,
      district_id: city.district_id,
      id: city.id,
    });
    setErrors({});
  };

  const handleResetForm = () => {
    setFormState({
      name: "",
      district_id: 0,
      id: undefined,
    });
    setErrors({});
  };

  const getDistrictName = (districtId: number) => {
    const district = districts?.find((d) => d.id === districtId);
    return district?.name || "";
  };

  const isEditing = formState.id !== null && formState.id !== undefined;
  const isFormValid = formState.name.trim().length > 0 && formState.district_id > 0;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-gray-700">المدن</h2>

      <div className="flex flex-col md:flex-row gap-2 mb-2 bg-white p-4 rounded shadow">
        <div className="flex-1">
          <Input
            placeholder="أدخل اسم المدينة"
            value={formState.name}
            onChange={(e) =>
              setFormState((prev) => ({ ...prev, name: e.target.value }))
            }
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>

        <div className="flex-1">
          <select
            value={formState.district_id || ""}
            onChange={(e) =>
              setFormState((prev) => ({
                ...prev,
                district_id: Number(e.target.value),
              }))
            }
            className="border rounded p-2 text-gray-700 w-full"
          >
            <option value="">اختر القضاء</option>
            {districts?.map((district) => (
              <option key={district.id} value={district.id}>
                {district.name}
              </option>
            ))}
          </select>
          {errors.district && (
            <p className="text-red-500 text-xs mt-1">{errors.district}</p>
          )}
        </div>

        <Button
          onClick={handleSaveCity}
          disabled={!isFormValid || loading}
          className={`flex items-center gap-2 text-white ${
            isFormValid
              ? isEditing
                ? "bg-secondary-700 hover:bg-secondary-600"
                : "bg-primary-700 hover:bg-primary-600"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          {loading ? <Loader borderColor="white" /> : isEditing ? "تحديث" : "إضافة"}
        </Button>
      </div>

      {citiesLoading ? (
        <TabsSkeleton count={3} />
      ) : (
        <ul className="space-y-2 mt-4">
          {cities?.map((city) => (
            <li
              key={city.id}
              className="p-3 bg-white shadow rounded text-gray-700 flex justify-between items-center"
            >
              <div>
                <span className="font-medium">{city.name}</span>
                <span className="text-sm text-gray-500 mr-2">
                  ({getDistrictName(city.district_id)})
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setFormData(city)}
                  className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                  title="تعديل"
                >
                  <PencilIcon className="w-5 h-5 text-gray-700" />
                </button>

                <button
                  onClick={() => {
                    setDeleteID(city.id);
                    setOpenDeleteDS(true);
                  }}
                  className="p-2 rounded-lg bg-red-100 hover:bg-red-200 transition-colors"
                  title="حذف"
                >
                  <TrashIcon className="w-5 h-5 text-red-600" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {deleteId !== undefined && deleteId !== null && (
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
