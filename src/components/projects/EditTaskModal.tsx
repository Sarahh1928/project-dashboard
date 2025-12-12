"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Task as TaskType } from "@/services/mockData";
import { updateTask, addTask } from "@/services/taskService";
import { taskSchema } from "@/lib/zod-schemas";

interface Props {
  task: TaskType; 
  users: string[];
  onClose: () => void;
  onUpdate?: (updated: TaskType) => void;
}

type FormData = z.infer<typeof taskSchema>;

export default function EditTaskModal({ task, users, onClose, onUpdate }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      name: task.name,
      status: task.status,
      priority: task.priority,
      assignedTo: task.assignedTo,
      progress: task.progress,
      dueDate: task.dueDate,
    },
  });

  const onSubmit = async (data: FormData) => {
    let updatedTask: TaskType | null;
    if (task.id) {
      updatedTask = await updateTask(task.id, { ...task, ...data });
    } else {
      const newTask = { ...task, ...data, id: `t${Date.now()}` };
      updatedTask = await addTask(newTask);
    }
    if (updatedTask && onUpdate) onUpdate(updatedTask);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl w-96 shadow space-y-4">
        <h2 className="text-xl font-bold">{task.id ? "Edit Task" : "Add Task"}</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label>Task Name</label>
            <Input {...register("name")} />
            {errors.name && <p className="text-red-600 text-sm">{errors.name.message}</p>}
          </div>

          <div>
            <label>Status</label>
            <select {...register("status")} className="border rounded p-2 w-full">
              <option value="Pending">Pending</option>
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
            </select>
            {errors.status && <p className="text-red-600 text-sm">{errors.status.message}</p>}
          </div>

          <div>
            <label>Priority</label>
            <select {...register("priority")} className="border rounded p-2 w-full">
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
            {errors.priority && <p className="text-red-600 text-sm">{errors.priority.message}</p>}
          </div>

          <div>
            <label>Assign To</label>
            <select {...register("assignedTo")} className="border rounded p-2 w-full">
              {users.map(user => (
                <option key={user} value={user}>{user}</option>
              ))}
            </select>
            {errors.assignedTo && <p className="text-red-600 text-sm">{errors.assignedTo.message}</p>}
          </div>

          <div>
            <label>Progress (%)</label>
            <Input type="number" {...register("progress", { valueAsNumber: true })} />
            {errors.progress && <p className="text-red-600 text-sm">{errors.progress.message}</p>}
          </div>

          <div>
            <label>Due Date</label>
            <Input type="date" {...register("dueDate")} />
            {errors.dueDate && <p className="text-red-600 text-sm">{errors.dueDate.message}</p>}
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (task.id ? "Updating..." : "Adding...") : "Save"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
