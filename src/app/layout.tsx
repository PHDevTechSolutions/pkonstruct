import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { FirebaseProvider } from "@/components/firebase-provider";
import { AuthProvider } from "@/hooks/use-auth";
import { LayoutWrapper } from "@/components/layout-wrapper";
import { DynamicHead } from "@/components/dynamic-head";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PKonstruct | Building Excellence Since 2005",
  description: "PKonstruct is a leading construction company specializing in residential, commercial, and industrial projects. 500+ projects completed with 100% client satisfaction.",
  keywords: ["construction", "builder", "contractor", "residential", "commercial", "industrial", "renovation"],
  authors: [{ name: "PKonstruct" }],
  openGraph: {
    title: "PKonstruct | Building Excellence Since 2005",
    description: "Leading construction company specializing in residential, commercial, and industrial projects.",
    type: "website",
    locale: "en_US",
    siteName: "PKonstruct",
  },
  twitter: {
    card: "summary_large_image",
    title: "PKonstruct | Building Excellence Since 2005",
    description: "Leading construction company specializing in residential, commercial, and industrial projects.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col">
        <DynamicHead />
        <FirebaseProvider>
          <AuthProvider>
            <LayoutWrapper>
              {children}
            </LayoutWrapper>
          </AuthProvider>
        </FirebaseProvider>
      </body>
    </html>
  );
}
