"use client";

import { Home,  Settings, BookUser, FileStack, WalletCards,Landmark,PrinterCheck    } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";

// Menu items.
const items = [
  {
    title: "Home",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Member Manager",
    url: "/member",
    icon: BookUser,
  },
  {
    title: "Register",
    url: "/register",
    icon: FileStack ,
  },
  {
    title: "Debit/Credit Note",
    url: "/balance",
    icon: WalletCards,
  },
  {
    title: "Chart of Account",
    url: "/cfa",
    icon: Landmark,
  },
  {
    title: "Statement",
    url: "/statement",
    icon: PrinterCheck,
  },
  {
    title: "Settings",
    url: "/setting",
    icon: Settings,
  },
];

export function AppSidebar() {
    const router = useRouter();
    const [sessionToken, setSessionToken] = useState("");

   
    useEffect(() => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user?.id) {
      fetch(`/api/users/${user.id}`)
        .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch user data");
        }
        return res.json();
        })
        .then((data) => {
        setSessionToken(data.session_token);
        })
        .catch((error) => {
        console.error("Error fetching user data:", error);
        });
      }
    }, []);

  
    const logout = async () => {
      const user = JSON.parse(localStorage.getItem("user"));

     
        try {
          const response = await fetch("/api/users/logout/" + user.id, {
            method: "PUT",
            body: JSON.stringify({ sessionToken }),
            headers: { "Content-Type": "application/json" },
          });

          if (!response.ok) {
            const errorData = await response.json();
            console.error("Logout failed:", errorData);
          }
        } catch (error) {
          console.error("Logout failed", error);
        }
      

      localStorage.removeItem("user");
      router.push("/login");
    };

    return (
      <Sidebar collapsible="icon">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url}>
                        <item.icon className="!size-4.5" />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <Button onClick={logout}>Logout</Button>
        </SidebarFooter>
      </Sidebar>
    )
  }