// app/NavLink.js
'use client';
import Link from 'next/link';
import { useSelectedLayoutSegment } from 'next/navigation';

interface NavLinkProps {
  label: string;
  path: string;
  targetSegment: string;
}

export default function NavLink({ label, path, targetSegment }: NavLinkProps) {
  const activeSegment = useSelectedLayoutSegment();

  const isActive = activeSegment === targetSegment;
  return (
    <Link
      className={`${isActive && 'bg-primary-focus'} mx-3 text-white`}
      href={path}
    >
      {label}
    </Link>
  );
}
