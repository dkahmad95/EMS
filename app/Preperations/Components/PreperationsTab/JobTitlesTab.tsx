"use client";

import { useState } from "react";
import { Button } from "@/app/Components/Button";
import { Input } from "@/app/Components/Input";
import DeleteModal from "@/app/Components/DeleteModal";
import { PencilIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/outline";

export default function JobTitlesTab() {
  const [jobTitle, setJobTitle] = useState("");
  const [jobTitles, setJobTitles] = useState<string[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  const handleAddOrUpdate = () => {
    if (!jobTitle.trim()) return;

    if (editingIndex !== null) {
      const updated = [...jobTitles];
      updated[editingIndex] = jobTitle.trim();
      setJobTitles(updated);
      setEditingIndex(null);
    } else {
      if (jobTitles.includes(jobTitle.trim())) return;
      setJobTitles([...jobTitles, jobTitle.trim()]);
    }

    setJobTitle("");
  };

  const handleEdit = (index: number) => {
    setJobTitle(jobTitles[index]);
    setEditingIndex(index);
  };

  const handleDelete = () => {
    if (deleteIndex !== null) {
      setJobTitles(jobTitles.filter((_, i) => i !== deleteIndex));
      setDeleteIndex(null);
      setOpenDelete(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-gray-700">المسميات الوظيفية</h2>

      {/* Input + Add Button */}
      <div className="flex gap-2 mb-4 bg-white p-4 rounded shadow">
        <Input
          placeholder="أدخل اسم الوظيفة"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
        />
        <Button
          onClick={handleAddOrUpdate}
          disabled={!jobTitle.trim()}
          className={`flex items-center gap-2 text-white ${
            jobTitle.trim()
              ? "bg-green-700 hover:bg-green-600"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
       
          {editingIndex !== null ? "تحديث" : "إضافة"}
        </Button>
      </div>

      {/* Job Titles List */}
      <ul className="space-y-2">
        {jobTitles.map((title, index) => (
          <li
            key={index}
            className="p-3 bg-white shadow rounded text-gray-700 flex justify-between items-center"
          >
            <span className="font-medium">{title}</span>

            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(index)}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                title="تعديل"
              >
                <PencilIcon className="w-5 h-5 text-gray-700" />
              </button>

              <button
                onClick={() => {
                  setDeleteIndex(index);
                  setOpenDelete(true);
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

      {/* Delete Modal */}
      <DeleteModal
        open={openDelete}
        setOpen={setOpenDelete}
        Title="حذف الوظيفة"
        Body="هل أنت متأكد أنك تريد حذف هذه الوظيفة؟"
        handleClick={handleDelete}
      />
    </div>
  );
}
