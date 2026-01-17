import type { Express } from "express";
import { createServer, type Server } from "node:http";
import { storage } from "./storage";
import { loginSchema, studentLoginSchema, insertStudentSchema, updateStudentSchema } from "@shared/schema";
import { z } from "zod";
import { fromError } from "zod-validation-error";

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "12345";

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/admin/login", async (req, res) => {
    try {
      const parsed = loginSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: fromError(parsed.error).toString() });
      }

      const { username, password } = parsed.data;

      if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        let admin = await storage.getAdminByUsername(username);
        
        if (!admin) {
          admin = await storage.createAdmin({
            username: ADMIN_USERNAME,
            password: ADMIN_PASSWORD,
            name: "Administrator",
          });
        }

        return res.json({
          message: "Login successful",
          admin: {
            id: admin.id,
            username: admin.username,
            name: admin.name,
          },
        });
      }

      return res.status(401).json({ message: "Invalid credentials" });
    } catch (error) {
      console.error("Admin login error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/student/login", async (req, res) => {
    try {
      const parsed = studentLoginSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: fromError(parsed.error).toString() });
      }

      const { studentId, password } = parsed.data;

      const student = await storage.getStudentByStudentId(studentId);

      if (!student) {
        return res.status(401).json({ message: "Invalid student ID or password" });
      }

      if (student.password !== password) {
        return res.status(401).json({ message: "Invalid student ID or password" });
      }

      if (!student.isActive) {
        return res.status(403).json({ message: "Your account is inactive. Please contact admin." });
      }

      return res.json({
        message: "Login successful",
        student: {
          id: student.id,
          studentId: student.studentId,
          name: student.name,
          email: student.email,
          phone: student.phone,
          age: student.age,
          isActive: student.isActive,
        },
      });
    } catch (error) {
      console.error("Student login error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/students", async (req, res) => {
    try {
      const students = await storage.getAllStudents();
      return res.json(
        students.map((s) => ({
          id: s.id,
          studentId: s.studentId,
          name: s.name,
          email: s.email,
          phone: s.phone,
          age: s.age,
          isActive: s.isActive,
        }))
      );
    } catch (error) {
      console.error("Get students error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/students/:id", async (req, res) => {
    try {
      const student = await storage.getStudent(req.params.id);
      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }
      return res.json({
        id: student.id,
        studentId: student.studentId,
        name: student.name,
        email: student.email,
        phone: student.phone,
        age: student.age,
        isActive: student.isActive,
      });
    } catch (error) {
      console.error("Get student error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/students", async (req, res) => {
    try {
      const parsed = insertStudentSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: fromError(parsed.error).toString() });
      }

      const existing = await storage.getStudentByStudentId(parsed.data.studentId);
      if (existing) {
        return res.status(400).json({ message: "Student ID already exists" });
      }

      const existingEmail = await storage.getStudentByEmail(parsed.data.email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }

      const student = await storage.createStudent(parsed.data);
      return res.status(201).json({
        id: student.id,
        studentId: student.studentId,
        name: student.name,
        email: student.email,
        phone: student.phone,
        age: student.age,
        isActive: student.isActive,
      });
    } catch (error) {
      console.error("Create student error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.put("/api/students/:id", async (req, res) => {
    try {
      const parsed = updateStudentSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: fromError(parsed.error).toString() });
      }

      const student = await storage.updateStudent(req.params.id, parsed.data);
      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }

      return res.json({
        id: student.id,
        studentId: student.studentId,
        name: student.name,
        email: student.email,
        phone: student.phone,
        age: student.age,
        isActive: student.isActive,
      });
    } catch (error) {
      console.error("Update student error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete("/api/students/:id", async (req, res) => {
    try {
      const success = await storage.deleteStudent(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Student not found" });
      }
      return res.json({ message: "Student deleted successfully" });
    } catch (error) {
      console.error("Delete student error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
