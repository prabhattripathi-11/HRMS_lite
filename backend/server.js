const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Employee = require('./models/Employee');
const Attendance = require('./models/Attendance');

const app = express();
app.use(cors());
app.use(express.json());


const dbURI = "mongodb+srv://tripathiprabhat1008_db_user:l8YNCAC52msdGVvm@cluster0.gno6xpy.mongodb.net/hrms_lite?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(dbURI)
.then(() => console.log("✅ MongoDB Atlas (Cloud) Connected Successfully!"))
.catch(err => console.log("❌ Connection Error:", err));


app.post('/api/employees', async (req, res) => {
    try {
        const { empId, name, email, department } = req.body;
        
        
        const existing = await Employee.findOne({ empId });
        if (existing) return res.status(400).json({ message: "Employee ID already exists!" });

        const newEmp = new Employee({ empId, name, email, department });
        await newEmp.save();
        res.status(201).json(newEmp);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


app.get('/api/employees', async (req, res) => {
    try {
        const employees = await Employee.find();
        res.json(employees);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


app.delete('/api/employees/:id', async (req, res) => {
    try {
        await Employee.findByIdAndDelete(req.params.id);
        res.json({ message: "Employee Deleted Successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


app.post('/api/attendance', async (req, res) => {
    try {
        const { employeeId, date, status } = req.body;
        const record = new Attendance({ employeeId, date, status });
        await record.save();
        res.status(201).json(record);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


app.get('/api/attendance/:empId', async (req, res) => {
    try {
        const records = await Attendance.find({ employeeId: req.params.empId });
        res.json(records);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


const PORT = 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});