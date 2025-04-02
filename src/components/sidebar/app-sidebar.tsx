import { Home,  Settings, BookUser, FileStack, WalletCards,Landmark,PrinterCheck    } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

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
    </Sidebar>
  );
}
