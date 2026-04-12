import React from 'react';
import { NavLink } from 'react-router-dom';
import { Library, Home, BookMarked, PlusCircle } from 'lucide-react';

const Sidebar = () => {
    return (
        <aside className="sidebar">
            <div className="nav-brand" style={{ padding: '0 24px', marginBottom: '32px' }}>
                <Library color="var(--primary)" size={28} />
                <span>MyLibrary</span>
            </div>

            <nav>
                <NavLink to="/" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`} end>
                    <Home size={20} /> Dashboard
                </NavLink>
                <NavLink to="/catalog" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
                    <BookMarked size={20} /> Available Books
                </NavLink>
                <NavLink to="/add-book" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
                    <PlusCircle size={20} /> Add Book
                </NavLink>
            </nav>
        </aside>
    );
};

export default Sidebar;
