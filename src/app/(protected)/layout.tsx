import ProtectedLayout from '@/app/protected-layout';

export default function ProtectedSegmentLayout({ children }: { children: React.ReactNode }) {
    return <ProtectedLayout>{children}</ProtectedLayout>;
}
