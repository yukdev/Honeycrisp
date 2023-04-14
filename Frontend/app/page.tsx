import Link from 'next/link';
import React from 'react';

const HomePage = () => {
  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">Hey there.</h1>
          <p className="py-6">
            Welcome to Honeycrisp, your user-friendly bill-splitting app.
          </p>
          <Link href={'/sessions'}>
            <button className="btn btn-primary">My Sessions</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
