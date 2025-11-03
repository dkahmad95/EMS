"use client";
import React, { useState } from "react";
import { Input } from "./Input";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Button } from "./Button";


const SearchBar = () => {
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", query);
    // You can call your search logic or API here
  };

  return (
    <form onSubmit={handleSearch} className="flex   gap-2 w-full">
      {/* Input field */}
      <div className="relative ">
        <Input
          id="search"
          type="text"
          placeholder="ابحث هنا..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-md border border-gray-300 py-2 pr-10 text-sm placeholder:text-gray-400"
        />
        <MagnifyingGlassIcon className="pointer-events-none absolute right-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
      </div>

      {/* Search button */}
      <Button
        type="submit"
        
      >
        بحث
      </Button>
    </form>
  );
};

export default SearchBar;
