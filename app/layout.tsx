import "./globals.css";
import { Cairo } from "next/font/google";
import { ReactQueryProvider } from "./ReactQueryProvider";
import { LoadingProvider } from "./LoadingContext";
import { MuiProvider } from "./theme/MuiProvider";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cairo",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={cairo.variable}>
      <body className="font-sans antialiased">
        <MuiProvider>
          <ReactQueryProvider>
            <LoadingProvider>{children}</LoadingProvider>
          </ReactQueryProvider>
        </MuiProvider>
      </body>
    </html>
  );
}
