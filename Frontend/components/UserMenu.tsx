'use client';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import React from 'react';
import { FaBars } from 'react-icons/fa';

interface UserMenuProps {
  userSession: {
    user: {
      id: string;
      name: string;
      email: string;
      isGuest: boolean;
    };
  };
}

const UserMenu = ({ userSession }: UserMenuProps) => {
  return (
    <li tabIndex={0}>
      <a className="text-lg">
        {`${userSession.user.name}${
          userSession.user.isGuest ? ' (Guest)' : ''
        }`}
        <FaBars />
      </a>
      <ul className="p-2 bg-base-100 text-base-content">
        <li>
          <Link href={`users/${userSession.user.id}`}>Profile</Link>
        </li>
        <li>
          <a
            onClick={() =>
              signOut({
                redirect: true,
                callbackUrl: '/',
              })
            }
          >
            Sign out
          </a>
        </li>
      </ul>
    </li>
  );
};

export default UserMenu;
