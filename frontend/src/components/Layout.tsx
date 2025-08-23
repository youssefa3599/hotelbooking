// src/components/Layout.tsx

import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import AdminNavbar from "./AdminNavbar";
import "../components/layout.css";

const Layout = () => {
  const location = useLocation();
  const pathname = location.pathname;

  const isLoginOrRegister = pathname === "/login" || pathname === "/register";

  const user = JSON.parse(localStorage.getItem("user") || "null");

  // Show background only on dashboard for logged-in users
  const showBackground = user && pathname === "/dashboard";

  return (
    <>
      {/* ✅ Render navbar only if user is logged in and not on login/register */}
      {!isLoginOrRegister && user?.role === "user" && <Navbar />}
      {!isLoginOrRegister && user?.role === "admin" && <AdminNavbar />}

      {/* ✅ Apply background only on dashboard */}
      <div className={showBackground ? "background-container" : ""}>
        <Outlet />
      </div>
    </>
  );
};

export default Layout;
