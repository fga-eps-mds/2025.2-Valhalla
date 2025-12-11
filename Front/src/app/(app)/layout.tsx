import "../globals.css";
import RoleGuard from '../../contexts/RoleGuard';
import Navbar from "@/components/secao/navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <RoleGuard allowedRoles={['COMUM', 'ADMIN', 'ADMINMASTER']}>
      <Navbar />

      <main className="flex-1 w-full pt-16 bg-branco">
        {children} 
      </main>
    </RoleGuard>
  );
}
