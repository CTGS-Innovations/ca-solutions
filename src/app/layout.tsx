import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TicketProvider } from "@/context/ticket-context";
import { AuthProvider } from "@/context/auth-context";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Computer Ally - Computer Repair You Can Actually See",
  description:
    "Transparent computer repair with real-time status tracking. Drop off, scan your QR code, track every step, pick up with confidence.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-body antialiased`}>
        <AuthProvider>
          <TicketProvider>{children}</TicketProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
