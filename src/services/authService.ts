// /services/authService.ts
import { users } from "./mockData";

export const loginRequest = async (email: string, password: string) => {
  await new Promise((res) => setTimeout(res, 300));

  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) throw new Error("Invalid credentials");

  const token = "mock-jwt-token"; // mock token
  // Store in localStorage
  localStorage.setItem("token", token);
  localStorage.setItem("role", user.role);

  return {
    token,
    role: user.role,
    name: user.name,
  };
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
};
