import { Open_Sans } from 'next/font/google';
import './globals.css';
import Header from './components/Header';

const openSans = Open_Sans({
  weight: ['400', '700'],
  subsets: ['latin'],
});

export const metadata = {
  title: 'Honeycrisp',
  description: 'Your user-friendly bill-splitting app',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={openSans.className}>
        <Header />
        <main className="flex justify-center min-h-screen mt-4">
          {children}
        </main>
      </body>
    </html>
  );
}
