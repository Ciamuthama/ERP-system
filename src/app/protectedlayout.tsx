"use client";

import { useEffect, useState } from "react";
import LoginPage from "@/components/login"; 
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { useSessionMonitor } from "@/hooks/checkSession";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  useSessionMonitor()


  useEffect(() => {
    const checkAuth = async () => {
        try {
            const res = await fetch("/api/users/login/check", { cache: "no-store" });
            if (res.ok) {
                setIsAuthenticated(true);
            } else {
                localStorage.removeItem("user");
                setIsAuthenticated(false);
            }
        } catch (error) {
            console.error("Auth check failed:", error);
            setIsAuthenticated(false);
        }
    };

    checkAuth();

 
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);
  
   useEffect(() => {
    document.querySelector("body > nextjs-portal")?.remove();
 }, []);

  if (isAuthenticated === null) return  <p className="loading !h-screen"></p>;

  if (!isAuthenticated) return <LoginPage />;

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarTrigger />
      {children}
    </SidebarProvider>
  );
}
