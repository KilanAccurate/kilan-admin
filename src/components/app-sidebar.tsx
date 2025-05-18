"use client"

import { BarChart3, FileText, Home, LayoutDashboard, LogOutIcon, Package, PaperclipIcon, Settings, SettingsIcon, ShoppingCart, TimerIcon, Users, WorkflowIcon } from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { UserNav } from "@/components/user-nav"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar"
import { useAuth } from "@/app/context/AuthContext"
import { Button } from "./ui/button"
import { usePathname } from "next/navigation";

// Sample navigation data
const navItems = [
    {
        title: "Akun",
        icon: Users,
        href: "/admin/users",
        isActive: true,
    },
    {
        title: "Absensi",
        icon: TimerIcon,
        href: "/admin/absensi",
    },
    {
        title: "Lembur",
        icon: WorkflowIcon,
        href: "/admin/lembur",
    },
    {
        title: "Cuti",
        icon: PaperclipIcon,
        href: "/admin/cuti",
    },
    {
        title: "Setting",
        icon: SettingsIcon,
        href: "/admin/settings",
    },

]


export function AppSidebar() {
    const { logout, isLoggedIn, isLoading: isAuthLoading } = useAuth();

    const handleLogout = async () => {
        logout()
    };

    return (
        <Sidebar>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            {/* <UserNav/> */}
                            {/* <a href="#">
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                    <Package className="size-4" />
                                </div>
                                <div className="flex flex-col gap-0.5 leading-none">
                                    <span className="font-semibold">Admin Panel</span>
                                    <span className="text-muted-foreground">v1.0.0</span>
                                </div>
                            </a> */}
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={navItems} />
            </SidebarContent>
            <SidebarFooter>
                <Button onClick={handleLogout} variant="secondary"><LogOutIcon /> Logout</Button>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
