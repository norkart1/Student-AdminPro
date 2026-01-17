import mongoose from "mongoose";
import { Admin } from "./mongodb";

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "12345";

export async function ensureAdmin() {
  if (!process.env.MONGODB_URI) {
    console.error("MONGODB_URI is not set");
    return;
  }

  try {
    const existingAdmin = await Admin.findOne({ username: ADMIN_USERNAME });
    if (!existingAdmin) {
      console.log("Seeding default admin to MongoDB...");
      await Admin.create({
        username: ADMIN_USERNAME,
        password: ADMIN_PASSWORD,
        name: "Administrator",
      });
      console.log("Default admin created successfully.");
    } else {
      console.log("Admin account already exists in MongoDB.");
    }
  } catch (error) {
    console.error("Error seeding admin:", error);
  }
}
