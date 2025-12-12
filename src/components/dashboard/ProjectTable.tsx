"use client";

import useSWR, { mutate } from "swr";
import { fetchProjects } from "@/services/projectService";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import EditProjectModal from "./EditProjectModal";
import { useRouter } from "next/navigation";

type SortColumn = "name" | "status" | "startDate" | "endDate" | "progress" | "budget";
type SortOrder = "asc" | "desc";

export default function ProjectTable({
  userRole,
  search,
  statusFilter,
  priorityFilter,
}: {
  userRole: string | null;
  search: string;
  statusFilter: string;
  priorityFilter: string;
}) {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [sortColumn, setSortColumn] = useState<SortColumn>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [editingProject, setEditingProject] = useState<any>(null);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, priorityFilter]);

  const swrKey = ["projects", page, sortColumn, sortOrder, search, statusFilter, priorityFilter];
  const { data, isLoading } = useSWR(
    swrKey,
    () =>
      fetchProjects({
        page,
        sort: sortColumn,
        order: sortOrder,
        search,
        status: statusFilter,
        priority: priorityFilter,
      })
  );

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
  };

  const renderSortArrow = (column: SortColumn) => {
    if (sortColumn !== column) return null;
    return sortOrder === "asc" ? " ↑" : " ↓";
  };

  const totalPages = data ? Math.ceil(data.total / 2) : 1;

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-10 bg-gray-200 animate-pulse rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="overflow-x-auto rounded-xl shadow bg-white border border-gray-200">
        <table className="w-full min-w-[700px] border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b">
              {["name", "status", "startDate", "endDate", "progress", "budget"].map((col) => (
                <th
                  key={col}
                  className="p-3 text-left text-sm font-semibold text-gray-700 cursor-pointer select-none"
                  onClick={() => handleSort(col as SortColumn)}
                >
                  {col.charAt(0).toUpperCase() + col.slice(1)}
                  {renderSortArrow(col as SortColumn)}
                </th>
              ))}
              <th className="p-3 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>

          <tbody>
            {data?.data?.map((project: any) => (
              <tr
                key={project.id}
                className="border-b hover:bg-gray-50 transition-colors"
              >
                <td className="p-3">{project.name}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded-full text-sm font-medium ${
                      project.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : project.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {project.status}
                  </span>
                </td>
                <td className="p-3">{project.startDate}</td>
                <td className="p-3">{project.endDate}</td>
                <td className="p-3">{project.progress}%</td>
                <td className="p-3">${project.budget}</td>
                <td className="p-3 flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => router.push(`/projects/${project.id}`)}
                  >
                    View
                  </Button>
                  {(userRole === "Admin" || userRole === "ProjectManager") && (
                    <Button
                      size="sm"
                      onClick={() => setEditingProject(project)}
                    >
                      Edit
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-2">
        <Button
          size="sm"
          disabled={page <= 1}
          onClick={() => setPage(page - 1)}
        >
          Previous
        </Button>
        <span className="text-sm font-medium">
          Page {page} / {totalPages}
        </span>
        <Button
          size="sm"
          disabled={page >= totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </Button>
      </div>

      {editingProject && (
        <EditProjectModal
          project={editingProject}
          onClose={() => {
            setEditingProject(null);
            mutate(swrKey);
          }}
        />
      )}
    </div>
  );
}
