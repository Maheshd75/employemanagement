import express from 'express';
import { createEmployee, createEmployees, deleteEmployee, exporttoExcel, exporttoPDF, getEmployeeById, getEmployees, toggleEmployeeStatus, updateEmployee } from '../controllers/EmployeeController.js';

const employeeRouter = express.Router();

employeeRouter.get('/all',getEmployees)
employeeRouter.post('/create',createEmployee)
employeeRouter.post('/create/multiple',createEmployees)
employeeRouter.post('/update/:id',updateEmployee)
employeeRouter.post('/delete/:id',deleteEmployee)
employeeRouter.get('/:id',getEmployeeById)
employeeRouter.get('/export/excel',exporttoExcel)
employeeRouter.get('/export/pdf',exporttoPDF)
employeeRouter.post('/:id/status',toggleEmployeeStatus)

export default employeeRouter;