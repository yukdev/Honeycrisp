import { Open_Sans } from 'next/font/google';
import './globals.css';
import Header from './components/NavBar';
import NavBar from './components/NavBar';
import Footer from './components/Footer';

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
    <html lang="en" data-theme="forest">
      <body className={openSans.className}>
        <NavBar />
        <main className="flex justify-center">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
