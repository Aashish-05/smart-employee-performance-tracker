const express = require('express');
const { addEmployee, getEmployees, searchEmployee, updateEmployee, deleteEmployee } = require('../controllers/employeeController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/search').get(protect, searchEmployee);
router.route('/').post(protect, addEmployee).get(protect, getEmployees);
router.route('/:id').put(protect, updateEmployee).delete(protect, deleteEmployee);

module.exports = router;
