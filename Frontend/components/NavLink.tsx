'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavLinkProps {
  label: string;
  path: string;
}

const NavLink = ({ label, path }: NavLinkProps) => {
  const pathName = usePathname();

  const isActive = pathName === path;
  return (
    <Link
      className={`${isActive && 'bg-primary-focus'} text-lg mx-3`}
      href={path}
    >
      {label}
    </Link>
  );
};

export default NavLink;
