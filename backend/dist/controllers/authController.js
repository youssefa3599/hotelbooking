import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
// 🔐 Generate JWT
const generateToken = (id) => {
    console.log("🔐 Generating token for ID:", id);
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};
// 📝 Register User
export const registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;
    console.log("📥 Register request received:", { name, email, role });
    console.log("🔐 Incoming raw password:", password);
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log("⚠️ User already exists:", email);
            return res.status(400).json({ message: "User already exists" });
        }
        // ❌ DO NOT hash password here — model will handle it
        const user = new User({ name, email, password, role });
        await user.save(); // 🔒 This triggers pre("save") hash in model
        console.log("✅ User created:", user.email);
        console.log("🧂 Stored hashed password (after save):", user.password);
        const token = generateToken(user._id.toString());
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token,
        });
    }
    catch (err) {
        console.error("❌ Registration error:", err);
        res.status(500).json({ message: "Server error during registration" });
    }
};
// 🔑 Login User
export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    console.log("🔐 Login request received:");
    console.log("Email:", email);
    console.log("Password (raw):", password);
    try {
        const user = await User.findOne({ email });
        if (!user) {
            console.log("❌ No user found for:", email);
            return res.status(401).json({ message: "Invalid credentials" });
        }
        console.log("🔍 Stored hashed password:", user.password);
        const isMatch = await bcrypt.compare(password, user.password);
        console.log("🧪 Password match result:", isMatch);
        if (!isMatch) {
            console.log("❌ Password mismatch for user:", email);
            return res.status(401).json({ message: "Invalid credentials" });
        }
        console.log("✅ Login successful for:", user.email);
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id.toString()),
        });
    }
    catch (err) {
        console.error("❌ Login error:", err);
        res.status(500).json({ message: "Server error during login" });
    }
};
// 👤 Get User Profile
export const getUserProfile = async (req, res) => {
    console.log("👤 [Profile] Get user profile");
    try {
        if (!req.user) {
            console.warn("⚠️ Unauthorized profile access attempt");
            return res.status(401).json({ message: "Unauthorized" });
        }
        console.log("🔍 Fetching profile for user ID:", req.user._id);
        const user = await User.findById(req.user._id).select("-password");
        if (!user) {
            console.warn("❌ User not found by ID:", req.user._id);
            return res.status(404).json({ message: "User not found" });
        }
        console.log("✅ Profile found:", user.email);
        res.json(user);
    }
    catch (err) {
        console.error("❌ Get profile error:", err);
        res.status(500).json({ message: "Server error during profile fetch" });
    }
};
// ✏️ Update Profile
export const updateUserProfile = async (req, res) => {
    console.log("✏️ [Profile] Update request received");
    try {
        if (!req.user) {
            console.warn("⚠️ Unauthorized profile update attempt");
            return res.status(401).json({ message: "Unauthorized" });
        }
        const user = await User.findById(req.user._id);
        if (!user) {
            console.warn("❌ User not found by ID:", req.user._id);
            return res.status(404).json({ message: "User not found" });
        }
        const { name, email, password } = req.body;
        console.log("🔧 Update values:", { name, email, password });
        user.name = name || user.name;
        user.email = email || user.email;
        if (password && password.trim() !== "") {
            console.log("🔐 Updating password...");
            user.password = password; // ✅ Will be hashed by model
        }
        const updatedUser = await user.save();
        console.log("✅ User profile updated:", updatedUser.email);
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
        });
    }
    catch (err) {
        console.error("❌ Update profile failed:", err);
        res.status(500).json({ message: "Server error during profile update" });
    }
};
