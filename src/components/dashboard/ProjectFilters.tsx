"use client";

import { Input } from "@/components/ui/input";

interface Props {
  search: string;
  onSearchChange: (val: string) => void;
  statusFilter: string;
  onStatusFilterChange: (val: string) => void;
  priorityFilter: string;
  onPriorityFilterChange: (val: string) => void;
  users: string[];
}

export default function ProjectFilters({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  priorityFilter,
  onPriorityFilterChange,
  users,
}: Props) {
  return (
    <div className="flex gap-4 mb-4 flex-wrap">
      <Input
        placeholder="Search projects..."
        className="w-64"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
      />

      <select
        value={statusFilter}
        onChange={(e) => onStatusFilterChange(e.target.value)}
        className="border rounded p-2"
      >
        <option value="">All Statuses</option>
        <option value="Active">Active</option>
        <option value="Pending">Pending</option>
        <option value="Completed">Completed</option>
      </select>

      <select
        value={priorityFilter}
        onChange={(e) => onPriorityFilterChange(e.target.value)}
        className="border rounded p-2"
      >
        <option value="">All Priorities</option>
        <option value="High">High</option>
        <option value="Medium">Medium</option>
        <option value="Low">Low</option>
      </select>

    </div>
  );
}
