"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "@/redux/store";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const router = useRouter();
  const role = useSelector((state: RootState) => state.auth.role);

  useEffect(() => {
    if (role) {
      router.push("/dashboard"); // logged-in users go straight to dashboard
    }
  }, [role, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to Project Dashboard</h1>
      <p className="text-lg text-gray-700 mb-6">
        Track your projects, tasks, and team progress efficiently.
      </p>
      <Button onClick={() => router.push("/login")} className="px-6 py-3">
        Login
      </Button>
    </div>
  );
}
