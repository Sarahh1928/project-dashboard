import { Task as TaskType, tasks } from "./mockData";

// Fetch tasks by project ID
export const fetchTasksByProjectId = async (projectId: string) => {
  console.log("Fetching tasks for project ID:", projectId);
  const projectTasks = tasks.filter((t) => t.projectId === projectId);
  return new Promise<typeof projectTasks>((resolve) =>
    setTimeout(() => resolve(projectTasks), 300)
  );
};

// Add a new task
// Add a new task
export const addTask = async (newTask: TaskType): Promise<TaskType> => {
  console.log("Adding new task:", newTask);
  tasks.push(newTask);
  return new Promise<TaskType>((resolve) => setTimeout(() => resolve(newTask), 300));
};


// Update a task
export const updateTask = async (
  taskId: string,
  payload: Partial<TaskType>
): Promise<TaskType | null> => {
  const index = tasks.findIndex((t) => t.id === taskId);
  if (index === -1) return null;

  const updatedTask: TaskType = {
    ...tasks[index],
    ...payload,
    status: payload.status as TaskType["status"],       // cast status
    priority: payload.priority as TaskType["priority"], // cast priority
  };

  tasks[index] = updatedTask;

  return new Promise((resolve) =>
    setTimeout(() => resolve(updatedTask), 300)
  );
};

// Delete a task
export const deleteTask = async (taskId: string) => {
  const index = tasks.findIndex((t) => t.id === taskId);
  if (index !== -1) {
    tasks.splice(index, 1);
  }
  return new Promise((resolve) => setTimeout(() => resolve(true), 300));
};
