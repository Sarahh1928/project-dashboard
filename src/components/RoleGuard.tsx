"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RoleGuard({ allowedRoles, children }: any) {
  const role = useSelector((state: RootState) => state.auth.role);
  const router = useRouter();

  useEffect(() => {
    if (!role || !allowedRoles.includes(role)) {
      router.push("/login");
    }
  }, [role, allowedRoles, router]);

  if (!role || !allowedRoles.includes(role)) return null;

  return children;
}
