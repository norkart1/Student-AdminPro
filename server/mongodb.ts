import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
});

const studentSchema = new mongoose.Schema({
  studentId: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  age: { type: String },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export const Admin = mongoose.models.Admin || mongoose.model("Admin", adminSchema);
export const Student = mongoose.models.Student || mongoose.model("Student", studentSchema);
