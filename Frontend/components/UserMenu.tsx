'use client';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import React from 'react';
import NavLink from './NavLink';
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
    <>
      <li>
        <NavLink label="Profile" path={`/users/${userSession.user.id}`} />
      </li>
      <li>
        <a
          className="text-lg mx-3"
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
    </>
  );
};

export default UserMenu;
