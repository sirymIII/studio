'use client';
import { useState, useEffect } from 'react';
import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseClientProvider } from '@/firebase';
import { useIsMobile } from '@/hooks/use-mobile';

// The metadata is still handled by Next.js at build time and on the server.
export const metadata: Metadata = {
  title: 'TourNaija - Discover Nigeria',
  description: 'Your AI-powered guide to tourism in Nigeria.',
};

/**
 * A client component that safely applies a class to the body tag
 * only after the initial render to avoid hydration mismatches.
 */
function BodyClassManager() {
  const isMobile = useIsMobile();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      if (isMobile) {
        document.body.classList.add('mobile_mode');
      } else {
        document.body.classList.remove('mobile_mode');
      }
    }
  }, [isMobile, isMounted]);

  // This component doesn't render anything itself.
  return null;
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&family=Source+Code+Pro:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={cn(
          'min-h-screen bg-background font-body antialiased'
        )}
      >
        <FirebaseClientProvider>
          <BodyClassManager />
          {children}
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
