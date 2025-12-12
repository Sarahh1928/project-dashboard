"use client";

import { useState } from "react";
import { Project as ProjectType } from "@/services/mockData";
import { updateProject } from "@/services/projectService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mutate } from "swr";

interface Props {
  project: ProjectType;
  onClose: () => void;
  onUpdate?: (updated: ProjectType) => void;
}

export default function EditProjectModal({ project, onClose, onUpdate }: Props) {
  const [progress, setProgress] = useState(project.progress);
  const [budget, setBudget] = useState(project.budget);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
  setLoading(true);
  try {
    const updated = await updateProject(project.id, { progress, budget });
    mutate(["project", project.id], updated, false); // update SWR cache
if (updated && onUpdate) onUpdate(updated); // only call if not null
    onClose(); // close modal
  } catch (err) {
    console.error(err);
    alert("Failed to update project");
  } finally {
    setLoading(false);
  }
};



  return (
    <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl w-96 shadow space-y-4">
        <h2 className="text-xl font-bold">Edit {project.name}</h2>

        <div>
          <label>Progress (%)</label>
          <Input
            type="number"
            value={progress}
            onChange={(e) => setProgress(Number(e.target.value))}
          />
        </div>

        <div>
          <label>Budget ($)</label>
          <Input
            type="number"
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
          />
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleUpdate} disabled={loading}>
            {loading ? "Updating..." : "Save"}
          </Button>
        </div>
      </div>
    </div>
  );
}
