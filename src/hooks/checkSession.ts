"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export function useSessionMonitor() {
  const router = useRouter();
  const hasLoggedOut = useRef(false);


  useEffect(() => {
    const interval = setInterval(async () => {
      if (hasLoggedOut.current) return;

      try {
        const res = await fetch("/api/users/login/check", {
          cache: "no-store",
        });

        if (!res.ok) {
          hasLoggedOut.current = true;

          toast.error("⚠️ Your session was ended.");
          localStorage.removeItem("user");
          router.push("/login");
        }
      } catch (error) {
        console.error("Session check failed:", error);
      }
    }, 60000); // Polling every 60 seconds instead of 2

    return () => clearInterval(interval);
  }, [router]);
}
