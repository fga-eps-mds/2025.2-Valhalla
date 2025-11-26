import "../globals.css";
import RoleGuard from '../../contexts/RoleGuard';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <RoleGuard allowedRoles={['COMUM', 'ADMIN', 'ADMINMASTER']}>
    <html lang="pt-br">
      <body>
        {children} 
      </body>
    </html>
    </RoleGuard>
  );
}
