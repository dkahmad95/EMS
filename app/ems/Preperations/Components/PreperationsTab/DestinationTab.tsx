"use client";

import { useState } from "react";
import { Button } from "@/app/Components/Button";
import { Input } from "@/app/Components/Input";
import DeleteModal from "@/app/Components/DeleteModal";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useDestinations } from "@/server/store/destinations";
import * as api from "../../../../../server/services/api/destinations/destinations";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";

export default function DestinationsTab() {
  const queryClient = useQueryClient();
  const { data } = useDestinations();
  const [deleteId, setDeleteID] = useState<number | undefined>(undefined);
  
  // Form state management
  const [formState, setFormState] = useState<Destination>({
    name: "",
    id: undefined,
  });
  const [openDeleteDS, setOpenDeleteDS] = useState(false);

  // Create mutation
  const { mutateAsync: createDestination } = useMutation({
    mutationFn: (data: Destination) => api.createDestination(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["destinations"] });
      handleResetForm();
    },
    onError: (error) => {
      message.error("حدث خطأ أثناء إنشاء الوجهة.");
    }
  });

  // Update mutation
  const { mutateAsync: updateDestination } = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Destination }) =>
      api.updateDestination(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["destinations"] });
      handleResetForm();
    },
    onError: (error) => {
      message.error("حدث خطأ أثناء تحديث الوجهة.");
    }
  });

  // Delete mutation
  const { mutateAsync: deleteDestination } = useMutation({
    mutationFn: (id: number) => api.deleteDestination(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["destinations"] });
      setDeleteID(undefined);
      setOpenDeleteDS(false);
    },
    onError: (error) => {
      message.error("حدث خطأ أثناء حذف الوجهة.");
    }
  });

  const handleSaveDestination = async () => {
    if (!formState.name.trim()) return;

    const destinationData: Destination = {
      name: formState.name.trim(),
    };

    if (formState.id !== undefined && formState.id !== null) {
      // Update existing destination
      await updateDestination({
        id: formState.id,
        data: destinationData,
      });
    } else {
      // Create new destination
      await createDestination(destinationData);
    }
  };

  const setFormData = (destination: Destination) => {
    setFormState({
      name: destination.name,
      id: destination.id,
    });
  };

  const handleResetForm = () => {
    setFormState({
      name: "",
      id: undefined,
    });
  };

  const isEditing = formState.id !== null && formState.id !== undefined;
  const isFormValid = formState.name.trim().length > 0;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-gray-700">الوجهات</h2>

      <div className="flex flex-col md:flex-row gap-2 mb-4 bg-white p-4 rounded shadow">
        <Input
          placeholder="أدخل اسم الوجهة"
          value={formState.name}
          onChange={(e) =>
            setFormState((prev) => ({ ...prev, name: e.target.value }))
          }
        />
        <Button
          onClick={handleSaveDestination}
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
        {data?.map((destination) => (
          <li
            key={destination.id}
            className="p-3 bg-white shadow rounded text-gray-700 flex justify-between items-center">
            <span className="font-medium">{destination.name}</span>
            <div className="flex gap-2">
              <button
                onClick={() => setFormData(destination)}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                title="تعديل">
                <PencilIcon className="w-5 h-5 text-gray-700" />
              </button>

              <button
                onClick={() => {
                  setDeleteID(destination.id);
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
          Title="حذف الوجهة"
          Body="هل أنت متأكد أنك تريد حذف هذه الوجهة؟"
          handleClick={() => deleteDestination(deleteId)}
        />
      )}
    </div>
  );
}
