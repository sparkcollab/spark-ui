import React from "react";

const Table = ({ columns, rows }) => {
  return (
    <table className="w-full">
      <thead className="bg-gray-50 dark:bg-gray-700">
        {columns.map((column) => (
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              {column.header}
            </th>{" "}
          </tr>
        ))}
      </thead>
      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
        {rows.map((row) => (
          <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
            {columns.map((column) => (
              <td className="px-6 py-4">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {row[column.accessor]}
                </div>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
