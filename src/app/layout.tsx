"use client"; // Add this line

import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import React from 'react'; // Import React for useEffect

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

// Removed metadata export as this is a Client Component
// export const metadata: Metadata = {
//   title: 'ResuTrack - Track Your Resumes',
//   description: 'Easily track and manage your resume submissions and validate resume links with AI.',
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Effect to set initial theme based on localStorage or system preference
  React.useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (storedTheme === 'dark' || (!storedTheme && prefersDark)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <html lang="en" suppressHydrationWarning={true}> {/* Added suppressHydrationWarning to html as well */}
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`} suppressHydrationWarning={true}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
