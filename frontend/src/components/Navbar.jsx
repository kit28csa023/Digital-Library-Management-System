import React, { useContext, useState } from 'react';
import { Search, LogOut, BookOpen, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
    const { logout, user } = useContext(AuthContext);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="nav-left">
                {/* Search pushed slightly if no sidebar is visible for branding, but we have sidebar */}
                <form className="nav-search" onSubmit={handleSearch}>
                    <Search className="search-icon" size={20} />
                    <input 
                        type="text" 
                        placeholder="Search books, authors, topics..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </form>
            </div>
            
            <div className="nav-right">
                <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                    {user?.name}
                </span>
                <button onClick={handleLogout} className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px' }}>
                    <LogOut size={16} /> Logout
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
