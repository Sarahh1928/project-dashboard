"use client";

import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import useSWR, { mutate } from "swr";
import { useRouter } from "next/navigation";


import { RootState } from "@/redux/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { deleteProject, fetchProjectById, updateProject } from "@/services/projectService";
import { fetchTasksByProjectId, updateTask, addTask, deleteTask } from "@/services/taskService";
import { Project as ProjectType, Task as TaskType, users } from "@/services/mockData";

import EditProjectModal from "@/components/dashboard/EditProjectModal";
import EditTaskModal from "@/components/projects/EditTaskModal";
import ProgressChart from "@/components/projects/ProgressChart";
/* ----------------------------- Hooks (S + D) ------------------------------ */

function useProject(id?: string) {
  return useSWR<ProjectType | null>(
    id ? ["project", id] : null,
    () => fetchProjectById(id!)
  );
}
export function useProjectTasks(projectId?: string) {
  const { data: tasks } = useSWR<TaskType[]>(
    projectId ? ["projectTasks", projectId] : null,
    async (key: [string, string]) => {
      const [, id] = key;
      const tasks = await fetchTasksByProjectId(id);
      return tasks.map(t => ({
        ...t,
        status: t.status as TaskType["status"],
        priority: t.priority as TaskType["priority"],
      }));
    }
  );

  useEffect(() => {
    if (!projectId) return;

    const ws = new WebSocket("ws://localhost:3001"); // your socket server
    ws.onopen = () => console.log("Connected to WS");
    ws.onmessage = (msg) => {
      const event = JSON.parse(msg.data);
      if (event.projectId === projectId) {
        // event could be { type: 'update-task', task }
        if (event.type === "update-task") {
          mutate(["projectTasks", projectId], (prev: TaskType[] = []) =>
            prev.map(t => (t.id === event.task.id ? event.task : t))
          );
        }
        if (event.type === "add-task") {
          mutate(["projectTasks", projectId], (prev: TaskType[] = []) => [...prev, event.task]);
        }
        if (event.type === "delete-task") {
          mutate(["projectTasks", projectId], (prev: TaskType[] = []) =>
            prev.filter(t => t.id !== event.taskId)
          );
        }
      }
    };

    return () => ws.close();
  }, [projectId]);

  return { tasks };
}






/* ----------------------------- UI Components ------------------------------ */

function ProjectHeader({
  project,
  canEdit,
  canDelete,
  onEdit,
}: {
  project: ProjectType;
  canEdit: boolean;
  canDelete: boolean;
  onEdit?: () => void;
}) {
  const router = useRouter();
  return (
    <header className="flex justify-between items-center">
      <h1 className="text-3xl font-bold">{project.name}</h1>

      <div className="flex gap-3">
        {canEdit && <Button onClick={onEdit}>Edit Project</Button>}
        {canDelete && (
          <Button
            variant="destructive"
            onClick={async () => {
              if (!confirm("Are you sure you want to delete this project?")) return;

              try {
                await deleteProject(project.id); // call your service
                // Remove project from SWR cache
                mutate("projects"); // or mutate(["project", project.id]) if needed
                // Redirect back to dashboard after deletion
                router.push("/dashboard");
              } catch (err) {
                console.error(err);
                alert("Failed to delete project.");
              }
            }}
          >
            Delete
          </Button>
        )}

      </div>
    </header>
  );
}


function ProjectInfo({ project }: { project: ProjectType }) {
  return (
    <Card className="shadow-md border border-gray-200 rounded-lg">
      <CardContent className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
          {/* Left column: Description & Status */}
          <div className="flex-1 space-y-3">
            <p className="text-gray-700 text-sm">
              <strong>Description:</strong> {project.description}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${project.status === "Active"
                  ? "bg-green-100 text-green-800"
                  : project.status === "Pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-gray-100 text-gray-700"
                  }`}
              >
                {project.status}
              </span>
            </p>


            {/* Bottom section: Key Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-gray-700">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-500">Start Date</span>
                <span className="text-gray-900">{project.startDate}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-500">End Date</span>
                <span className="text-gray-900">{project.endDate}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-500">Budget</span>
                <span className="text-gray-900">${project.budget}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-500">Progress</span>
                <span className="text-gray-900">{project.progress}%</span>
              </div>
            </div>
          </div>

        </div>
      </CardContent>
    </Card>
  );
}



function TasksSection({
  tasks,
  canEditTasks,
  canDeleteTasks,
  canAddTasks,
  projectId,
}: {
  tasks: TaskType[];
  canEditTasks: boolean;
  canDeleteTasks: boolean;
  canAddTasks: boolean;
  projectId: string;
}) {
  const [editingTask, setEditingTask] = useState<TaskType | null>(null);
  const [addingTask, setAddingTask] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [assignedFilter, setAssignedFilter] = useState("");

  const filteredTasks = tasks.filter(task =>
    task.name.toLowerCase().includes(search.toLowerCase()) &&
    (statusFilter ? task.status === statusFilter : true) &&
    (priorityFilter ? task.priority === priorityFilter : true) &&
    (assignedFilter ? task.assignedTo === assignedFilter : true)
  );

  const emptyTask: TaskType = {
    id: "",
    projectId,
    name: "",
    status: "Pending",
    priority: "Medium",
    assignedTo: "",
    progress: 0,
    dueDate: new Date().toISOString().slice(0, 10),
  };

  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);

  const toggleTaskSelection = (taskId: string) => {
    setSelectedTasks(prev =>
      prev.includes(taskId)
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  const updateSelectedTasks = async (payload: Partial<TaskType>) => {
    if (!projectId || !canEditTasks) return;

    const updatedTasks = await Promise.all(
      selectedTasks.map(id => updateTask(id, payload))
    );

    mutate<TaskType[]>(
      ["projectTasks", projectId],
      (tasks: TaskType[] = []) =>
        tasks.map(t => updatedTasks.find(u => u!.id === t.id) || t),
      false
    );

    setSelectedTasks([]);
  };

  return (
    <>
      <Card className="border border-gray-200 shadow-sm rounded-xl">
        <CardContent className="p-6 space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Tasks</h2>
            {canAddTasks && (
              <Button onClick={() => setAddingTask(true)}>
                + Add Task
              </Button>
            )}
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <input
              placeholder="Search tasks..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="border rounded-md px-3 py-2 text-sm"
            />
            <select className="border rounded-md px-3 py-2 text-sm" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
            </select>
            <select className="border rounded-md px-3 py-2 text-sm" value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)}>
              <option value="">All Priority</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
            <select className="border rounded-md px-3 py-2 text-sm" value={assignedFilter} onChange={e => setAssignedFilter(e.target.value)}>
              <option value="">All Users</option>
              {users.map(u => (
                <option key={u.name} value={u.name}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>

          {/* Task List */}
          {filteredTasks.length === 0 ? (
            <p className="text-gray-500 text-center py-6">
              No tasks match your filters.
            </p>
          ) : (
            <ul className="space-y-3">
              {filteredTasks.map(task => (
                <li
                  key={task.id}
                  className="border rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50 transition"
                >
                  {/* Left */}
                  <div className="flex items-start gap-3 flex-1">
                    {canEditTasks && (
                      <input
                        type="checkbox"
                        checked={selectedTasks.includes(task.id)}
                        onChange={() => toggleTaskSelection(task.id)}
                        className="mt-1"
                      />
                    )}

                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold text-gray-900">
                          {task.name}
                        </p>
                        <span className="text-xs px-2 py-1 rounded bg-gray-100">
                          {task.status}
                        </span>
                        <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700">
                          {task.priority}
                        </span>
                      </div>

                      <p className="text-sm text-gray-500">
                        Assigned to: {task.assignedTo || "—"}
                      </p>

                      {/* Progress */}
                      <div className="flex items-center gap-4 m-0">
                        <div className="w-24 h-24">
                          <ProgressChart task={task} />
                        </div>

                        <div className="text-sm text-gray-600">
                          <p className="font-medium text-gray-800">
                            {task.progress}% Completed
                          </p>
                          <p className="text-xs">
                            Due: {task.dueDate}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  {(canEditTasks || canDeleteTasks) && (
                    <div className="flex gap-2">
                      {canEditTasks && (
                        <Button size="sm" onClick={() => setEditingTask(task)}>
                          Edit
                        </Button>
                      )}
                      {canDeleteTasks && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={async () => {
                            await deleteTask(task.id);
                            mutate(
                              ["projectTasks", projectId],
                              (tasks: TaskType[] = []) =>
                                tasks.filter(t => t.id !== task.id),
                              false
                            );
                          }}
                        >
                          Delete
                        </Button>
                      )}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {canEditTasks && selectedTasks.length > 0 && (
        <div className="flex gap-2 mt-3">
          <Button onClick={() => updateSelectedTasks({ status: "Completed" })}>
            Mark Completed
          </Button>
          <Button onClick={() => updateSelectedTasks({ status: "Active" })}>
            Mark Active
          </Button>
        </div>
      )}

      {/* Modals */}
      {(editingTask || addingTask) && (
        <EditTaskModal
          task={editingTask ?? emptyTask}
          users={users.map(u => u.name)}
          onClose={() => {
            setEditingTask(null);
            setAddingTask(false);
          }}
          onUpdate={async (newTask) => {
            if (addingTask) {
              newTask.id = `t${Date.now()}`;
              const addedTask = await addTask(newTask);
              mutate(
                ["projectTasks", projectId],
                (tasks: TaskType[] = []) => [...tasks, addedTask],
                false
              );
              setAddingTask(false);
            } else if (editingTask) {
              await updateTask(editingTask.id, newTask);
              mutate(
                ["projectTasks", projectId],
                (tasks: TaskType[] = []) =>
                  tasks.map(t => (t.id === newTask.id ? newTask : t)),
                false
              );
              setEditingTask(null);
            }
          }}
        />
      )}
    </>
  );
}






/* ------------------------------- Page ------------------------------------ */

export default function ProjectDetailsPage() {
  const { id } = useParams();
  const role = useSelector((state: RootState) => state.auth.role);

  const { data: projectData, error: projectError } = useProject(id as string);
  const { tasks } = useProjectTasks(id as string);

  const [project, setProject] = useState<ProjectType | null>(null);
  const [editingProject, setEditingProject] = useState(false);

  // Sync SWR project data to local state
  useEffect(() => {
    if (projectData) setProject(projectData);
  }, [projectData]);


  if (!id) return <p className="p-6 text-red-600">No project ID provided.</p>;
  if (!project && !projectError) return <p className="p-6 text-lg">Loading project...</p>;
  if (!project && projectError) return <p className="p-6 text-red-600">Project not found.</p>;

  const canEditProject = role === "Admin" || role === "ProjectManager";
  const canDeleteProject = role === "Admin";
  const canEditTasks = role === "Admin" || role === "ProjectManager" || role === "Developer";
  const canDeleteTasks = role === "Admin" || role === "ProjectManager";
  const canAddTasks = role === "Admin" || role === "ProjectManager";

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {project && (
        <>
          <ProjectHeader
            project={project}
            canEdit={canEditProject}
            canDelete={canDeleteProject}
            onEdit={() => setEditingProject(true)}
          />
          <ProjectInfo project={project} />
        </>
      )}


      {editingProject && project && (
        <EditProjectModal
          project={project}
          onClose={() => setEditingProject(false)}
          onUpdate={(updatedProject: any) => {
            setProject(updatedProject); // update local state
            mutate(["project", project.id], updatedProject, false); // update SWR
          }}
        />
      )}

      <TasksSection
        tasks={tasks ?? []}
        canEditTasks={canEditTasks}
        canDeleteTasks={canDeleteTasks}
        canAddTasks={canAddTasks}
        projectId={project!.id}
      />
    </div>
  );
}

