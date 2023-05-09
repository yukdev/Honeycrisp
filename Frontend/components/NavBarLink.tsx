'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavBarLinkProps {
  label: string;
  path: string;
  emphasize?: boolean;
}

const NavBarLink = ({ label, path, emphasize }: NavBarLinkProps) => {
  const pathName = usePathname();

  const isActive = pathName === path;
  return emphasize ? (
    <Link
      className={`${
        isActive && 'bg-primary-focus'
      } btn btn-ghost normal-case text-lg md:text-xl`}
      href={path}
    >
      {label}
    </Link>
  ) : (
    <Link
      className={`${isActive && 'bg-primary-focus'} text-md md:text-lg mx-3`}
      href={path}
    >
      {label}
    </Link>
  );
};

export default NavBarLink;
