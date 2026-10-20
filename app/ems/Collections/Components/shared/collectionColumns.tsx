"use client";

import React from "react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import PermissionGate from "@/app/Components/PermissionGate";

/** Shared by Collections and FreezedCollections (same shape, same labels). */
export const COLLECTION_TYPE_LABELS: Record<CollectionType, string> = {
  SPONSORSHIP: "كفالة",
  BOX: "حصالة",
};

export const COLLECTION_COLUMN_COUNT = 7;

type CollectionResource = "collections" | "freezed_collections";

type Options<T extends Collection> = {
  resource: CollectionResource;
  onEdit: (row: T) => void;
  onDelete: (row: T) => void;
};

/** Column factory for the two collection tables; only the permission resource differs. */
export const buildCollectionColumns = <T extends Collection>({
  resource,
  onEdit,
  onDelete,
}: Options<T>) => [
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
    sortable: false,
    renderCell: (params: { row: T }) => (
      <div className="flex h-full items-center justify-center gap-1.5">
        <PermissionGate resource={resource} action="update">
          <button
            type="button"
            className="table-action-edit"
            aria-label="تعديل"
            title="تعديل"
            onClick={() => onEdit(params.row)}
          >
            <PencilIcon className="w-4 h-4" aria-hidden="true" />
          </button>
        </PermissionGate>
        <PermissionGate resource={resource} action="delete">
          <button
            type="button"
            className="table-action-delete"
            aria-label="حذف"
            title="حذف"
            onClick={() => onDelete(params.row)}
          >
            <TrashIcon className="w-4 h-4" aria-hidden="true" />
          </button>
        </PermissionGate>
      </div>
    ),
  },
];
