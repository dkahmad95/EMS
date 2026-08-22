"use client";

import React, { useState } from "react";
import { PencilIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/outline";
import { DataTableSkeleton } from "@/app/Components/DataTableSkeleton";
import DataTable from "@/app/Components/DataTable";
import FreezedCollectionFormDialog from "./FreezedCollectionFormDialog";
import DeleteFreezedCollectionModal from "./DeleteFreezedCollectionModal";
import { Button } from "@/app/Components/Button";
import SearchBar from "@/app/Components/SearchBar";
import PermissionGate from "@/app/Components/PermissionGate";
import { useFreezedCollections } from "@/server/store/freezedCollections";
import { usePermissions } from "@/app/hooks/usePermissions";
import { useServerTable } from "@/app/hooks/useServerTable";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "@/server/services/api/freezedCollections/freezedCollections";
import { message } from "antd";

const COLLECTION_TYPE_LABELS: Record<CollectionType, string> = {
  SPONSORSHIP: "كفالة",
  BOX: "حصالة",
};

const FreezedCollectionsTable = () => {
  const queryClient = useQueryClient();
  const { currentOfficeId } = usePermissions();

  const table = useServerTable({ resetDeps: [currentOfficeId] });
  const { data, isLoading, isFetching } = useFreezedCollections({
    ...table.params,
    office_id: currentOfficeId,
  });

  const [selectedCollection, setSelectedCollection] = useState<FreezedCollection | null>(null);
  const [isFormModalOpen,   setIsFormModalOpen]   = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const openCreateModal = () => {
    setSelectedCollection(null);
    setIsFormModalOpen(true);
  };

  const openEditModal = (col: FreezedCollection) => {
    setSelectedCollection(col);
    setIsFormModalOpen(true);
  };

  const closeFormModal = () => {
    setIsFormModalOpen(false);
    setSelectedCollection(null);
  };

  const openDeleteModal = (col: FreezedCollection) => {
    setSelectedCollection(col);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedCollection(null);
  };

  const { mutateAsync: deleteFreezedCollection } = useMutation({
    mutationFn: (id: number) => api.deleteFreezedCollection(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["freezedCollections"] });
      closeDeleteModal();
      message.success("تم حذف السجل بنجاح");
    },
    onError: () => {
      message.error("حدث خطأ أثناء حذف السجل.");
    },
  });

  const handleDelete = async () => {
    if (!selectedCollection?.id) return;
    await deleteFreezedCollection(selectedCollection.id);
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
          <PermissionGate resource="freezed_collections" action="update">
            <PencilIcon
              className="w-5 text-blue-400 cursor-pointer mt-4"
              onClick={() => openEditModal(params.row)}
            />
          </PermissionGate>
          <PermissionGate resource="freezed_collections" action="delete">
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
    <div dir="rtl" className="flex-1 min-h-0 flex flex-col gap-4">
      <div className="flex-none flex flex-col md:flex-row items-start md:items-center gap-3">
        <div className="flex-1 w-full md:max-w-xs">
          <SearchBar
            value={table.searchTerm}
            onChange={table.setSearchTerm}
            placeholder="ابحث باسم الموظف..."
          />
        </div>

        <div className="flex-1 hidden md:block" />

        <PermissionGate resource="freezed_collections" action="create">
          <Button variant="primary" size="sm" onClick={openCreateModal}>
            <PlusIcon className="w-4 h-4" />
            إضافة جديدة
          </Button>
        </PermissionGate>
      </div>

      {isLoading ? (
        <DataTableSkeleton fullHeight />
      ) : (
        <DataTable
          fullHeight
          columns={columns}
          rows={data?.data ?? []}
          loading={isFetching}
          rowCount={data?.total}
          paginationModel={table.paginationModel}
          onPaginationModelChange={table.setPaginationModel}
        />
      )}

      <FreezedCollectionFormDialog
        open={isFormModalOpen}
        onClose={closeFormModal}
        selectedCollection={selectedCollection}
      />

      <DeleteFreezedCollectionModal
        open={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default FreezedCollectionsTable;
