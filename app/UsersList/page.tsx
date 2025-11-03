import { BuildingOfficeIcon } from "@heroicons/react/24/outline";
import { CreateButton } from "../Components/CreateButton"
import { Select } from "../Components/Select"
import EmployeesTable from "./Components/UsersTable"
import SearchBar from "../Components/SearchBar";

const officeLocations = [
    { value: "beirut", label: "بيروت" },
    { value: "tripoli", label: "طرابلس" },
    { value: "saida", label: "صيدا" },
    { value: "tyre", label: "صور" },
    { value: "baalbek", label: "بعلبك" },
];
const UsersList = () => {
    return (
        <main className="w-full">
            <div className="flex flex-col w-full items-center justify-between gap-y-2 md:flex-row ">
                <h1 className={`$ text-2xl`}>قائمة المستخدمين</h1>
            </div>
            <div className=" flex-col md:flex-row  my-4 flex items-start md:items-center  justify-between gap-2 md:mt-8">
                <div className="relative">
                    <Select
                        id="officeLocation"
                        label=""

                        options={officeLocations}
                        className="peer block w-full rounded-md border border-gray-300 py-2 pr-10 text-sm text-gray-700 bg-white"
                    />
                    <BuildingOfficeIcon className="pointer-events-none absolute right-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
                </div>
                <div className="flex md:justify-center">
                <SearchBar/>
                  </div>
                <CreateButton label='ادراج مستخدم' path="/UsersList/NewUser" />
            </div>

            <EmployeesTable />
        </main>
    )
}

export default UsersList