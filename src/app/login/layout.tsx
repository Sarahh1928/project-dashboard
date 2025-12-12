import { ReactNode } from "react";

export default function LoginLayout({ children }: { children: ReactNode }) {
  return (
      <div className="bg-gray-100 min-h-screen flex justify-center items-center">
        {children}
      </div>
  );
}
