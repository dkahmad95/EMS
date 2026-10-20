"use client";

import { useState } from "react";
import SearchBar from "../../Components/SearchBar";
import UsersTable from "./Components/UsersTable";
import PermissionGate from "@/app/Components/PermissionGate";
import CreateUserModal from "./Components/CreateUserModal";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useUsers } from "@/server/store/users";
import { useServerTable } from "@/app/hooks/useServerTable";
import { Button } from "@/app/Components/Button";

const UsersList = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const table = useServerTable();
  const { data, isLoading, isFetching, isError, refetch } = useUsers(table.params);

  const createButton = (
    <PermissionGate resource="users" action="create">
      <Button variant="primary" onClick={() => setIsCreateModalOpen(true)}>
        <PlusIcon className="w-4 h-4" aria-hidden="true" />
        إضافة مستخدم
      </Button>
    </PermissionGate>
  );

  return (
    <div className="flex flex-col h-full min-h-0 gap-4">

      {/* Page header */}
      <div className="page-header !mb-0 flex-none">
        <h1 className="page-title">إدارة المستخدمين</h1>
        <p className="page-subtitle">إدارة حسابات المستخدمين والصلاحيات</p>
      </div>

      {/* Toolbar */}
      <div className="card p-4 flex-none">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
          {/* Search */}
          <div className="flex-1 w-full md:max-w-xs">
            <SearchBar
              value={table.searchTerm}
              onChange={table.setSearchTerm}
              placeholder="ابحث باسم المستخدم..."
            />
          </div>

          <div className="flex-1 hidden md:block" />

          {createButton}
        </div>
      </div>

      {/* Table */}
      <UsersTable
        users={data?.data ?? []}
        total={data?.total}
        search={table.search}
        isLoading={isLoading}
        isError={isError}
        onRetry={() => refetch()}
        loading={isFetching}
        paginationModel={table.paginationModel}
        onPaginationModelChange={table.setPaginationModel}
        emptyAction={createButton}
      />

      <CreateUserModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
};

export default UsersList;
