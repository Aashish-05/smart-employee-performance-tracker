import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogOut, Users, UserPlus, Brain } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                    <Brain className="icon" />
                    <span>AI HR Analytics</span>
                </Link>
                <div className="navbar-links">
                    {user ? (
                        <>
                            <Link to="/employees" className="nav-link"><Users className="icon-sm" /> Employees</Link>
                            <Link to="/add-employee" className="nav-link"><UserPlus className="icon-sm" /> Add Employee</Link>
                            <Link to="/ai-recommendations" className="nav-link"><Brain className="icon-sm" /> AI Insights</Link>
                            <button onClick={handleLogout} className="btn-logout"><LogOut className="icon-sm" /> Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="nav-link">Login</Link>
                            <Link to="/register" className="nav-link btn-primary">Register</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
