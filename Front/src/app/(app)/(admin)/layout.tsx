import "../globals.css";
import RoleGuard from '@/contexts/RoleGuard';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <RoleGuard allowedRoles={['ADMIN', 'ADMINMASTER']}>
        {children} 
    </RoleGuard>
  );
}