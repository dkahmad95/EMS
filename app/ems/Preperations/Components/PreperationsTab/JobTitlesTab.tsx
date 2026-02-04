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
import TabsSkeleton from "./SkeletonTabs";
import Loader from "@/app/Components/Loader";

export default function JobTitlesTab() {
  const queryClient = useQueryClient();
  const { data, isLoading: jobTitlesLoading } = useJobTitles();

  const [deleteId, setDeleteID] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formState, setFormState] = useState<JobTitle>({
    name: "",
    id: undefined,
  });
  const [openDeleteDS, setOpenDeleteDS] = useState(false);

  const { mutateAsync: createJobTitle } = useMutation({
    mutationFn: (data: JobTitle) => api.createJobTitle(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobTitles"] });
      handleResetForm();
      message.success("تم إنشاء الوظيفة بنجاح");
    },
    onError: () => {
      message.error("حدث خطأ أثناء إنشاء الوظيفة.");
    },
  });

  const { mutateAsync: updateJobTitle } = useMutation({
    mutationFn: ({ id, data }: { id: number; data: JobTitle }) =>
      api.updateJobTitle(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobTitles"] });
      handleResetForm();
      message.success("تم تحديث الوظيفة بنجاح");
    },
    onError: () => {
      message.error("حدث خطأ أثناء تحديث الوظيفة.");
    },
  });

  const { mutateAsync: deleteJobTitle } = useMutation({
    mutationFn: (id: number) => api.deleteJobTitle(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobTitles"] });
      setDeleteID(undefined);
      setOpenDeleteDS(false);
      message.success("تم حذف الوظيفة بنجاح");
    },
    onError: () => {
      message.error("حدث خطأ أثناء حذف الوظيفة.");
    },
  });

  const handleSaveJobTitle = async () => {
    setError(null);
    if (!formState.name.trim()) {
      setError("يرجى إدخال اسم الوظيفة");
      return;
    }

    setLoading(true);

    const jobTitleData: JobTitle = {
      name: formState.name.trim(),
    };

    try {
      if (formState.id !== undefined && formState.id !== null) {
        await updateJobTitle({ id: formState.id, data: jobTitleData });
      } else {
        await createJobTitle(jobTitleData);
      }
    } catch (err) {
      console.error(err);
      setError("حدث خطأ أثناء الحفظ، حاول مرة أخرى");
    } finally {
      setLoading(false);
    }
  };

  const setFormData = (job: JobTitle) => {
    setFormState({ name: job.name, id: job.id });
    setError(null);
  };

  const handleResetForm = () => {
    setFormState({ name: "", id: undefined });
    setError(null);
  };

  const isEditing = formState.id !== null && formState.id !== undefined;
  const isFormValid = formState.name.trim().length > 0;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-gray-700">المسميات الوظيفية</h2>

      <div className="flex flex-col md:flex-row gap-2 mb-2 bg-white p-4 rounded shadow">
        <div className="flex-1">
          <Input
            placeholder="أدخل اسم الوظيفة"
            value={formState.name}
            onChange={(e) => setFormState((prev) => ({ ...prev, name: e.target.value }))}
          />
          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>

        <Button
          onClick={handleSaveJobTitle}
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

      {jobTitlesLoading ? (
        <TabsSkeleton count={3} />
      ) : (
        <ul className="space-y-2 mt-4">
          {data?.map((title) => (
            <li
              key={title.id}
              className="p-3 bg-white shadow rounded text-gray-700 flex justify-between items-center"
            >
              <span className="font-medium">{title.name}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setFormData(title)}
                  className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                  title="تعديل"
                >
                  <PencilIcon className="w-5 h-5 text-gray-700" />
                </button>

                <button
                  onClick={() => {
                    setDeleteID(title.id);
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
          Title="حذف الوظيفة"
          Body="هل أنت متأكد أنك تريد حذف هذه الوظيفة؟"
          handleClick={() => deleteJobTitle(deleteId)}
        />
      )}
    </div>
  );
}
