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

const NavBar = () => {
  return (
    <div className="navbar bg-primary text-primary-content sticky top-0 z-50">
      <div className="flex-1">
        <Link href="/" className="btn btn-ghost normal-case text-xl">
          Honeycrisp
        </Link>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          {links.map((link) => (
            <li key={link.label}>
              <NavLink {...link} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default NavBar;
