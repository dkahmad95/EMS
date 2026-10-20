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
    <form onSubmit={handleSearch} role="search" className="flex gap-2 w-full">
      <div className="flex-1">
        <Input
          id="search"
          type="text"
          placeholder={placeholder}
          aria-label={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          startIcon={<MagnifyingGlassIcon />}
        />
      </div>
    </form>
  );
};

export default SearchBar;
