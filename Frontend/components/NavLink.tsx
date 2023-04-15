'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavLinkProps {
  label: string;
  path: string;
}

export default function NavLink({ label, path }: NavLinkProps) {
  const pathName = usePathname();

  const isActive = pathName === path;
  return (
    <Link
      className={`${isActive && 'bg-primary-focus'} mx-3 text-white`}
      href={path}
    >
      {label}
    </Link>
  );
}
