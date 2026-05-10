import React from 'react';
import { NavLink } from 'react-router-dom';
import { Compass, Map, PlusSquare, Search, LogOut, Settings, BarChart2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <Compass size={28} />
        Traveloop
      </div>
      
      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <Map size={20} /> Dashboard
        </NavLink>
        <NavLink to="/trips" className={({isActive}) => isActive ? "nav-item active" : "nav-item"} end>
          <Compass size={20} /> My Trips
        </NavLink>
        <NavLink to="/trips/new" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <PlusSquare size={20} /> Create Trip
        </NavLink>
        <NavLink to="/explore/cities" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <Search size={20} /> Explore
        </NavLink>
        
        {user?.role === 'admin' && (
          <NavLink to="/admin" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
            <BarChart2 size={20} /> Admin Panel
          </NavLink>
        )}
      </nav>

      <div className="sidebar-footer">
        <NavLink to="/profile" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <Settings size={20} /> Settings
        </NavLink>
        <button onClick={logout} className="nav-item" style={{width: '100%', background: 'transparent', border: 'none', textAlign: 'left', cursor: 'pointer'}}>
          <LogOut size={20} /> Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
