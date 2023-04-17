import { getServerSession } from 'next-auth/next';
import { Open_Sans } from 'next/font/google';
import './globals.css';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { authOptions } from './api/auth/[...nextauth]/route';
import { Provider } from './providers';

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
  return (
    <html lang="en" data-theme="forest">
      <body className={openSans.className}>
        <Provider>
          {/* @ts-expect-error Server Component */}
          <NavBar />
          <main className="flex justify-center">{children}</main>
          <Footer />
        </Provider>
      </body>
    </html>
  );
}
