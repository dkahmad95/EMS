"use client";

import { useState } from "react";
import SearchBar from "../../Components/SearchBar";
import UsersTable from "./Components/UsersTable";
import PermissionGate from "@/app/Components/PermissionGate";
import CreateUserModal from "./Components/CreateUserModal";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useUsers } from "@/server/store/users";

const UsersList = () => {
  const [searchTerm, setSearchTerm] = useState("");
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
      <main className="w-full">
        <div className="flex flex-col w-full items-center justify-between gap-y-2 md:flex-row">
          <h1 className="text-2xl">قائمة المستخدمين</h1>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="w-full">
        <div className="flex flex-col w-full items-center justify-between gap-y-2 md:flex-row">
          <h1 className="text-2xl">قائمة المستخدمين</h1>
        </div>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-4">
          حدث خطأ أثناء تحميل البيانات. يرجى المحاولة مرة أخرى.
        </div>
      </main>
    );
  }

  return (
    <main className="w-full">
      <div className="flex flex-col w-full items-center justify-between gap-y-2 md:flex-row">
        <h1 className="text-2xl">قائمة المستخدمين</h1>
      </div>

      <div className="flex-col md:flex-row my-4 flex items-start md:items-center justify-between gap-2 md:mt-8">

        {/* Search Bar */}
        <div className="flex md:justify-center flex-1">
          <SearchBar value={searchTerm} onChange={(val: string) => setSearchTerm(val)} />
        </div>

        <PermissionGate resource="users" action="create">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex h-10 items-center justify-center min-w-[180px] rounded-lg bg-gradient-to-r from-primary-600 to-primary-700 px-6 text-sm font-medium text-white transition-all duration-200 hover:from-primary-700 hover:to-primary-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 active:scale-95 shadow-soft hover:shadow-soft-md gap-2"
          >
            <span>ادراج مستخدم</span>
            <PlusIcon className="h-5 w-5" />
          </button>
        </PermissionGate>
      </div>

      <UsersTable users={filteredUsers} />

      <CreateUserModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </main>
  );
};

export default UsersList;
