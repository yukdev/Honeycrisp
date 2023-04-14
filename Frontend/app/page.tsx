import Link from 'next/link';
import React from 'react';

const HomePage = () => {
  return (
    <div>
      <h1>Welcome to Honeycrisp!</h1>
      <ul>
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/about">About</Link>
        </li>
      </ul>
    </div>
  );
};

export default HomePage;
