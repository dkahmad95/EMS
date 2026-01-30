"use client";

import { useState } from "react";
import { Button } from "@/app/Components/Button";
import { Input } from "@/app/Components/Input";
import DeleteModal from "@/app/Components/DeleteModal";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useJobTitles } from "@/server/store/jobTitles";
import * as api from "../../../../../server/services/api/jobTitles/jobTitles";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";

export default function JobTitlesTab() {
  const queryClient = useQueryClient();
  const { data } = useJobTitles();
  const [deleteId, setDeleteID] = useState<number | undefined>(undefined);
  
  // Form state management
  const [formState, setFormState] = useState<JobTitle>({
    name: "",
    id: undefined,
  });
  const [openDeleteDS, setOpenDeleteDS] = useState(false);

  // Create mutation
  const { mutateAsync: createJobTitle } = useMutation({
    mutationFn: (data: JobTitle) => api.createJobTitle(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobTitles"] });
      handleResetForm();
    },
    onError: (error) => {
      message.error("حدث خطأ أثناء إنشاء الوظيفة.");
    }
  });

  // Update mutation
  const { mutateAsync: updateJobTitle } = useMutation({
    mutationFn: ({ id, data }: { id: number; data: JobTitle }) =>
      api.updateJobTitle(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobTitles"] });
      handleResetForm();
    },
    onError: (error) => {
      message.error("حدث خطأ أثناء تحديث الوظيفة.");
    }
  });

  // Delete mutation
  const { mutateAsync: deleteJobTitle } = useMutation({
    mutationFn: (id: number) => api.deleteJobTitle(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobTitles"] });
      setDeleteID(undefined);
      setOpenDeleteDS(false);
    },
    onError: (error) => {
      message.error("حدث خطأ أثناء حذف الوظيفة.");
    }
  });

  const handleSaveJobTitle = async () => {
    if (!formState.name.trim()) return;

    const jobTitleData: JobTitle = {
      name: formState.name.trim(),
    };

    if (formState.id !== undefined && formState.id !== null) {
      // Update existing job title
      await updateJobTitle({
        id: formState.id,
        data: jobTitleData,
      });
    } else {
      // Create new job title
      await createJobTitle(jobTitleData);
    }
  };

  const setFormData = (jobTitle: JobTitle) => {
    setFormState({
      name: jobTitle.name,
      id: jobTitle.id,
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
      <h2 className="text-xl font-semibold mb-4 text-gray-700">المسميات الوظيفية</h2>

      <div className="flex flex-col md:flex-row gap-2 mb-4 bg-white p-4 rounded shadow">
        <Input
          placeholder="أدخل اسم الوظيفة"
          value={formState.name}
          onChange={(e) =>
            setFormState((prev) => ({ ...prev, name: e.target.value }))
          }
        />
        <Button
          onClick={handleSaveJobTitle}
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
        {data?.map((title) => (
          <li
            key={title.id}
            className="p-3 bg-white shadow rounded text-gray-700 flex justify-between items-center">
            <span className="font-medium">{title.name}</span>
            <div className="flex gap-2">
              <button
                onClick={() => setFormData(title)}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                title="تعديل">
                <PencilIcon className="w-5 h-5 text-gray-700" />
              </button>

              <button
                onClick={() => {
                  setDeleteID(title.id);
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
          Title="حذف الوظيفة"
          Body="هل أنت متأكد أنك تريد حذف هذه الوظيفة؟"
          handleClick={() => deleteJobTitle(deleteId)}
        />
      )}
    </div>
  );
}
