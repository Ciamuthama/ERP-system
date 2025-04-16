"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface User{
  name: string
}

export function useSessionMonitor() {
  const router = useRouter();
  const hasLoggedOut = useRef(false);


  useEffect(() => {
    const interval = setInterval(async () => {
      const storedUser = localStorage.getItem("user");
      if (!storedUser || hasLoggedOut.current) return;

      const parsedUser = JSON.parse(storedUser);
      const name = parsedUser?.name;

      try {
        const res = await fetch("/api/users", {
          headers: { "Content-Type": "application/json" },
        });

        const users = await res.json();
        const user = users.find((u: User) => u.name === name);

        if (!user || user.session_token === null) {
          hasLoggedOut.current = true;

          toast.error("⚠️ Your session was ended.");
          localStorage.removeItem("user");
          router.push("/login");
        }
      } catch (error) {
        console.error("Session check failed:", error);
      }
    }, 2000); 

    return () => clearInterval(interval);
  }, [router]);
}
