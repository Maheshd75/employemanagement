import { LayoutDashboard, User, Users } from 'lucide-react'
import  { useState } from 'react'
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
    
  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl">Admin Dashboard</h1>
      </div>
      
      <nav className="flex-1 px-4">
        
          
            <NavLink
                to="/"
              className={({ isActive }) => isActive ? "flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-800 text-white" : "flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors"}
            >
              <Users className="w-5 h-5" />
              <span>Employees</span>
            </NavLink>
          
          
            <NavLink
                to="/add-employee"
              className={({ isActive }) => isActive ? "flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-800 text-white mt-2" : "flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors mt-2"}
            >
              <User className="w-5 h-5" />
              <span>Add Employee</span>
            </NavLink>
          
          
        
      </nav>

      <div className="p-6 border-t border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
            <span>A</span>
          </div>
          <div>
            <p>Admin User</p>
            <p className="text-sm text-gray-400">admin@example.com</p>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
