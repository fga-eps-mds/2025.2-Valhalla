import type { Metadata } from "next";
import {Merriweather, Lato } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../contexts/AuthContext";
import "./globals.css";
import Footer from "@/components/footer";
import { Toaster } from "sonner";

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
      <body className={`${merriweather.variable} ${lato.variable} antialiased flex flex-col min-h-screen`} 
      >
        <AuthProvider>

        <main className="flex-1 w-full">
          {children}
        </main>
        
        <footer> <Footer /> </footer>

        </AuthProvider>

          <Toaster 
            richColors        // Deixa o sucesso verde e o erro vermelho
            position="top-right" // Posição (pode ser top-center, bottom-right, etc)
            expand={true}     // (Opcional) Expande ao passar o mouse
          />
      </body>
    </html>
  );
}
