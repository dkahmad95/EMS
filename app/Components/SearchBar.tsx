"use client";
import React from "react";
import { Input } from "./Input";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  onSearch?: () => void;
  placeholder?: string;
}

const SearchBar = ({
  value,
  onChange,
  onSearch,
  placeholder = "ابحث هنا...",
}: SearchBarProps) => {
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) onSearch();
  };

  return (
    <form onSubmit={handleSearch} className="flex gap-2 w-full">
      <div className="relative flex-1">
        <Input
          id="search"
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pr-4 pl-10"
        />
        <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      </div>
    </form>
  );
};

export default SearchBar;
