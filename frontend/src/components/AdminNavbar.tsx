// src/components/AdminNavbar.tsx

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AdminNavbar.css"; // ✅ External CSS

const AdminNavbar: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  return (
    <nav className="admin-navbar">
      <div className="admin-navbar-title">
        <Link to="/dashboard" className="admin-navbar-brand-link">
          🛠️ Admin Panel
        </Link>
      </div>

      <div className="admin-navbar-links">
        <Link to="/dashboard">Dashboard</Link>
       <Link to="/profile">Profile</Link>

        <Link to="/admin/hotels">Manage Hotels</Link>
        <Link to="/admin/bookings">View Bookings</Link>
        <button onClick={handleLogout} className="admin-logout-button">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default AdminNavbar;
