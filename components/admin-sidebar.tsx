"use client"

import React, { useEffect, useState } from "react"
import { BarChart3, Package, ShoppingCart, Users, Settings, Home, Package2, LogOut } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { createClient } from "@/utils/supabase/client"
import { getUserProfile } from "@/utils/profile"
import { ThemeSwitcher } from "./theme-switcher"
import { SignOut } from "./singOut"
import { signOutAction } from "@/app/actions"
import { Button } from "./ui/button"


const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
    },
    {
      title: "Analytics",
      url: "/dashboard/analytics",
      icon: BarChart3,
    },
    {
      title: "Orders",
      url: "/dashboard/orders",
      icon: ShoppingCart,
    },
    {
      title: "Products",
      url: "/dashboard/products",
      icon: Package,
    },
    {
      title: "Users",
      url: "/dashboard/users",
      icon: Users,
    }
  ],
}

export function AdminSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

  const [user, setUser] = useState<any>(null);
  useEffect(() => {
    const fetchUser = async () => {
      const supabase = await createClient();

      const { data: { user } } = await supabase.auth.getUser();

      if (user?.id) {
        const profile = await getUserProfile(user.id);
        setUser(profile);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("cart");
    signOutAction();
    setUser(null);
  };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                {/* <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Package2 className="size-4" />
                </div> */}
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold text-base">Admin Dashboard</span>
                  <span className="truncate font-semibold text-xs">KEEBHOUSE</span>
                </div>
                <ThemeSwitcher />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.navMain.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
          <Avatar className="h-8 w-8 rounded-lg">
            <AvatarImage src={user?.avatar_url} alt="Admin" />
            <AvatarFallback className="rounded-lg">AD</AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">{user?.full_name}</span>
            <span className="truncate text-xs">{user?.email}</span>
          </div>
        </div>
        <Button
          onClick={handleLogout}
          className="w-full flex justify-between items-center gap-2"
          variant={"outline"}
        >
          Logout <LogOut className="size-3" />
        </Button>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
