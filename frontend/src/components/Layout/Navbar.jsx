import React from 'react';
import { Bell, Search, Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

function Navbar({ onMenuClick }) {
  const { user } = useAuth();

  return (
    <header className="navbar">
      <button className="mobile-toggle" onClick={onMenuClick}>
        <Menu size={24} />
      </button>

      <div className="nav-search">
        <Search size={18} />
        <input type="text" placeholder="Search destinations..." />
      </div>

      <div className="nav-actions">
        <button className="btn-icon">
          <Bell size={20} color="var(--text-secondary)" />
        </button>
        <div className="nav-profile">
          <div className="avatar">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <span style={{ fontWeight: 500, fontSize: '0.9rem' }}>{user?.name}</span>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
