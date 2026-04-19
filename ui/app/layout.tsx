import type { Metadata } from "next";
import { Geist, Geist_Mono,Inter } from "next/font/google";
import "./globals.css";
import {MSWProvider} from "@/app/msw-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Skip Booking Flow - QA Assessment',
    description: 'Waste skip booking flow for QA assessment purposes',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body>
      <MSWProvider>
          {children}
      </MSWProvider>
      </body>
    </html>
  );
}
