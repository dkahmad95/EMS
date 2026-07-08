"use client";

import React, { useState } from "react";
import { PencilIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/outline";
import { DataTableSkeleton } from "@/app/Components/DataTableSkeleton";
import DataTable from "@/app/Components/DataTable";
import CollectionFormDialog from "./CollectionFormDialog";
import DeleteCollectionModal from "./DeleteCollectionModal";
import { Button } from "@/app/Components/Button";
import PermissionGate from "@/app/Components/PermissionGate";
import { useCollections } from "@/server/store/collections";
import { usePermissions } from "@/app/hooks/usePermissions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "@/server/services/api/collections/collections";
import { message } from "antd";

const COLLECTION_TYPE_LABELS: Record<CollectionType, string> = {
  SPONSORSHIP: "كفالة",
  BOX: "حصالة",
};

const CollectionsTable = () => {
  const queryClient = useQueryClient();
  const { currentOfficeId } = usePermissions();
  const { data: collections, isLoading } = useCollections(currentOfficeId);

  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [isFormModalOpen,   setIsFormModalOpen]   = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const openCreateModal = () => {
    setSelectedCollection(null);
    setIsFormModalOpen(true);
  };

  const openEditModal = (col: Collection) => {
    setSelectedCollection(col);
    setIsFormModalOpen(true);
  };

  const closeFormModal = () => {
    setIsFormModalOpen(false);
    setSelectedCollection(null);
  };

  const openDeleteModal = (col: Collection) => {
    setSelectedCollection(col);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedCollection(null);
  };

  const { mutateAsync: deleteCollection } = useMutation({
    mutationFn: (id: number) => api.deleteCollection(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collections"] });
      closeDeleteModal();
      message.success("تم حذف التحصيل بنجاح");
    },
    onError: () => {
      message.error("حدث خطأ أثناء حذف التحصيل.");
    },
  });

  const handleDelete = async () => {
    if (!selectedCollection?.id) return;
    await deleteCollection(selectedCollection.id);
  };

  const columns = [
    { field: "id", headerName: "الرقم", width: 70 },
    {
      field: "employee",
      headerName: "اسم الموظف",
      width: 180,
      valueGetter: (params: any) => params?.name ?? "",
    },
    {
      field: "office",
      headerName: "المكتب",
      width: 150,
      valueGetter: (params: any) => params?.name ?? "",
    },
    {
      field: "collection_type",
      headerName: "نوع التحصيل",
      width: 140,
      valueGetter: (params: any) =>
        COLLECTION_TYPE_LABELS[params as CollectionType] ?? params ?? "",
    },
    {
      field: "date",
      headerName: "التاريخ",
      width: 120,
      valueGetter: (params: any) => params?.split("T")[0] ?? params ?? "",
    },
    {
      field: "count",
      headerName: "العدد",
      width: 90,
    },
    {
      field: "actions",
      headerName: "العمليات",
      width: 120,
      renderCell: (params: any) => (
        <div className="flex gap-2 items-center justify-center">
          <PermissionGate resource="collections" action="update">
            <PencilIcon
              className="w-5 text-blue-400 cursor-pointer mt-4"
              onClick={() => openEditModal(params.row)}
            />
          </PermissionGate>
          <PermissionGate resource="collections" action="delete">
            <TrashIcon
              className="w-5 text-red-600 cursor-pointer mt-4"
              onClick={() => openDeleteModal(params.row)}
            />
          </PermissionGate>
        </div>
      ),
    },
  ];

  return (
    <div dir="rtl" className="space-y-6">
      <div className="flex items-center justify-between">
        <PermissionGate resource="collections" action="create">
          <Button variant="primary" size="sm" onClick={openCreateModal}>
            <PlusIcon className="w-4 h-4" />
            إضافة تحصيل
          </Button>
        </PermissionGate>
      </div>

      {isLoading ? (
        <DataTableSkeleton />
      ) : (
        <DataTable columns={columns} rows={collections ?? []} />
      )}

      <CollectionFormDialog
        open={isFormModalOpen}
        onClose={closeFormModal}
        selectedCollection={selectedCollection}
      />

      <DeleteCollectionModal
        open={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default CollectionsTable;
