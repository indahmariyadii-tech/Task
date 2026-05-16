import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://task-gxnvo7qw4-indahmariyadii-techs-projects.vercel.app'),
  title: {
    default: "TaskVibe - Premium Task Manager",
    template: "%s | TaskVibe"
  },
  description: "Experience professional productivity with TaskVibe. Manage tasks, notes, and focus with a high-end, distraction-free environment.",
  keywords: ["productivity", "task manager", "focus timer", "notes app", "saas", "dashboard", "minimalist", "premium"],
  authors: [{ name: "Indah Mariyadi" }],
  creator: "Indah Mariyadi",
  themeColor: "#05070A",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://task-gxnvo7qw4-indahmariyadii-techs-projects.vercel.app",
    title: "TaskVibe - Premium Task Management System",
    description: "The ultimate platform for high-performers. Elevate your focus with TaskVibe.",
    siteName: "TaskVibe",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "TaskVibe Premium Dashboard Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TaskVibe - Professional Productivity",
    description: "Manage tasks with intelligence and style.",
    images: ["/og.png"],
    creator: "@indahmariyadi",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

import { Providers } from "@/components/Providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${inter.variable}`}>
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
