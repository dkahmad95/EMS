"use client";

import { useState } from "react";
import { Button } from "@/app/Components/Button";
import { Input } from "@/app/Components/Input";
import DeleteModal from "@/app/Components/DeleteModal";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useCurrencies } from "@/server/store/currencies";
import * as api from "../../../../../server/services/api/currencies/currencies";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import TabsSkeleton from "./SkeletonTabs";
import Loader from "@/app/Components/Loader";

export default function CurrenciesTab() {
  const queryClient = useQueryClient();
  const { data, isLoading: currenciesLoading } = useCurrencies();
  const [deleteId, setDeleteID] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ code?: string }>({}); // <-- error state

  // Form state
  const [formState, setFormState] = useState<Currency>({
    name: "",
    code: "",
    id: undefined,
  });
  const [openDeleteDS, setOpenDeleteDS] = useState(false);

  // Create mutation
  const { mutateAsync: createCurrency } = useMutation({
    mutationFn: (data: Currency) => api.createCurrency(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currencies"] });
      handleResetForm();
      message.success("تم إضافة العملة بنجاح");
    },
    onError: () => {
      message.error("حدث خطأ أثناء إنشاء العملة.");
    },
  });

  // Update mutation
  const { mutateAsync: updateCurrency } = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Currency }) =>
      api.updateCurrency(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currencies"] });
      handleResetForm();
      message.success("تم تحديث العملة بنجاح");
    },
    onError: () => {
      message.error("حدث خطأ أثناء تحديث العملة.");
    },
  });

  // Delete mutation
  const { mutateAsync: deleteCurrency } = useMutation({
    mutationFn: (id: number) => api.deleteCurrency(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currencies"] });
      setDeleteID(undefined);
      setOpenDeleteDS(false);
      message.success("تم حذف العملة بنجاح");
    },
    onError: () => {
      message.error("حدث خطأ أثناء حذف العملة.");
    },
  });

  const handleSaveCurrency = async () => {
    // Clear previous errors
    setErrors({});

    // Frontend validation
    if (!formState.name.trim()) {
      message.error("يرجى إدخال اسم العملة");
      return;
    }
    if (!formState.code.trim()) {
      setErrors({ code: "يرجى إدخال كود العملة" });
      return;
    }
    if (formState.code.trim().length > 3) {
      setErrors({ code: "يجب أن يكون كود العملة أقل من 4 أحرف" });
      return;
    }

    setLoading(true);
    const currencyData: Currency = {
      name: formState.name.trim(),
      code: formState.code.trim(),
    };

    try {
      if (formState.id !== undefined && formState.id !== null) {
        await updateCurrency({ id: formState.id, data: currencyData });
      } else {
        await createCurrency(currencyData);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const setFormData = (currency: Currency) => {
    setFormState({
      name: currency.name,
      code: currency.code,
      id: currency.id,
    });
    setErrors({}); // clear errors when editing
  };

  const handleResetForm = () => {
    setFormState({
      name: "",
      code: "",
      id: undefined,
    });
    setErrors({});
  };

  const isEditing = formState.id !== null && formState.id !== undefined;
  const isFormValid =
    formState.name.trim().length > 0 &&
    formState.code.trim().length > 0 &&
    formState.code.trim().length < 4;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-gray-700">العملات</h2>

      <div className="flex flex-col md:flex-row gap-2 mb-4 bg-white p-4 rounded shadow">
        <Input
          placeholder="أدخل اسم العملة (مثل دولار)"
          value={formState.name}
          onChange={(e) =>
            setFormState((prev) => ({ ...prev, name: e.target.value }))
          }
        />
        <Input
          placeholder="أدخل كود العملة (مثل USD)"
          value={formState.code}
          onChange={(e) =>
            setFormState((prev) => ({ ...prev, code: e.target.value }))
          }
        />
      </div>
      {errors.code && (
        <p className="text-red-500 text-xs mb-2">{errors.code}</p>
      )}
      <Button
        onClick={handleSaveCurrency}
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

      {currenciesLoading ? (
        <TabsSkeleton count={2} />
      ) : (
        <ul className="space-y-2 mt-4">
          {data?.map((currency) => (
            <li
              key={currency.id}
              className="p-3 bg-white shadow rounded text-gray-700 flex justify-between items-center"
            >
              <span className="font-medium">{currency.name}</span>
              <span className="font-medium">{currency.code}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setFormData(currency)}
                  className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                  title="تعديل"
                >
                  <PencilIcon className="w-5 h-5 text-gray-700" />
                </button>

                <button
                  onClick={() => {
                    setDeleteID(currency.id);
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
          Title="حذف العملة"
          Body="هل أنت متأكد أنك تريد حذف هذه العملة؟"
          handleClick={() => deleteCurrency(deleteId)}
        />
      )}
    </div>
  );
}
