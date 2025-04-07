"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LoginPage from "@/components/login"; 
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();


  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.expiry && Date.now() < parsedUser.expiry) {
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem("user");
          setIsAuthenticated(false);
          router.push("/login");
        }
      } else {
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
