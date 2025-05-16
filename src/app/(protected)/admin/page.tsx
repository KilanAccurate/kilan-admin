import { DashboardShell } from "@/components/dashboard-shell";
import { redirect } from 'next/navigation';

export default function AdminDashboardPage() {
    redirect('/admin/users');
    return <DashboardShell />;
}
