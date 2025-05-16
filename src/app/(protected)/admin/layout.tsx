import { AppSidebar } from "@/components/app-sidebar";
import { DashboardHeader } from "@/components/dashboard-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

// app/(protected)/admin/layout.tsx
export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <DashboardHeader />
                {children} {/* This is where dynamic content like DashboardShell, Users, etc. will render */}
            </SidebarInset>
        </SidebarProvider>
    );
}
