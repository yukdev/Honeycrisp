'use client';
import { signOut } from 'next-auth/react';
import { useEffect } from 'react';

export default function LogoutPage() {
  useEffect(() => {
    const signoutAsync = async () => {
      await signOut({
        redirect: true,
        callbackUrl: '/',
      });
    };
    signoutAsync();
  }, []);

  return null;
}
