import { getServerSession } from 'next-auth';
import Link from 'next/link';
import React from 'react';
import { authOptions } from './api/auth/[...nextauth]/route';

const HomePage = async () => {
  const session = await getServerSession(authOptions);

  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">Hey there.</h1>
          <p className="py-6">
            Welcome to Honeycrisp, your user-friendly bill-splitting app.
          </p>
          {session?.user ? (
            <Link href={'/sessions'}>
              <button className="btn btn-primary">My Sessions</button>
            </Link>
          ) : (
            <Link href={'/api/auth/signin'}>
              <button className="btn btn-primary">Sign In</button>
            </Link>
          )}
          <div></div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
