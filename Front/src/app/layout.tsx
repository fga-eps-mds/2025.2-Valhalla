import type { Metadata } from "next";
import { Geist, Merriweather, Geist_Mono, Lato } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../contexts/AuthContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "Guardioes",
  description: "Guardiões da Universidade",
};


export const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["700"],
  style:["normal"],
  variable: "--fonte-primaria",
  });

export const lato = Lato({
  subsets: ["latin"],
  weight: ["400","700"],
  style:["normal"],
  variable: "--fonte-secundaria",
  });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body
        className={`${merriweather.variable} ${lato.variable} antialiased`}
        
      >
        <AuthProvider>
        {children}
        </AuthProvider>
      </body>
    </html>
  );
}
