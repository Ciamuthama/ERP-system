"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


// Define the FetchedUser type
type FetchedUser = {
  name: string;
  profile?: string;
  fullName?: string;
  email?: string;
  phone?: string;
};

export default function Dashboard({}) {

  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [fetchedUser, setFetchedUser] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return;

    const parsedUser = JSON.parse(storedUser);
    const timeLeft = parsedUser.expiry - Date.now();

    if (timeLeft <= 0) {
      handleLogout(parsedUser.id);
    } else {
      const timer = setTimeout(() => {
        handleLogout(parsedUser.id);
      }, timeLeft);

      return () => clearTimeout(timer);
    }

   
    

    async function handleLogout(id: string) {
      try {
        const res = await fetch(`/api/users/${id}`);
        const data = await res.json();

        await fetch(`/api/users/logout/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ session_token: data.session_token }),
        });

        localStorage.removeItem("user");
        router.push("/login");
      } catch (err) {
        console.error("Logout error:", err);
        localStorage.removeItem("user");
        router.push("/login");
      }
    }
  }, [router]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/users");
      const data = await response.json();
      setFetchedUser(data);

      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        const matchedUser = data.find(
          (fetched: FetchedUser) => fetched.name === parsedUser.name
        );
        if (matchedUser) {
          setUser(matchedUser);
        }
      }
    };
    fetchData();
  }, []);
  
  if (!user) return <p className="loading"></p>;

  return (
    <div className="p-6 w-full">
      <h1 className="text-3xl font-semibold mb-4">Welcome</h1>
      <div className="flex items-baseline w-full">
        <div>
          {fetchedUser.find((fetched) => fetched.name === user.name) ? (
            <div className="flex gap-4">
              <div>
                <Avatar className="w-32 h-32">
                  <AvatarImage src={user.profile} className="object-center" />
                  <AvatarFallback>{user.name}</AvatarFallback>
                </Avatar>
              </div>
              <div>
                <p className="font-semibold">Logged in As: {user.name}</p>
                <h4 className="font-semibold">Fullname: {user.fullName}</h4>
                <h4 className="font-semibold">Email: {user.email}</h4>
                <h4 className="font-semibold">Phone: {user.phone}</h4>
              </div>
            </div>
          ) : (
            <p>loading...</p>
          )}
        </div>
      </div>
    </div>
  );
}
