'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavLinkProps {
  label: string;
  path: string;
  center?: boolean;
}

const NavLink = ({ label, path, center }: NavLinkProps) => {
  const pathName = usePathname();

  const isActive = pathName === path;
  return center ? (
    <Link
      className={`${
        isActive && 'bg-primary-focus'
      } btn btn-ghost normal-case text-xl`}
      href={path}
    >
      {label}
    </Link>
  ) : (
    <Link
      className={`${isActive && 'bg-primary-focus'} text-lg mx-3`}
      href={path}
    >
      {label}
    </Link>
  );
};

export default NavLink;
