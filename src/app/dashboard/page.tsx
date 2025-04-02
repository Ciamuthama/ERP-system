"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getSaccoSettings } from "@/lib/actions";


export default function Dashboard({}) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [saccoSettings, setSaccoSettings] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      if (Date.now() > parsedUser.expiry) {
        localStorage.removeItem("user");
        router.push("/login");
      } else {
        setUser(parsedUser);
      }
    } else {
      router.push("/login");
    }
  }, [router]);
  useEffect(() => {
    getSaccoSettings().then((data) => setSaccoSettings(data));
  }, []);


  if (!user) return  <p className="loading"></p>;

  const logout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };


  return (
    <div className="p-6">
      
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p>Welcome, {user.name}</p>
      <Button onClick={logout}>Logout</Button>
    </div>
  );
}
