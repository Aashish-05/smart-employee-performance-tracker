import { useState, useEffect } from 'react';
import axios from '../api/axios';
import { Search, Trash2, Edit, Users, TrendingUp, Award, X } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
    const [employees, setEmployees] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    
    // Edit Modal State
    const [editingEmp, setEditingEmp] = useState(null);
    const [editForm, setEditForm] = useState({});

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const res = await axios.get('/employees');
            setEmployees(res.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching employees", error);
            setLoading(false);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.get(`/employees/search?department=${searchQuery}`);
            setEmployees(res.data);
        } catch (error) {
            console.error("Error searching employees", error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this employee?")) {
            try {
                await axios.delete(`/employees/${id}`);
                setEmployees(employees.filter(emp => emp._id !== id));
            } catch (error) {
                console.error("Error deleting employee", error);
                alert("Failed to delete employee. Please try again.");
            }
        }
    };

    const openEditModal = (emp) => {
        setEditingEmp(emp);
        setEditForm({
            ...emp,
            skills: emp.skills.join(', ') // Convert array to string for input
        });
    };

    const handleEditChange = (e) => {
        setEditForm({ ...editForm, [e.target.name]: e.target.value });
    };

    const submitEdit = async (e) => {
        e.preventDefault();
        try {
            const dataToSubmit = {
                ...editForm,
                skills: editForm.skills.split(',').map(s => s.trim()),
                performanceScore: Number(editForm.performanceScore),
                experience: Number(editForm.experience)
            };
            const res = await axios.put(`/employees/${editingEmp._id}`, dataToSubmit);
            setEmployees(employees.map(emp => emp._id === editingEmp._id ? res.data.employee : emp));
            setEditingEmp(null);
        } catch (error) {
            console.error("Error updating employee", error);
            alert("Failed to update employee.");
        }
    };

    // Calculate Summary Stats
    const totalEmployees = employees.length;
    const avgScore = totalEmployees ? Math.round(employees.reduce((acc, curr) => acc + curr.performanceScore, 0) / totalEmployees) : 0;
    const topPerformers = employees.filter(e => e.performanceScore >= 85).length;

    return (
        <div className="dashboard-wrapper">
            {/* Dashboard Summary Cards */}
            <div className="stats-container">
                <div className="stat-card glass-panel">
                    <div className="stat-icon-wrapper bg-blue">
                        <Users className="stat-icon" />
                    </div>
                    <div className="stat-details">
                        <h3>Total Employees</h3>
                        <p className="stat-value">{totalEmployees}</p>
                    </div>
                </div>
                <div className="stat-card glass-panel">
                    <div className="stat-icon-wrapper bg-purple">
                        <TrendingUp className="stat-icon" />
                    </div>
                    <div className="stat-details">
                        <h3>Average Score</h3>
                        <p className="stat-value">{avgScore}/100</p>
                    </div>
                </div>
                <div className="stat-card glass-panel">
                    <div className="stat-icon-wrapper bg-green">
                        <Award className="stat-icon" />
                    </div>
                    <div className="stat-details">
                        <h3>Top Performers</h3>
                        <p className="stat-value">{topPerformers}</p>
                    </div>
                </div>
            </div>

            <div className="dashboard-main glass-panel">
                <div className="dashboard-header">
                    <h2>Employee Directory</h2>
                    <form onSubmit={handleSearch} className="search-form">
                        <div className="search-input-wrapper">
                            <Search className="search-icon" />
                            <input
                                type="text"
                                placeholder="Search by Department..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="btn-primary">Search</button>
                        {searchQuery && (
                            <button type="button" className="btn-secondary" onClick={() => { setSearchQuery(''); fetchEmployees(); }}>Clear</button>
                        )}
                    </form>
                </div>

                {loading ? (
                    <div className="loading-state">
                        <div className="loader"></div>
                        <p>Loading your workforce data...</p>
                    </div>
                ) : employees.length === 0 ? (
                    <div className="no-data">
                        <img src="https://illustrations.popsy.co/amber/freelancer.svg" alt="No data" className="empty-img"/>
                        <h3>No Employees Found</h3>
                        <p>Start adding employees to see them appear here.</p>
                    </div>
                ) : (
                    <div className="table-container">
                        <table className="employee-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Contact</th>
                                    <th>Department</th>
                                    <th>Skills</th>
                                    <th>Score</th>
                                    <th>Exp (Yrs)</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {employees.map(emp => (
                                    <tr key={emp._id} className="table-row">
                                        <td className="fw-600">{emp.name}</td>
                                        <td className="text-muted">{emp.email}</td>
                                        <td>
                                            <span className="badge-dept">{emp.department}</span>
                                        </td>
                                        <td>
                                            <div className="skills-container">
                                                {emp.skills.map((skill, idx) => (
                                                    <span key={idx} className="badge-skill">{skill}</span>
                                                ))}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="score-wrapper">
                                                <div className="score-bar-bg">
                                                    <div className={`score-bar-fill ${emp.performanceScore >= 80 ? 'bg-success' : emp.performanceScore >= 60 ? 'bg-warning' : 'bg-danger'}`} style={{width: `${emp.performanceScore}%`}}></div>
                                                </div>
                                                <span className="score-text">{emp.performanceScore}</span>
                                            </div>
                                        </td>
                                        <td className="text-center">{emp.experience}</td>
                                        <td className="actions-cell">
                                            <button onClick={() => openEditModal(emp)} className="btn-icon btn-edit" title="Edit">
                                                <Edit className="icon-sm" />
                                            </button>
                                            <button onClick={() => handleDelete(emp._id)} className="btn-icon btn-danger" title="Delete">
                                                <Trash2 className="icon-sm" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Edit Modal Overlay */}
            {editingEmp && (
                <div className="modal-overlay">
                    <div className="modal-content glass-panel bounce-in">
                        <div className="modal-header">
                            <h3>Edit Employee</h3>
                            <button className="btn-icon text-muted" onClick={() => setEditingEmp(null)}>
                                <X />
                            </button>
                        </div>
                        <form onSubmit={submitEdit} className="modal-form">
                            <div className="form-group">
                                <label>Name</label>
                                <input type="text" name="name" value={editForm.name} onChange={handleEditChange} required />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input type="email" name="email" value={editForm.email} onChange={handleEditChange} required />
                            </div>
                            <div className="form-group">
                                <label>Department</label>
                                <input type="text" name="department" value={editForm.department} onChange={handleEditChange} required />
                            </div>
                            <div className="form-group">
                                <label>Skills (comma separated)</label>
                                <input type="text" name="skills" value={editForm.skills} onChange={handleEditChange} required />
                            </div>
                            <div className="form-group-row">
                                <div className="form-group">
                                    <label>Score</label>
                                    <input type="number" name="performanceScore" value={editForm.performanceScore} onChange={handleEditChange} required />
                                </div>
                                <div className="form-group">
                                    <label>Experience</label>
                                    <input type="number" name="experience" value={editForm.experience} onChange={handleEditChange} required />
                                </div>
                            </div>
                            <button type="submit" className="btn-primary full-width mt-3">Save Changes</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
