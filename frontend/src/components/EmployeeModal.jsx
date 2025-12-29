import axios from "axios";
import { useState } from "react";
import { toast } from "react-hot-toast";

const URL = import.meta.env.VITE_BASE_URL || "http://localhost:5000";
const API = `${URL}/api/employees`;
const EmployeeModal = () => {
     const [form, setForm] = useState({
        employeeId: "",
        name: "",
        email: "",
        phone: "",
        department: "",
        status: "Active",
      });

    

    const handleSubmit = async(e) => {
        e.preventDefault();
        try {
       
            const {data} = await axios.post(`${API}/create`, form);
      setForm({
        employeeId: "",
        name: "",
        email: "",
        phone: "",
        department: "",
        status: "Active",
      });
      
      if (data.success){
         toast.success("Employee added successfully!");
        }
        } catch (error) {
            toast.error(error.message);
        }
    }
  return (
       <div className=" p-8">
      <div className="bg-white rounded-lg shadow-xl w-full ">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-xl">Add New Employee</h3>
         
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 space-y-4">
            <div>
                <label htmlFor="employeeId" className="block text-sm mb-2 text-gray-700">
                    Employee ID
                </label>
                <input
                    type="text"
                    id="employeeId"
                    name="employeeId"
                    value={form.employeeId}
                    onChange={e => setForm({ ...form, employeeId: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div>
              <label htmlFor="name" className="block text-sm mb-2 text-gray-700">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm mb-2 text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
                <label htmlFor="phone" className="block text-sm mb-2 text-gray-700">
                    Phone
                </label>
                <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div>
              <label htmlFor="department" className="block text-sm mb-2 text-gray-700">
                Department
              </label>
              <input
                type="text"
                id="department"
                name="department"
                value={form.department}
                onChange={e => setForm({ ...form, department: e.target.value })}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
            <label htmlFor="status" className="block text-sm mb-2 text-gray-700">
                Status
              </label>
            <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg 
             focus:outline-none focus:ring-2 focus:ring-blue-500
             bg-white">
           <option value="Active">Active</option>
           <option value="Inactive">Inactive</option>
           </select>
           </div>

           
          </div>

          {/* Footer */}
          <div className="flex gap-3 mt-6">
            
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Employee
            </button>
          </div>
        </form>
      </div>
    </div>
    
  )
}

export default EmployeeModal
