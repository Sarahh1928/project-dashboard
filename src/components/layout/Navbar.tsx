"use client";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { logout } from "@/redux/authSlice";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Navbar() {
  const role = useSelector((state: RootState) => state.auth.role);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  return (
    <header className="w-full bg-white shadow-md sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo / Title */}
          <div className="flex-shrink-0">
            <h1 className="text-xl font-bold text-gray-800">
              <Link
              href="/dashboard"
              className="text-gray-700 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
            >
              Dashboard
            </Link>
            </h1>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            
            <span className="text-gray-500">Role: {role || "User"}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              Logout
            </Button>
          </div>

          {/* Mobile Menu Placeholder */}
          <div className="md:hidden">
            <Button
              variant="outline"
              size="sm"
              onClick={() => alert("Mobile menu coming soon")}
            >
              Menu
            </Button>
          </div>
        </div>
      </nav>
    </header>
  );
}
