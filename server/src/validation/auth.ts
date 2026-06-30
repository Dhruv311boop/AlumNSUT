import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  role: z.enum(["STUDENT", "MENTOR"]),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  // Mentor specific
  designation: z.string().optional(),
  company: z.string().optional(),
  domain: z.string().optional(),
  yearsOfExperience: z.number().optional(),
  bio: z.string().optional(),
  skills: z.array(z.string()).optional(),
  graduationYear: z.number().int().min(1950).max(2030).optional(),
  availability: z.array(z.string()).optional(),
  // Student specific
  university: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});
