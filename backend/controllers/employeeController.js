const Employee = require('../models/Employee');

exports.addEmployee = async (req, res) => {
    const { name, email, department, skills, performanceScore, experience } = req.body;

    if (performanceScore == null) {
        return res.status(400).json({ message: 'Validation error: Missing performance score' });
    }

    try {
        const existingEmployee = await Employee.findOne({ email });
        if (existingEmployee) {
            return res.status(400).json({ message: 'Error message: Duplicate email' });
        }

        const employee = await Employee.create({ name, email, department, skills, performanceScore, experience });
        res.status(201).json({ message: 'Employee stored successfully', employee });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getEmployees = async (req, res) => {
    try {
        const employees = await Employee.find();
        res.json(employees);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.searchEmployee = async (req, res) => {
    const { department } = req.query;
    try {
        const filter = department ? { department: { $regex: new RegExp(department, 'i') } } : {};
        const employees = await Employee.find(filter);
        res.json(employees);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateEmployee = async (req, res) => {
    try {
        const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!employee) return res.status(404).json({ message: 'Employee not found' });
        res.json({ message: 'Updated data shown', employee });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteEmployee = async (req, res) => {
    try {
        const employee = await Employee.findByIdAndDelete(req.params.id);
        if (!employee) return res.status(404).json({ message: 'Employee not found' });
        res.json({ message: 'Employee removed successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
