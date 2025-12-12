"use client";

import ProjectFilters from "@/components/dashboard/ProjectFilters";
import ProjectTable from "@/components/dashboard/ProjectTable";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import RoleGuard from "@/components/RoleGuard";
import { useState } from "react";
import { users } from "@/services/mockData";

export default function DashboardPage() {
  const role = useSelector((state: RootState) => state.auth.role);
  
  const [search, setSearch] = useState(""); // lift search state here
  const [statusFilter, setStatusFilter] = useState(""); // optional extra filter
  const [priorityFilter, setPriorityFilter] = useState("");

  return (
    <RoleGuard allowedRoles={["Admin", "ProjectManager", "Developer"]}>
      <div className="p-6 space-y-6 max-w-6xl mx-auto">

        <h1 className="text-3xl font-semibold">Project Dashboard</h1>

        
        <ProjectFilters
          search={search}
          onSearchChange={setSearch}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          priorityFilter={priorityFilter}
          onPriorityFilterChange={setPriorityFilter}
          users={users.map(u => u.name)}
        />

        
        <ProjectTable
          userRole={role}
          search={search}
          statusFilter={statusFilter}
          priorityFilter={priorityFilter}
        />
      </div>
    </RoleGuard>
  );
}
