"use client";

import { useState } from "react";
import SearchBar from "../../Components/SearchBar";
import UsersTable from "./Components/UsersTable";
import PermissionGate from "@/app/Components/PermissionGate";
import CreateUserModal from "./Components/CreateUserModal";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useUsers } from "@/server/store/users";
import { Button } from "@/app/Components/Button";

const UsersList = () => {
  const [searchTerm,        setSearchTerm]        = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { data: users, isLoading, error } = useUsers();

  const filteredUsers = (users || []).filter((user) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      user.username?.toLowerCase().includes(searchLower) ||
      user.id?.toString().includes(searchLower)
    );
  });

  if (isLoading) {
    return (
      <div className="space-y-5 animate-fade-in">
        <div className="page-header">
          <h1 className="page-title">إدارة المستخدمين</h1>
          <p className="page-subtitle">إدارة حسابات المستخدمين والصلاحيات</p>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-t-transparent border-primary-500" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-5 animate-fade-in">
        <div className="page-header">
          <h1 className="page-title">إدارة المستخدمين</h1>
        </div>
        <div className="card p-5 border-r-4 border-danger-400 flex items-start gap-3">
          <svg className="w-5 h-5 text-danger-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-sm text-danger-700">حدث خطأ أثناء تحميل البيانات. يرجى المحاولة مرة أخرى.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-fade-in">

      {/* Page header */}
      <div className="page-header">
        <h1 className="page-title">إدارة المستخدمين</h1>
        <p className="page-subtitle">إدارة حسابات المستخدمين والصلاحيات</p>
      </div>

      {/* Toolbar */}
      <div className="card p-4">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
          {/* Search */}
          <div className="flex-1 w-full md:max-w-xs">
            <SearchBar
              value={searchTerm}
              onChange={(val: string) => setSearchTerm(val)}
              placeholder="ابحث باسم المستخدم..."
            />
          </div>

          <div className="flex-1 hidden md:block" />

          <PermissionGate resource="users" action="create">
            <Button
              variant="primary"
              onClick={() => setIsCreateModalOpen(true)}
            >
              <PlusIcon className="w-4 h-4" />
              إضافة مستخدم
            </Button>
          </PermissionGate>
        </div>
      </div>

      {/* Table */}
      <UsersTable users={filteredUsers} />

      <CreateUserModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
};

export default UsersList;
