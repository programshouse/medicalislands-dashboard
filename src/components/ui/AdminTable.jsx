import React, { useEffect, useState } from "react";
import Pagination from "./Pagination";
import { ViewButton, EditButton, DeleteButton } from "./IconButton";

const AdminTable = ({ 
  title, 
  data = [], 
  columns = [], 
  onEdit, 
  onDelete, 
  onShow,
  onAdd,
  addText = "Add New",
  className = "" 
}) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const total = data?.length || 0;
  const lastPage = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, lastPage);
  useEffect(() => { if (page > lastPage) setPage(lastPage); }, [page, lastPage]);
  const offset = (currentPage - 1) * pageSize;
  return (
    <div className={`bg-white  rounded-lg shadow-sm border border-gray-200  ${className}`}>
      <div className="p-6 border-b border-gray-200 ">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900 ">
            {title}
          </h2>
          <button
            onClick={onAdd}
            className="bg-brand-500 hover:bg-brand-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            {addText}
          </button>
        </div>
      </div>
      
      <Pagination position="top" page={currentPage} pageSize={pageSize} total={total} onPageChange={setPage} onPageSizeChange={(size) => { setPageSize(size); setPage(1); }} />
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 ">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500  uppercase tracking-wider"
                >
                  {column.header}
                </th>
              ))}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500  uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white  divide-y divide-gray-200 ">
            {data && data.length > 0 ? (
              data.slice(offset, offset + pageSize).map((item, pageIndex) => {
                const index = offset + pageIndex;
                return (
                <tr key={index} className="hover:bg-gray-50 ">
                  {columns.map((column, colIndex) => (
                    <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 ">
                      {column.render ? column.render(item) : item[column.key]}
                    </td>
                  ))}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      {onShow && (
                        <ViewButton
                          onClick={() => onShow(item, index)}
                        />
                      )}
                      <EditButton
                        onClick={() => onEdit(item, index)}
                      />
                      <DeleteButton
                        onClick={() => onDelete(index)}
                      />
                    </div>
                  </td>
                </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={columns.length + 1} className="px-6 py-4 text-center text-gray-500 ">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Pagination position="bottom" page={currentPage} pageSize={pageSize} total={total} onPageChange={setPage} onPageSizeChange={(size) => { setPageSize(size); setPage(1); }} />
    </div>
  );
};

export default AdminTable;
