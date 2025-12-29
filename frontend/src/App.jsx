
import Sidebar from "./components/Sidebar";
import EmployeeTable from "./components/EmployeeTable";
import {  Route, Routes } from "react-router-dom";
import EmployeeModal from "./components/EmployeeModal";
import { Toaster } from "react-hot-toast";




export default function App() {
 
  
  
  return (
     
     <div className="flex h-screen bg-gray-100">
      <Toaster/>
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <Routes>
          <Route path="/" element={<EmployeeTable />}/>
          <Route path="/add-employee" element={<EmployeeModal />}/>

        </Routes>
      </main>
    </div>
  );
}
