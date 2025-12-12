"use client";

import "./globals.css";
import { ReactNode } from "react";
import { Provider, useSelector } from "react-redux";
import { store, RootState } from "@/redux/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Navbar from "@/components/layout/Navbar";

const queryClient = new QueryClient();

function LayoutWrapper({ children }: { children: ReactNode }) {
  const role = useSelector((state: RootState) => state.auth.role);

  return (
    <div className="flex min-h-screen">
      <div className="flex-1 flex flex-col min-h-screen">
        {role && <Navbar />}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 min-h-screen">
        <Provider store={store}>
          <QueryClientProvider client={queryClient}>
            <LayoutWrapper>{children}</LayoutWrapper>
          </QueryClientProvider>
        </Provider>
      </body>
    </html>
  );
}
