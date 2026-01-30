export function DataTableSkeleton() {
    return (
        <div className="flex flex-col">
            <div className="overflow-x-auto">
                <div className="align-middle inline-block min-w-full">
                    <div className="overflow-hidden border-b border-gray-200 sm:rounded-lg">
                        <table className="min-w-full">
                            <thead className="bg-gray-50">
                            <tr>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 "
                                >

                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 "
                                >

                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 "
                                >

                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 "
                                >

                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 "
                                >

                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 "
                                >

                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 "
                                >

                                </th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {[...Array(5)].map((_, index) => (
                                <tr key={index} className="animate-pulse">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="w-16 h-4 bg-gray-300 rounded"></div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="w-16 h-4 bg-gray-300 rounded"></div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="w-16 h-4 bg-gray-300 rounded"></div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="w-16 h-4 bg-gray-300 rounded"></div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="w-16 h-4 bg-gray-300 rounded"></div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="w-16 h-4 bg-gray-300 rounded"></div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="w-16 h-4 bg-gray-300 rounded"></div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}