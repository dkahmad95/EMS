"use client";
import React from "react";
import { Input } from "./Input";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Button } from "./Button";

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  onSearch?: () => void;
  placeholder?: string;
}

const SearchBar = ({ value, onChange, onSearch, placeholder = "ابحث هنا..." }: SearchBarProps) => {
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) onSearch();
  };

  return (
    <form onSubmit={handleSearch} className="flex gap-3 w-full">
      {/* Input field with icon */}
      <div className="relative flex-1">
        <Input
          id="search"
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pr-10"
        />
        <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
      </div>

      {/* Search button */}
      <Button type="submit" variant="primary" className="shrink-0">
        <MagnifyingGlassIcon className="h-5 w-5 ml-2" />
        بحث
      </Button>
    </form>
  );
};

export default SearchBar;
