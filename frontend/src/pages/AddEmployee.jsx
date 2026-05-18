import { useState } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';
import './AddEmployee.css';

const AddEmployee = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        department: '',
        skills: '',
        performanceScore: '',
        experience: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const dataToSubmit = {
                ...formData,
                skills: formData.skills.split(',').map(s => s.trim()),
                performanceScore: Number(formData.performanceScore),
                experience: Number(formData.experience)
            };
            const res = await axios.post('/employees', dataToSubmit);
            setSuccess(res.data.message);
            setError('');
            setTimeout(() => navigate('/employees'), 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Error adding employee');
            setSuccess('');
        }
    };

    return (
        <div className="add-employee-container">
            <div className="add-employee-box">
                <h2>Add New Employee</h2>
                {error && <p className="error-msg">{error}</p>}
                {success && <p className="success-msg">{success}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Name</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Department</label>
                        <input type="text" name="department" value={formData.department} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Skills (comma separated)</label>
                        <input type="text" name="skills" value={formData.skills} onChange={handleChange} placeholder="e.g. React, Node.js, MongoDB" required />
                    </div>
                    <div className="form-group row">
                        <div className="col">
                            <label>Performance Score (0-100)</label>
                            <input type="number" name="performanceScore" value={formData.performanceScore} onChange={handleChange} min="0" max="100" required />
                        </div>
                        <div className="col">
                            <label>Experience (Years)</label>
                            <input type="number" name="experience" value={formData.experience} onChange={handleChange} min="0" required />
                        </div>
                    </div>
                    <button type="submit" className="btn-primary full-width">Add Employee</button>
                </form>
            </div>
        </div>
    );
};

export default AddEmployee;
