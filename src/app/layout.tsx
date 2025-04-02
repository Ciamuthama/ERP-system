
import type { Metadata } from "next";
import "./globals.css";
import ProtectedLayout from "@/app/protectedlayout"; 

export const metadata: Metadata = {
  title: "Sacco Dashboard",
  description: "Dashboard for Sacco",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  

  
  return (
    <html lang='en' suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ProtectedLayout>
          {children}
        </ProtectedLayout>
      </body>
    </html>
  );
}
