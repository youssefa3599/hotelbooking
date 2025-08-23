import mongoose, { Document, Schema, Types } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true, minlength: 2 },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
});

// ✅ Debug password hashing
userSchema.pre("save", async function (next) {
  const user = this as IUser;

  if (!user.isModified("password")) {
    console.log("🔁 [User Model] Password not modified. Skipping hashing.");
    return next();
  }

  console.log("🔐 [User Model] Hashing password for:", user.email);
  console.log("🔐 [User Model] Raw password:", user.password);

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  console.log("✅ [User Model] Password hashed:", user.password);

  next();
});

// ✅ Debug password comparison
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  console.log("🔍 [User Model] Comparing passwords...");
  console.log("🔍 Candidate password:", candidatePassword);
  console.log("🔍 Stored hashed password:", this.password);

  const result = await bcrypt.compare(candidatePassword, this.password);
  console.log("🔍 Passwords match?", result);
  return result;
};

const User = mongoose.model<IUser>("User", userSchema);
export default User;
