"use client";
import React from "react";
import { Input } from "./Input";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Button } from "./Button";

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  onSearch?: () => void; // optional callback when pressing search button
}

const SearchBar = ({ value, onChange, onSearch }: SearchBarProps) => {
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) onSearch();
  };

  return (
    <form onSubmit={handleSearch} className="flex gap-2 w-full">
      {/* Input field */}
      <div className="relative w-full">
        <Input
          id="search"
          type="text"
          placeholder="ابحث هنا..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-md border border-gray-300 py-2 pr-10 text-sm placeholder:text-gray-400"
        />
        <MagnifyingGlassIcon className="pointer-events-none absolute right-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
      </div>

      {/* Search button */}
      <Button type="submit">بحث</Button>
    </form>
  );
};

export default SearchBar;
