import * as z from "zod";

export const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  password: z.string().min(6, "Password must be 6+ characters"),
});

export const projectSchema = z.object({
  progress: z.number()
    .min(0, { message: "Progress cannot be less than 0%" })
    .max(100, { message: "Progress cannot exceed 100%" }),
  budget: z.number()
    .min(0, { message: "Budget cannot be negative" }),
});

export const taskSchema = z.object({
  name: z.string().min(3, "Task name must be at least 3 characters"),
  status: z.enum(["Pending", "Active", "Completed"]),
  priority: z.enum(["Low", "Medium", "High"]),
  assignedTo: z.string().min(1, "Assign a user"),
  progress: z.number().min(0, { message: "Progress cannot be less than 0%" }).max(100, { message: "Progress cannot exceed 100%" }),
  dueDate: z.string().refine(val => !isNaN(Date.parse(val)), "Invalid date"),
});