import type { Metadata } from "next";
import "./globals.css";

import { Navbar } from "@/components/Navbar";
import { Providers } from "./providers";
import AuthProvider from "@/components/provider/authContext";

export const metadata: Metadata = {
  title: {
    default: "Liaqat Dev",
    template: "%s | Liaqat Dev",
  },
  description:
    "Liaqat Dev built with Next.js 16.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AuthProvider>
          <Providers>
            <Navbar />
            {children}
          </Providers>
        </AuthProvider>
      </body>
    </html>
  );
}
