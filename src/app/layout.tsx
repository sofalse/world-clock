import { Analytics } from '@vercel/analytics/next';

import AuthProvider from '@/components/AuthProvider';

import type { Metadata } from 'next';

import './globals.css';

export const metadata: Metadata = {
  title: 'World Clock',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
