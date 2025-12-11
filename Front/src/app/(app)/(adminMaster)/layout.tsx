import RoleGuard from '@/contexts/RoleGuard';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <RoleGuard allowedRoles={['ADMINMASTER']}>
        {children} 
    </RoleGuard>
  );
}