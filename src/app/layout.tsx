import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LaunchDesk | Production-Ready AI SaaS",
  description: "The all-in-one platform for teams to generate, manage, and scale their AI-driven content strategy.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: "#6366F1",
          colorBackground: "#0A0F1E",
          colorText: "#FFFFFF",
          colorTextSecondary: "rgb(148, 163, 184)",
          colorInputBackground: "#111827",
          colorInputText: "#FFFFFF",
          colorAlpha: "1",
        },
      }}
    >
      <html lang="en" className="dark" suppressHydrationWarning>
        <body className={`${inter.className} antialiased bg-background text-foreground`} suppressHydrationWarning>
          {children}
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
