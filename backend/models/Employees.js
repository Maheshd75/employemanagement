import mongoose from "mongoose";

const EmployeeSchema = new mongoose.Schema({
  employeeId: { type: String , required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
   phone: {type: String},
    department: { type: String },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
}, { timestamps: true });

const Employees = mongoose.model("Employees", EmployeeSchema);

export default Employees;

