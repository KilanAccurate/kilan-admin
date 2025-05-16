"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export function AdminPanel() {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <DashboardHeader />
                {/* <DashboardShell /> */}
            </SidebarInset>
        </SidebarProvider>
    )
}
