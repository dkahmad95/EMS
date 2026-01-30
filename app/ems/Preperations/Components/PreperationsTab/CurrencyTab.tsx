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



export default function CurrenciesTab() {
  const queryClient = useQueryClient();
  const { data } = useCurrencies();
  const [deleteId, setDeleteID] = useState<number | undefined>(undefined);
  // Form state management
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
    },
    onError: (error) => {
      message.error("حدث خطأ أثناء إنشاء العملة.");
    }
  });
  // Update mutation - ID is passed as parameter
  const { mutateAsync: updateCurrency } = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Currency }) =>
      api.updateCurrency(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currencies"] });
      handleResetForm();
    },
    onError: (error) => {
      message.error("حدث خطأ أثناء تحديث العملة.");
    }
  });
  // Delete mutation
  const { mutateAsync: deleteCurrency } = useMutation({
    mutationFn: (id: number) => api.deleteCurrency(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currencies"] });
      setDeleteID(undefined);
      setOpenDeleteDS(false);
    },
    onError: (error) => {
      message.error("حدث خطأ أثناء حذف العملة.");
    }
  });

  const handleSaveCurrency = async () => {
    if (!formState.name.trim()) return;
    if (!formState.code.trim() || formState.code.trim().length >= 4) return;
    const currencyData: Currency = {
      name: formState.name.trim(),
      code: formState.code.trim(),
    };
    if (formState.id !== undefined && formState.id !== null) {
      // Update existing currency
      await updateCurrency({
        id: formState.id,
        data: currencyData,
      });
    } else {
      // Create new currency
      await createCurrency(currencyData);
    }


  };

  const setFormData = (currency: Currency) => {
    setFormState({
      name: currency.name,
      code: currency.code,
      id: currency.id,
    });
  };

  const handleResetForm = () => {
    // Reset form state
    setFormState({
      name: "",
      code: "",
      id: undefined,
    });
  };

  const isEditing = formState.id !== null && formState.id !== undefined;
  const isFormValid = formState.name.trim().length > 0 && formState.code.trim().length > 0 && formState.code.trim().length < 4;

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
        <Button
          onClick={handleSaveCurrency}
          disabled={!isFormValid}
          className={`flex items-center gap-2 text-white ${isFormValid
            ? isEditing
              ? "bg-blue-700 hover:bg-blue-600"
              : "bg-green-700 hover:bg-green-600"
            : "bg-gray-400 cursor-not-allowed"
            }`}>
          {isEditing ? "تحديث" : "إضافة"}
        </Button>
      </div>

      <ul className="space-y-2">
        {data?.map((currency) => (
          <li
            key={currency.id}
            className="p-3 bg-white shadow rounded text-gray-700 flex justify-between items-center">
            <span className="font-medium">{currency.name}</span>
            <span className="font-medium">{currency.code}</span>
            <div className="flex gap-2">
              <button
                onClick={() => setFormData(currency)}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                title="تعديل">
                <PencilIcon className="w-5 h-5 text-gray-700" />
              </button>

              <button
                onClick={() => {
                  setDeleteID(currency.id);
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
          Title="حذف العملة"
          Body="هل أنت متأكد أنك تريد حذف هذه العملة؟"
          handleClick={() => deleteCurrency(deleteId)}
        />
      )}
    </div>
  );
}
