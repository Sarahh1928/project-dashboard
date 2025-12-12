// /services/mockData.ts

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "Admin" | "ProjectManager" | "Developer";
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: "Active" | "Pending" | "Completed";
  priority: "High" | "Medium" | "Low";
  progress: number; // percentage
  budget: number;
  startDate: string; // ISO date string
  endDate: string;   // ISO date string
}

export interface Task {
  id: string;
  projectId: string;
  name: string;
  status: "Active" | "Pending" | "Completed";
  priority: "High" | "Medium" | "Low";
  assignedTo: string; // user name or id
  progress: number; // percentage
  dueDate: string; // ISO date string
}

export const users = [
  { id: "u1", name: "Sarah", email: "admin@example.com", password: "admin123", role: "Admin" },
  { id: "u2", name: "Ahmed", email: "pm@example.com", password: "pmanager123", role: "ProjectManager" },
  { id: "u3", name: "Omar", email: "dev@example.com", password: "developer123", role: "Developer" },
];
export const projects: Project[] = [
  {
    id: "p1", 
    name: "Website Revamp",
    description: "Improve UI/UX & backend performance",
    status: "Active",
    priority: "High",
    progress: 35,
    budget: 5000,
    startDate: "2025-01-01",
    endDate: "2025-02-28",
  },
  {
    id: "p2",
    name: "Mobile App Launch",
    description: "New Android & iOS app",
    status: "Pending",
    priority: "Medium",
    progress: 0,
    budget: 8000,
    startDate: "2025-02-01",
    endDate: "2025-04-30",
  },
  {
    id: "p3",
    name: "Marketing Campaign",
    description: "Social media & email campaign",
    status: "Active",
    priority: "Medium",
    progress: 20,
    budget: 3000,
    startDate: "2025-01-15",
    endDate: "2025-03-15",
  },
  {
    id: "p4",
    name: "Customer Support Upgrade",
    description: "Implement chatbots and helpdesk improvements",
    status: "Completed",
    priority: "Low",
    progress: 100,
    budget: 2000,
    startDate: "2024-11-01",
    endDate: "2025-01-10",
  },
  {
    id: "p5",
    name: "Data Analytics Dashboard",
    description: "Build dashboard for internal metrics",
    status: "Active",
    priority: "High",
    progress: 60,
    budget: 7000,
    startDate: "2025-01-20",
    endDate: "2025-03-30",
  },
];

export const tasks = [
  // Project 1 tasks
  {
    id: "t1",
    projectId: "p1",
    name: "Design Homepage",
    status: "Completed",
    priority: "High",
    assignedTo: "Omar",
    progress: 100,
    dueDate: "2025-01-15",
  },
  {
    id: "t2",
    projectId: "p1",
    name: "API Integration",
    status: "Active",
    priority: "Medium",
    assignedTo: "Ahmed",
    progress: 50,
    dueDate: "2025-02-10",
  },
  // Project 2 tasks
  {
    id: "t3",
    projectId: "p2",
    name: "Set Up Backend",
    status: "Pending",
    priority: "High",
    assignedTo: "Sarah",
    progress: 0,
    dueDate: "2025-03-01",
  },
  {
    id: "t4",
    projectId: "p2",
    name: "Design Mobile UI",
    status: "Pending",
    priority: "Medium",
    assignedTo: "Omar",
    progress: 0,
    dueDate: "2025-03-15",
  },
  // Project 3 tasks
  {
    id: "t5",
    projectId: "p3",
    name: "Social Media Ads",
    status: "Active",
    priority: "Medium",
    assignedTo: "Ahmed",
    progress: 40,
    dueDate: "2025-02-20",
  },
  {
    id: "t6",
    projectId: "p3",
    name: "Email Templates",
    status: "Pending",
    priority: "Low",
    assignedTo: "Sarah",
    progress: 0,
    dueDate: "2025-02-28",
  },
  // Project 4 tasks
  {
    id: "t7",
    projectId: "p4",
    name: "Implement Chatbot",
    status: "Completed",
    priority: "Medium",
    assignedTo: "Omar",
    progress: 100,
    dueDate: "2024-12-15",
  },
  {
    id: "t8",
    projectId: "p4",
    name: "Helpdesk Upgrade",
    status: "Completed",
    priority: "Low",
    assignedTo: "Ahmed",
    progress: 100,
    dueDate: "2025-01-05",
  },
  // Project 5 tasks
  {
    id: "t9",
    projectId: "p5",
    name: "Design Dashboard UI",
    status: "Active",
    priority: "High",
    assignedTo: "Sarah",
    progress: 70,
    dueDate: "2025-02-28",
  },
  {
    id: "t10",
    projectId: "p5",
    name: "Connect Analytics API",
    status: "Active",
    priority: "High",
    assignedTo: "Omar",
    progress: 50,
    dueDate: "2025-03-15",
  },
  {
    id: "t11",
    projectId: "p5",
    name: "Generate Reports",
    status: "Pending",
    priority: "Medium",
    assignedTo: "Ahmed",
    progress: 0,
    dueDate: "2025-03-30",
  },
];

