import "../globals.css";
import RoleGuard from '../../contexts/RoleGuard';
import Navbar from "@/components/secao/navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <main className="flex-1 w-full pt-16 bg-gray-50">{children}</main>
    </>
  );
}
