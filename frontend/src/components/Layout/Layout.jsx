import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import './Layout.css';

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="layout-container">
      <div className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`} onClick={() => setSidebarOpen(false)} style={{
        display: sidebarOpen ? 'block' : 'none',
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 99
      }}></div>
      
      <div className={sidebarOpen ? 'sidebar-wrapper open' : 'sidebar-wrapper'}>
        <Sidebar />
      </div>
      
      <div className="main-wrapper">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;
