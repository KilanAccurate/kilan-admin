import { AdminPanel } from '@/components/admin-panel';
import ProtectedLayout from './protected-layout';
import { redirect } from 'next/navigation';

export default function HomePage() {
  redirect('/admin/users');
  return (
    <ProtectedLayout>
      <main>
        <AdminPanel />
      </main>
    </ProtectedLayout>
  );
}
