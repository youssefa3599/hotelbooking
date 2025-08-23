import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
  Outlet,
} from "react-router-dom";

import HotelForm from "./components/HotelForm";
import MyBookings from "./components/MyBookings";
import BookingPage from "./pages/BookingPage";
import Success from "./pages/Success";
import UserProfile from "./pages/UserProfile";
import HotelList from "./components/HotelList";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import AdminNavbar from "./components/AdminNavbar";
import Welcome from "./pages/Home";
import DashboardHome from "./pages/DashboardHome";
import AdminBookings from "./pages/admin/AdminBookings";

// ✅ Admin components
import ManageHotels from "./pages/admin/ManageHotels"; // Make sure this path is correct
// HotelForm is reused for edit mode

// ✅ Layout with conditional background
const Layout: React.FC = () => {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  const isAdmin = user.role === "admin";
  const showBackground = location.pathname === "/dashboard";

  return (
    <div className={showBackground ? "background-container" : ""}>
      {isAdmin ? <AdminNavbar /> : <Navbar />}

      {/* ✅ wrap all page content in .container */}
      <div className="container pt-4">
        <Outlet />
      </div>
    </div>
  );
};

// ✅ PublicRoute to block auth pages from logged-in users
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  return user ? <Navigate to="/dashboard" /> : <>{children}</>;
};

const App: React.FC = () => {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  return (
    <BrowserRouter>
      <Routes>
        {/* 🌐 Public Routes */}
        <Route
          path="/"
          element={user ? <Navigate to="/dashboard" /> : <Welcome />}
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        {/* 🔒 Protected Routes */}
        <Route element={<Layout />}>
          {/* Shared routes */}
          <Route path="/dashboard" element={<DashboardHome />} />
          <Route path="/hotels" element={<HotelList />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/book/:hotelId" element={<BookingPage />} />
          <Route path="/success" element={<Success />} />
          <Route path="/profile" element={<UserProfile />} />

          {/* Admin-only routes */}
          <Route path="/admin/hotels" element={<ManageHotels />} />
          <Route path="/admin/create-hotel" element={<HotelForm />} />
          <Route path="/admin/edit-hotel/:id" element={<HotelForm />} />
          <Route path="/admin/bookings" element={<AdminBookings />} />
        </Route>

        {/* ❌ Catch-all fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
