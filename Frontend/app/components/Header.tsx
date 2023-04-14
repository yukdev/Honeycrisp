'use client';
import Link from 'next/link';
import NavLink from './NavLink';

const links = [
  {
    label: 'About',
    path: '/about',
    targetSegment: 'about',
  },
  {
    label: 'Sessions',
    path: '/sessions',
    targetSegment: 'sessions',
  },
];

const Header = () => {
  return (
    <header className="bg-gray-900 py-3 sticky top-0">
      <div className="flex justify-center items-center">
        <Link href="/" className="text-white font-bold text-xl">
          Honeycrisp
        </Link>
      </div>
      <div className="flex justify-center items-center">
        {links.map((link) => (
          <NavLink key={link.label} {...link} />
        ))}
      </div>
    </header>
  );
};

export default Header;
