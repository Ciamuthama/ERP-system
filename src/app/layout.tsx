
import type { Metadata } from "next";
import "./globals.css";
import ProtectedLayout from "@/app/protectedlayout"; 
import { Toaster } from "react-hot-toast";


export const metadata: Metadata = {
  title: "Sacco Dashboard",
  description: "Dashboard for Sacco",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  
  

  
  return (
    <html lang='en' suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ProtectedLayout>

        <Toaster position="top-center" reverseOrder={false} />
          {children}
        </ProtectedLayout>
      </body>
    </html>
  );
}
