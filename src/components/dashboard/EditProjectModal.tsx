"use client";

import { updateProject } from "@/services/projectService";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function EditProjectModal({ project, onClose }: any) {
  const [progress, setProgress] = useState(project.progress);
  const [budget, setBudget] = useState(project.budget);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);

    await updateProject(project.id, {
      progress,
      budget,
    });

    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex justify-center items-center">
      <div className="bg-white p-6 rounded-xl w-96 shadow space-y-4">

        <h2 className="text-xl font-bold">Edit {project.name}</h2>

        <div>
          <label>Progress (%)</label>
          <Input
            type="number"
            value={progress}
            onChange={(e) => setProgress(e.target.value)}
          />
        </div>

        <div>
          <label>Budget ($)</label>
          <Input
            type="number"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
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
