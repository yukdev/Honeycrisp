'use client';
import { signOut } from 'next-auth/react';
import React from 'react';
import NavLink from './NavBarLink';

interface NavBarUserMenuProps {
  userSession: {
    user: {
      id: string;
      name: string;
      email: string;
      isGuest: boolean;
      isDemo: boolean;
    };
  };
}

const NavBarUserMenu = ({ userSession }: NavBarUserMenuProps) => {
  return (
    <>
      {!userSession.user.isDemo && (
        <li>
          <NavLink label="Profile" path={`/users/${userSession.user.id}`} />
        </li>
      )}
      <li>
        <a
          className="text-md md:text-lg mx-3"
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

export default NavBarUserMenu;
