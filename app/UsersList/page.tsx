"use client";

import { useEffect, useState } from "react";
import { BuildingOfficeIcon } from "@heroicons/react/24/outline";
import { CreateButton } from "../Components/CreateButton";

import SearchBar from "../Components/SearchBar";
import UsersTable from "./Components/UsersTable";
import { MenuItem, Select } from "@mui/material";

const UsersList = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [cityFilter, setCityFilter] = useState("all");
    const [users, setUsers] = useState<any[]>([]);
    const [cityOptions, setCityOptions] = useState<{ value: string; label: string }[]>([]);

    // Load users and extract unique cities from users
    useEffect(() => {
        const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");
        setUsers(storedUsers);

        // Extract unique cities from users
        const cities = Array.from(new Set(storedUsers.map((u: any) => u.city))) as string[];
        const options = [{ value: "all", label: "جميع المدن" }, ...cities.map((c) => ({ value: c, label: c }))];
        setCityOptions(options);
    }, []);

    // Filter users by city and global search
    const filteredUsers = users.filter((user) => {
        const matchCity = cityFilter === "all" || user.city === cityFilter;

        // Combine all string fields for global search
        const userString = Object.values(user)
            .filter((v) => typeof v === "string")
            .join(" ")
            .toLowerCase();

        const matchSearch = userString.includes(searchTerm.toLowerCase());

        return matchCity && matchSearch;
    });

    return (
        <main className="w-full">
            <div className="flex flex-col w-full items-center justify-between gap-y-2 md:flex-row">
                <h1 className="text-2xl">قائمة المستخدمين</h1>
            </div>

            <div className="flex-col md:flex-row my-4 flex items-start md:items-center justify-between gap-2 md:mt-8">
                {/* City Filter */}
                <Select
                    id="cityFilter"
                    value={cityFilter}
                    onChange={(e) => setCityFilter(e.target.value as string)}
                >
                    {cityOptions.map((location) => (
                        <MenuItem key={location.value} value={location.value}>
                            {location.label}
                        </MenuItem>
                    ))}
                </Select>



                {/* Search Bar */}
             <div className="flex md:justify-center">
                    <SearchBar
                        value={searchTerm}
                        onChange={(val: string) => setSearchTerm(val)}
                    />
                </div>

                <CreateButton label="ادراج مستخدم" path="/UsersList/NewUser" />
            </div>

            <UsersTable users={filteredUsers} />
        </main>
    );
};

export default UsersList;
