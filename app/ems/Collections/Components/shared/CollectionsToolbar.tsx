"use client";

import React from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import { Button } from "@/app/Components/Button";
import SearchBar from "@/app/Components/SearchBar";
import PermissionGate from "@/app/Components/PermissionGate";

type CollectionResource = "collections" | "freezed_collections";

interface CollectionsToolbarProps {
  resource: CollectionResource;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onCreate: () => void;
}

/** The page's create action, gated by permission; reused by the toolbar and the empty state. */
export const CollectionsCreateButton = ({
  resource,
  onCreate,
}: Pick<CollectionsToolbarProps, "resource" | "onCreate">) => (
  <PermissionGate resource={resource} action="create">
    <Button variant="primary" size="sm" onClick={onCreate}>
      <PlusIcon className="w-4 h-4" aria-hidden="true" />
      إضافة جديدة
    </Button>
  </PermissionGate>
);

/** Search + create row shared by Collections and FreezedCollections. */
const CollectionsToolbar: React.FC<CollectionsToolbarProps> = ({
  resource,
  searchTerm,
  onSearchChange,
  onCreate,
}) => (
  <div className="flex-none flex flex-col md:flex-row items-start md:items-center gap-3">
    <div className="flex-1 w-full md:max-w-xs">
      <SearchBar value={searchTerm} onChange={onSearchChange} placeholder="ابحث باسم الموظف..." />
    </div>

    <div className="flex-1 hidden md:block" />

    <CollectionsCreateButton resource={resource} onCreate={onCreate} />
  </div>
);

export default CollectionsToolbar;
