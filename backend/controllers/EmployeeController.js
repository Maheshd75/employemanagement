import Employees from "../models/Employees.js";
import ExcelJS from "exceljs";
import PDFDocument from "pdfkit";




export const getEmployees = async(req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const search = req.query.search || "";
        const skip = (page - 1) * limit;
         /* SEARCH CONDITION */
        let query = {};
         if (search) {
            const statusMatch =
    search.toLowerCase() === "active"
      ? "Active"
      : search.toLowerCase() === "inactive"
      ? "Inactive"
      : null;
         query = {
            $or: [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { employeeId: { $regex: search, $options: "i" } },
        { department: { $regex: search, $options: "i" } },
       
      ]
    }; 
     if (statusMatch) {
    query.$or.push({ status: statusMatch });
  }
}
       
        const total = await Employees.countDocuments(query);
        const employees = await Employees.find(query).skip(skip).limit(limit);
        res.status(200).json({
            employees,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const createEmployee = async(req, res) => {
    try {
        const employee = await Employees.create(req.body);
        res.status(201).json({success: true, employee});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createEmployees = async(req, res) => {
    try {
        const employees = await Employees.insertMany(req.body);
        res.status(201).json(employees);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateEmployee = async(req, res) => {
    try {
        const { id } = req.params;
        const employee = await Employees.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json(employee);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const deleteEmployee = async(req, res) => {
    try {
        const { id } = req.params;
        await Employees.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Employee deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getEmployeeById = async(req, res) => {
    try {
        const { id } = req.params;
        const employee = await Employees.findById(id);
        res.status(200).json(employee);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const exporttoExcel = async(req, res) => {
    try {
        const employees = await Employees.find();
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Employees");
        worksheet.columns = [
            { header: "Employee ID", key: "employeeId", width: 15 },
            { header: "Name", key: "name", width: 25 },
            { header: "Email", key: "email", width: 30 },
            { header: "Phone", key: "phone", width: 15 },
            { header: "Department", key: "department", width: 20 },
            { header: "Status", key: "status", width: 10 },
        ];
        employees.forEach((emp) => {
            worksheet.addRow({
                employeeId: emp.employeeId,
                name: emp.name,
                email: emp.email,
                phone: emp.phone,
                department: emp.department,
                status: emp.status,
            });
        });
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            );
        res.setHeader("Content-Disposition", "attachment; filename=employees.xlsx");
        await workbook.xlsx.write(res);
        res.status(200).end();
    }catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const exporttoPDF = async(req, res) => {
    try {
     const employees = await Employees.find();

    
    const doc = new PDFDocument({ margin: 30, size: "A4" });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=employees.pdf"
    );

    doc.pipe(res);

    /* TITLE */
    doc
      .fontSize(18)
      .text("Employee List", { align: "center" })
      .moveDown(1.5);

    /* TABLE CONFIG */
    const tableTop = 100;
    const rowHeight = 25;

    const colWidths = {
      employeeId: 80,
      name: 90,
      email: 150,
      phone: 80,
      department: 80,
      status: 60
    };

    let x = doc.page.margins.left;
    let y = tableTop;

    /* DRAW TABLE HEADER */
    const drawHeader = () => {
      doc
        .fontSize(10)
        .rect(x, y, colWidths.employeeId, rowHeight).stroke()
        .text("Emp ID", x + 5, y + 7);

      doc
        .rect(x += colWidths.employeeId, y, colWidths.name, rowHeight).stroke()
        .text("Name", x + 5, y + 7);

      doc
        .rect(x += colWidths.name, y, colWidths.email, rowHeight).stroke()
        .text("Email", x + 5, y + 7);

      doc
        .rect(x += colWidths.email, y, colWidths.phone, rowHeight).stroke()
        .text("Phone", x + 5, y + 7);

      doc
        .rect(x += colWidths.phone, y, colWidths.department, rowHeight).stroke()
        .text("Dept", x + 5, y + 7);

      doc
        .rect(x += colWidths.department, y, colWidths.status, rowHeight).stroke()
        .text("Status", x + 5, y + 7);

      x = doc.page.margins.left;
      y += rowHeight;
    };

    drawHeader();

    /* DRAW ROWS */
    employees.forEach((emp, index) => {
      if (y + rowHeight > doc.page.height - doc.page.margins.bottom) {
        doc.addPage();
        y = tableTop;
        drawHeader();
      }

      doc
        .fontSize(9)
        .rect(x, y, colWidths.employeeId, rowHeight).stroke()
        .text(emp.employeeId, x + 5, y + 7);

      doc
        .rect(x += colWidths.employeeId, y, colWidths.name, rowHeight).stroke()
        .text(emp.name, x + 5, y + 7);

      doc
        .rect(x += colWidths.name, y, colWidths.email, rowHeight).stroke()
        .text(emp.email, x + 5, y + 7, { width: colWidths.email - 10 });

      doc
        .rect(x += colWidths.email, y, colWidths.phone, rowHeight).stroke()
        .text(emp.phone || "-", x + 5, y + 7);

      doc
        .rect(x += colWidths.phone, y, colWidths.department, rowHeight).stroke()
        .text(emp.department || "-", x + 5, y + 7);

      doc
        .rect(x += colWidths.department, y, colWidths.status, rowHeight).stroke()
        .text(emp.status, x + 5, y + 7);

      x = doc.page.margins.left;
      y += rowHeight;
    });

    doc.end();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const toggleEmployeeStatus = async (req, res) => {
  try {
    const employee = await Employees.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({success:false, message: "Employee not found" });
    }

    employee.status = employee.status === "Active" ? "Inactive" : "Active";
    await employee.save();

    res.json({success:true, employee});
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};




