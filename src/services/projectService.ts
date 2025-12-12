import { projects as rawProjects, Project } from "./mockData";

// Ensure projects is typed as Project[]
const projects: Project[] = rawProjects;

// Fetch all projects (with optional params for filtering/pagination)
interface FetchProjectsParams {
  page?: number;
  sort?: string;
  order?: string;
  search?: string;
  status?: string;
  priority?: string;
}

export const fetchProjects = async ({
  page = 1,
  sort = "name",
  order = "asc",
  search = "",
  status = "",
  priority = "",
}: FetchProjectsParams) => {
  let filtered = projects;

  if (search) {
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );
  }
  if (status) filtered = filtered.filter(p => p.status === status);
  if (priority) filtered = filtered.filter(p => p.priority === priority);

  // Sorting
  filtered.sort((a, b) => {
    const valA = a[sort as keyof typeof a];
    const valB = b[sort as keyof typeof b];

    if (valA < valB) return order === "asc" ? -1 : 1;
    if (valA > valB) return order === "asc" ? 1 : -1;
    return 0;
  });

  const limit = 2;
  const total = filtered.length;
  const totalPages = Math.ceil(total / limit);
  const data = filtered.slice((page - 1) * limit, page * limit);

  return { data, total, page, totalPages };
};



// Fetch a single project by ID
export const fetchProjectById = async (id: string): Promise<Project | null> => {
  const project = projects.find((p) => p.id === id) || null;

  console.log("fetchProjectById called with id:", id, "-> returns:", project);
  return new Promise<Project | null>((resolve) => setTimeout(() => resolve(project), 300));
};

// Update a project (mock)
export const updateProject = async (id: string, payload: Partial<Project>) => {
  const index = projects.findIndex((p) => p.id === id);
  if (index !== -1) {
    projects[index] = { ...projects[index], ...payload };
  }
  return new Promise<Project | null>((resolve) => setTimeout(() => resolve(projects[index]), 300));
};
// services/projectService.ts
export const deleteProject = async (id: string) => {
  const index = projects.findIndex(p => p.id === id);
  if (index !== -1) projects.splice(index, 1);
  return new Promise<boolean>(resolve => setTimeout(() => resolve(true), 300));
};

