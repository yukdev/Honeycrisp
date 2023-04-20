'use client';
import { signOut } from 'next-auth/react';
import React from 'react';

const LogOutButton = () => {
  return (
    <li>
      <a
        onClick={() =>
          signOut({
            redirect: true,
            callbackUrl: '/',
          })
        }
        className="mx-3"
      >
        Sign out
      </a>
    </li>
  );
};

export default LogOutButton;
