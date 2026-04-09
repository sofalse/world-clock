import { Analytics } from '@vercel/analytics/next';

import { auth } from '@/auth';
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
  const session = await auth();

  return (
    <html lang="en">
      <body>
        <AuthProvider session={session}>{children}</AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
