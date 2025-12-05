'use client';
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SideNav from "./Components/SideNav";
import { useState, useEffect } from "react";
import LoginForm from "./Components/LoginForm";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const [user, setUser] = useState<boolean | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("isLoggedIn");
    setUser(storedUser === "true");
  }, []);

  const handleUserChange = () => {
    const newState = !user;
    setUser(newState);
    localStorage.setItem("isLoggedIn", newState ? "true" : "false");
  };

  return (
    <html lang="ar" dir="rtl">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {user === null ? (
          // Loading state
          <div className="flex items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
          </div>
        ) : !user ? (
          // Login form
          <LoginForm handleUserChange={handleUserChange} />
        ) : (
          // Logged in layout
          <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
            <div className="w-full flex-none md:w-64">
              <SideNav handleUserChange={handleUserChange} />
            </div>
            <div className="flex-grow p-6 md:overflow-y-auto md:p-12">
              {children}
            </div>
          </div>
        )}
      </body>
    </html>
  );
}
