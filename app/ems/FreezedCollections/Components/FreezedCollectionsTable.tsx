"use client";

import React, { useState } from "react";
import DataTable from "@/app/Components/DataTable";
import { SkeletonTable } from "@/app/Components/Skeleton";
import { EmptyState } from "@/app/Components/EmptyState";
import { ErrorState } from "@/app/Components/ErrorState";
import FreezedCollectionFormDialog from "./FreezedCollectionFormDialog";
import DeleteFreezedCollectionModal from "./DeleteFreezedCollectionModal";
import CollectionsToolbar, {
  CollectionsCreateButton,
} from "@/app/ems/Collections/Components/shared/CollectionsToolbar";
import {
  buildCollectionColumns,
  COLLECTION_COLUMN_COUNT,
} from "@/app/ems/Collections/Components/shared/collectionColumns";
import { useFreezedCollections } from "@/server/store/freezedCollections";
import { usePermissions } from "@/app/hooks/usePermissions";
import { useServerTable } from "@/app/hooks/useServerTable";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "@/server/services/api/freezedCollections/freezedCollections";
import { message } from "antd";

const RESOURCE = "freezed_collections" as const;

const FreezedCollectionsTable = () => {
  const queryClient = useQueryClient();
  const { currentOfficeId } = usePermissions();

  const table = useServerTable({ resetDeps: [currentOfficeId] });
  const { data, isLoading, isFetching, isError, refetch } = useFreezedCollections({
    ...table.params,
    office_id: currentOfficeId,
  });

  const [selectedCollection, setSelectedCollection] = useState<FreezedCollection | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
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

  const columns = buildCollectionColumns<FreezedCollection>({
    resource: RESOURCE,
    onEdit: openEditModal,
    onDelete: openDeleteModal,
  });

  const rows = data?.data ?? [];

  let body: React.ReactNode;
  if (isLoading) {
    body = <SkeletonTable fullHeight cols={COLLECTION_COLUMN_COUNT} />;
  } else if (isError) {
    body = (
      <div className="card flex-1 min-h-0 flex items-center justify-center">
        <ErrorState title="حدث خطأ أثناء تحميل البيانات" onRetry={() => refetch()} />
      </div>
    );
  } else if (rows.length === 0) {
    body = (
      <div className="card flex-1 min-h-0 flex items-center justify-center">
        <EmptyState
          title="لا توجد سجلات"
          action={<CollectionsCreateButton resource={RESOURCE} onCreate={openCreateModal} />}
        />
      </div>
    );
  } else {
    body = (
      <DataTable
        fullHeight
        columns={columns}
        rows={rows}
        loading={isFetching}
        rowCount={data?.total}
        paginationModel={table.paginationModel}
        onPaginationModelChange={table.setPaginationModel}
      />
    );
  }

  return (
    <div className="flex-1 min-h-0 flex flex-col gap-4">
      <CollectionsToolbar
        resource={RESOURCE}
        searchTerm={table.searchTerm}
        onSearchChange={table.setSearchTerm}
        onCreate={openCreateModal}
      />

      {body}

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
