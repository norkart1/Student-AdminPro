import { Admin, Student } from "./mongodb";
import mongoose from "mongoose";
import type { Admin as AdminType, InsertAdmin, Student as StudentType, InsertStudent, UpdateStudent } from "@shared/schema";

if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI is not set");
}

mongoose.connect(process.env.MONGODB_URI).then(() => {
  console.log("Connected to MongoDB");
}).catch((err) => {
  console.error("MongoDB connection error:", err);
});

export interface IStorage {
  getAdmin(id: string): Promise<AdminType | undefined>;
  getAdminByUsername(username: string): Promise<AdminType | undefined>;
  createAdmin(admin: InsertAdmin): Promise<AdminType>;
  
  getStudent(id: string): Promise<StudentType | undefined>;
  getStudentByStudentId(studentId: string): Promise<StudentType | undefined>;
  getStudentByEmail(email: string): Promise<StudentType | undefined>;
  getAllStudents(): Promise<StudentType[]>;
  createStudent(student: InsertStudent): Promise<StudentType>;
  updateStudent(id: string, data: UpdateStudent): Promise<StudentType | undefined>;
  deleteStudent(id: string): Promise<boolean>;
}

export class MongoStorage implements IStorage {
  async getAdmin(id: string): Promise<AdminType | undefined> {
    const admin = await Admin.findById(id);
    return admin ? this.mapAdmin(admin) : undefined;
  }

  async getAdminByUsername(username: string): Promise<AdminType | undefined> {
    const admin = await Admin.findOne({ username });
    return admin ? this.mapAdmin(admin) : undefined;
  }

  async createAdmin(insertAdmin: InsertAdmin): Promise<AdminType> {
    const admin = new Admin(insertAdmin);
    await admin.save();
    return this.mapAdmin(admin);
  }

  async getStudent(id: string): Promise<StudentType | undefined> {
    const student = await Student.findById(id);
    return student ? this.mapStudent(student) : undefined;
  }

  async getStudentByStudentId(studentId: string): Promise<StudentType | undefined> {
    const student = await Student.findOne({ studentId });
    return student ? this.mapStudent(student) : undefined;
  }

  async getStudentByEmail(email: string): Promise<StudentType | undefined> {
    const student = await Student.findOne({ email });
    return student ? this.mapStudent(student) : undefined;
  }

  async getAllStudents(): Promise<StudentType[]> {
    const students = await Student.find();
    return students.map(s => this.mapStudent(s));
  }

  async createStudent(insertStudent: InsertStudent): Promise<StudentType> {
    const student = new Student(insertStudent);
    await student.save();
    return this.mapStudent(student);
  }

  async updateStudent(id: string, data: UpdateStudent): Promise<StudentType | undefined> {
    const student = await Student.findByIdAndUpdate(id, { ...data }, { new: true });
    return student ? this.mapStudent(student) : undefined;
  }

  async deleteStudent(id: string): Promise<boolean> {
    await Student.findByIdAndDelete(id);
    return true;
  }

  private mapAdmin(doc: any): AdminType {
    return {
      id: doc._id.toString(),
      username: doc.username,
      password: doc.password,
      name: doc.name,
    };
  }

  private mapStudent(doc: any): StudentType {
    return {
      id: doc._id.toString(),
      studentId: doc.studentId,
      password: doc.password,
      name: doc.name,
      email: doc.email,
      phone: doc.phone || null,
      age: doc.age || null,
      isActive: doc.isActive,
    };
  }
}

export const storage = new MongoStorage();
