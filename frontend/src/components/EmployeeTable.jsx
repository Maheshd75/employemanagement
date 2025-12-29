import axios from 'axios';
import { ChevronLeft, ChevronRight, Download, Pencil, Plus, Search, Trash2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'

import { toast } from 'react-hot-toast';

const URL = import.meta.env.VITE_BASE_URL || "http://localhost:5000";
const API = `${URL}/api/employees`;

const EmployeeTable = () => {
     const [employees, setEmployees] = useState([]);
    const [searchInput, setSearchInput] = useState("");
     const [totalPages, setTotalPages] = useState(1);
     const [page, setPage] = useState(1);
     const [search, setSearch] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
   
   const [totalEmployees, setTotalEmployees] = useState(0);

   const startIndex = (page - 1) * 5;
  const endIndex = startIndex + 5;

    const fetchEmployees = async (currentPage=1,search = search) => {
    try {
      
      let url = `${API}/all?page=${currentPage}`;
      if (search.trim()) {
        url += `&search=${encodeURIComponent(search)}`;
      }
      const res = await axios.get(url);
      setEmployees(res.data.employees);
      setTotalPages(res.data.totalPages);
      setPage(res.data.page);
        setTotalEmployees(res.data.total);
    } catch (e) {
      toast.error(e.message);
    }
  };
    const downloadExcel = () => {
        window.open(`${API}/export/excel`);
    }
    const downloadPDF = () => {
        window.open(`${API}/export/pdf`);
    }
    

  

  const deleteEmployee = async (id) => {
    if (!confirm("Delete this employee?")) return;
    try {
       const {data} =await axios.post(`${API}/delete/${id}`);
       if(data.success){
         toast.success(data.message);
        }
      fetchEmployees(page,search);
    } catch(error) {
        toast.error(error.message);
    }
  };
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, page - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };
  const toggleStatus = async (id) => {
  try {
    const {data} = await axios.post(`${API}/${id}/status`);
    if(data.success){
      toast.success("Status updated successfully");
    }
    fetchEmployees(page, search); // refresh list
  } catch (error) {
    console.error("Failed to toggle status", error);
  }
};


    useEffect(() => {
        fetchEmployees(page,search);
        
      }, [page,search]);
  return (
    <div className="p-8">
      <div className="bg-white rounded-lg shadow-md">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl">Employee Management</h2>
           
          </div>

          {/* Search and Download */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex gap-2 flex-1 max-w-md">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search employees..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            
              </div>
              <button onClick={() => { setSearch(searchInput);
                 fetchEmployees(1, searchInput); // apply search
                 }}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                
                Search
              </button>
            </div>

            <div className="flex gap-2">
              <button
                onClick={downloadExcel}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download className="w-5 h-5" />
                Excel
              </button>
              <button
                onClick={downloadPDF}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <Download className="w-5 h-5" />
                PDF
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-500">ID</th>
                <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-500">Name</th>
                <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-500">Email</th>
                <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-500">Phone</th>
                <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-500">Department</th>
                <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-500">Status</th>
                <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {employees.length > 0 ? (
                employees.map((employee) => (
                  <tr key={employee.employeeId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">{employee.employeeId}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{employee.name}</td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">{employee.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{employee.phone}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{employee.department}</td>
                    <td className={`inline-block mt-2 px-6 py-1 rounded-full text-sm ${employee.status === 'Active' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>{employee.status}</td>
                    
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <button
    onClick={() => toggleStatus(employee._id)}
    className={`relative inline-flex h-7 w-14 items-center rounded-full
      transition-colors duration-300
      ${employee.status === "Active" ? "bg-green-500" : "bg-gray-300"}`}
  >
    <span
      className={`inline-block h-5 w-5 rounded-full bg-white shadow-md
        transform transition-transform duration-300
        ${employee.status === "Active" ? "translate-x-8" : "translate-x-1"}`}
    />
  </button>
                        <button
                          onClick={() => deleteEmployee(employee._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                    No employees found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {startIndex + 1} to {Math.min(endIndex, totalEmployees)} of{' '}
                {totalEmployees} employees
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(prev => Math.max(1, prev - 1))}
                  disabled={page === 1}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {getPageNumbers().map(pageNum => (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      page === pageNum
                        ? 'bg-blue-600 text-white'
                        : 'border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}

                <button
                  onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={page === totalPages}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Employee Modal */}
     
    </div>
  )
}

export default EmployeeTable
