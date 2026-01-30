"use client";

import { useState } from "react";
import { Button } from "@/app/Components/Button";
import { Input } from "@/app/Components/Input";
import DeleteModal from "@/app/Components/DeleteModal";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useEducationLevels } from "@/server/store/educationLevels";
import * as api from "../../../../../server/services/api/educationLevels/educationLevels";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";

export default function EducationLevelsTab() {
  const queryClient = useQueryClient();
  const { data } = useEducationLevels();
  const [deleteId, setDeleteID] = useState<number | undefined>(undefined);
  
  // Form state management
  const [formState, setFormState] = useState<EducationLevel>({
    name: "",
    id: undefined,
  });
  const [openDeleteDS, setOpenDeleteDS] = useState(false);

  // Create mutation
  const { mutateAsync: createEducationLevel } = useMutation({
    mutationFn: (data: EducationLevel) => api.createEducationLevel(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["educationLevels"] });
      handleResetForm();
    },
    onError: (error) => {
      message.error("حدث خطأ أثناء إنشاء المستوى التعليمي.");
    }
  });

  // Update mutation
  const { mutateAsync: updateEducationLevel } = useMutation({
    mutationFn: ({ id, data }: { id: number; data: EducationLevel }) =>
      api.updateEducationLevel(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["educationLevels"] });
      handleResetForm();
    },
    onError: (error) => {
      message.error("حدث خطأ أثناء تحديث المستوى التعليمي.");
    }
  });

  // Delete mutation
  const { mutateAsync: deleteEducationLevel } = useMutation({
    mutationFn: (id: number) => api.deleteEducationLevel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["educationLevels"] });
      setDeleteID(undefined);
      setOpenDeleteDS(false);
    },
    onError: (error) => {
      message.error("حدث خطأ أثناء حذف المستوى التعليمي.");
    }
  });

  const handleSaveEducationLevel = async () => {
    if (!formState.name.trim()) return;

    const educationLevelData: EducationLevel = {
      name: formState.name.trim(),
    };

    if (formState.id !== undefined && formState.id !== null) {
      // Update existing education level
      await updateEducationLevel({
        id: formState.id,
        data: educationLevelData,
      });
    } else {
      // Create new education level
      await createEducationLevel(educationLevelData);
    }
  };

  const setFormData = (educationLevel: EducationLevel) => {
    setFormState({
      name: educationLevel.name,
      id: educationLevel.id,
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
      <h2 className="text-xl font-semibold mb-4 text-gray-700">المستويات التعليمية</h2>

      <div className="flex flex-col md:flex-row gap-2 mb-4 bg-white p-4 rounded shadow">
        <Input
          placeholder="أدخل اسم المستوى التعليمي"
          value={formState.name}
          onChange={(e) =>
            setFormState((prev) => ({ ...prev, name: e.target.value }))
          }
        />
        <Button
          onClick={handleSaveEducationLevel}
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
        {data?.map((level) => (
          <li
            key={level.id}
            className="p-3 bg-white shadow rounded text-gray-700 flex justify-between items-center">
            <span className="font-medium">{level.name}</span>
            <div className="flex gap-2">
              <button
                onClick={() => setFormData(level)}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                title="تعديل">
                <PencilIcon className="w-5 h-5 text-gray-700" />
              </button>

              <button
                onClick={() => {
                  setDeleteID(level.id);
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
          Title="حذف المستوى التعليمي"
          Body="هل أنت متأكد أنك تريد حذف هذا المستوى؟"
          handleClick={() => deleteEducationLevel(deleteId)}
        />
      )}
    </div>
  );
}
