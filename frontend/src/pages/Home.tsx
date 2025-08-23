import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Home = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  // If user is logged in, redirect based on role
  useEffect(() => {
    if (user) {
      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/hotels");
      }
    }
  }, [user, navigate]);

  return (
    <div
      style={{
        textAlign: "center",
        marginTop: "100px",
        backgroundColor: "#f3e8ff", // light purple background
        padding: "50px",
        borderRadius: "12px",
        maxWidth: "600px",
        marginLeft: "auto",
        marginRight: "auto",
        boxShadow: "0 0 10px rgba(128, 0, 128, 0.2)",
      }}
    >
      <h1 style={{ color: "#6a0dad", fontSize: "36px", marginBottom: "20px" }}>
        Welcome to YoussefBooking
      </h1>
      <p style={{ fontSize: "18px", color: "#4a0072", marginBottom: "30px" }}>
        Choose an option to continue:
      </p>

      <button
        onClick={() => navigate("/register")}
        style={{
          padding: "10px 20px",
          margin: "10px",
          backgroundColor: "#6a0dad",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        Register
      </button>

      <button
        onClick={() => navigate("/login")}
        style={{
          padding: "10px 20px",
          margin: "10px",
          backgroundColor: "#4a0072",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        Login
      </button>
    </div>
  );
};

export default Home;
