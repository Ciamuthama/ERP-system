"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  name: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function LoginPage() {
  const [error, setError] = useState("");
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      password: "",
    },
  });

  const login = async (values: { name: string; password: string }) => {
    const res = await fetch("/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
      credentials: "include",
    });
  
    if (res.status === 403) {
      const confirmEndSession = window.confirm(
        "Someone is already logged in with this username. Do you want to end that session and continue?"
      );
      if (!confirmEndSession) return;
  
      
      const usersRes = await fetch("/api/users", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
  
      if (!usersRes.ok) {
        setError("Unable to retrieve users. Try again.");
        return;
      }
  
      const allUsers = await usersRes.json();
      const targetUser = allUsers.find((user: any) => user.name === values.name);
    
      
      
      
  
      if (!targetUser || !targetUser.session_token) {
        setError("Could not locate the session for this user.");
        return;
      }
  
      const logoutRes = await fetch(`/api/users/logout/${targetUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionToken: targetUser.session_token }),
      });
  
      if (!logoutRes.ok) {
        setError("Failed to end session. Please try again.");
        return;
      }
  
      return login(values);
    }
  
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Invalid login credentials");
      return;
    }
  
    const userData = await res.json();
    const expiry = Date.now() + 60 * 60 * 1000;
    const userToStore = { name: userData.user.name, id: userData.user.id, session:userData.user.session_token, expiry };
    localStorage.setItem("user", JSON.stringify(userToStore));
    window.dispatchEvent(new Event("storage"));
  
    router.push("/dashboard");
  };
  
  

  const onSubmit = async (values: { name: string; password: string }) => {
    setError("");
    await login(values);
  };

  return (
    <div className="flex h-screen justify-center items-center bg-gray-100 relative z-[1000] w-full">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-center mb-4">Login</h2>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input {...field} type="text" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
