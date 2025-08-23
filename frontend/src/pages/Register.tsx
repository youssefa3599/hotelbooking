import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./auth.css";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
  e.preventDefault();

  console.log("📝 [Register] Attempting to register user with:");
  console.log("Name:", name);
  console.log("Email:", email);
  console.log("Role:", role);

  try {
    const res = await axios.post("/api/auth/register", {
      name,
      email,
      password,
      role,
    });

    console.log("✅ [Register] Registration successful:", res.data);

    const user = res.data;
    const token = user.token;

    if (!token || !user.role) {
      console.error("❌ Invalid registration response:", res.data);
      return;
    }

    // ✅ Save like Login.tsx
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    console.log("🔐 Token and user saved after registration");

    // ✅ Redirect based on role
    if (user.role === "admin") {
      navigate("/admin");
    } else if (user.role === "user") {
      navigate("/dashboard");
    } else {
      navigate("/");
    }
  } catch (err: any) {
    console.error("❌ [Register] Registration failed:", err);
    if (err.response) {
      console.error("📡 Server responded with:", err.response.status, err.response.data);
    } else if (err.request) {
      console.error("📭 No response received. Request details:", err.request);
    } else {
      console.error("⚠️ Error during request setup:", err.message);
    }
  }
};


  return (
    <div className="auth-container">
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <label htmlFor="name">Name:</label>
        <input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          required
        />

        <label htmlFor="email">Email:</label>
        <input
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          type="email"
          required
        />

        <label htmlFor="password">Password:</label>
        <input
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          type="password"
          required
        />

        <label htmlFor="role">Role:</label>
        <select id="role" value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
