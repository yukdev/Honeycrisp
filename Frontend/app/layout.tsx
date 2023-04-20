import { Open_Sans } from 'next/font/google';
import './globals.css';
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]/route';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import React from 'react';
import Provider from '@/components/Provider';

interface RootLayoutProps {
  children: React.ReactNode;
}

const openSans = Open_Sans({
  weight: ['400', '700'],
  subsets: ['latin'],
});

export const metadata = {
  title: 'Honeycrisp',
  description: 'Your user-friendly bill-splitting app',
};

export default async function RootLayout({ children }: RootLayoutProps) {
  const userSession = await getServerSession(authOptions);

  return (
    <html lang="en" data-theme="forest">
      <body className={openSans.className}>
        <Provider>
          {/* @ts-expect-error Server Component */}
          <NavBar userSession={userSession} />
          <main className="flex justify-center bg-base-200">{children}</main>
          <Footer />
        </Provider>
      </body>
    </html>
  );
}
