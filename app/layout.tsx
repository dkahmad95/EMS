import "./globals.css";
import {ReactQueryProvider} from "./ReactQueryProvider";
import {LoadingProvider} from "./LoadingContext";
import localFont from "next/font/local";

const geistSans = localFont({
  src: "../fonts/Geist.ttf",
  variable: "--font-geist-sans",
});

const geistMono = localFont({
  src: "../fonts/GeistMono.ttf",
  variable: "--font-geist-mono",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <ReactQueryProvider>
        <LoadingProvider>
          <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>{children}</body>
        </LoadingProvider>
      </ReactQueryProvider>
    </html>
  );
}
