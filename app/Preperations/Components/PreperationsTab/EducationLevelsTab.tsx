"use client";

import { useState } from "react";
import { Button } from "@/app/Components/Button";
import { Input } from "@/app/Components/Input";
import DeleteModal from "@/app/Components/DeleteModal";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

export default function EducationLevelsTab() {
  const [educationName, setEducationName] = useState("");
  const [educationLevels, setEducationLevels] = useState<string[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  const handleAddOrUpdate = () => {
    if (educationName.trim() === "") return;

    if (editingIndex !== null) {
      const updated = [...educationLevels];
      updated[editingIndex] = educationName.trim();
      setEducationLevels(updated);
      setEditingIndex(null);
    } else {
      setEducationLevels([...educationLevels, educationName.trim()]);
    }

    setEducationName("");
  };

  const handleEdit = (index: number) => {
    setEducationName(educationLevels[index]);
    setEditingIndex(index);
  };

  const handleDelete = () => {
    if (deleteIndex !== null) {
      setEducationLevels(educationLevels.filter((_, i) => i !== deleteIndex));
      setDeleteIndex(null);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-gray-700">المستويات التعليمية</h2>

      {/* Input Section */}
      <div className="flex flex-col md:flex-row gap-2 mb-4 bg-white p-4 rounded shadow">
        <Input
          placeholder="أدخل اسم المستوى التعليمي"
          value={educationName}
          onChange={(e) => setEducationName(e.target.value)}
        />
        <Button
          onClick={handleAddOrUpdate}
          disabled={!educationName.trim()}
          className={`flex items-center gap-2 text-white ${
            educationName.trim()
              ? "bg-green-700 hover:bg-green-600"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
       
          {editingIndex !== null ? "تحديث" : "إضافة"}
        </Button>
      </div>

      {/* List of Education Levels */}
      <ul className="space-y-2">
        {educationLevels.map((level, index) => (
          <li
            key={index}
            className="p-3 bg-white shadow rounded text-gray-700 flex justify-between items-center"
          >
            <span className="font-medium">{level}</span>

            <div className="flex gap-2">
              {/* Edit Button */}
              <button
                onClick={() => handleEdit(index)}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                title="تعديل"
              >
                <PencilIcon className="w-5 h-5 text-gray-700" />
              </button>

              {/* Delete Button */}
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

      {/* Delete Confirmation Modal */}
      <DeleteModal
        open={openDelete}
        setOpen={setOpenDelete}
        Title="حذف المستوى التعليمي"
        Body="هل أنت متأكد أنك تريد حذف هذا المستوى؟"
        handleClick={handleDelete}
      />
    </div>
  );
}
