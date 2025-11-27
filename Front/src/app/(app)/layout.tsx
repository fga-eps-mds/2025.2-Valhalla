import "../globals.css";
import RoleGuard from '../../contexts/RoleGuard';
import Navbar from "@/components/navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <RoleGuard allowedRoles={['COMUM', 'ADMIN', 'ADMINMASTER']}>
      <Navbar />
        {children} 
    </RoleGuard>
  );
}
