import React from 'react';

export const metadata = {
  title: 'About Honeycrisp',
};

const AboutPage = () => {
  return (
    <div className="container min-h-screen flex flex-col justify-center">
      <h1 className="text-3xl font-bold text-center my-5 text-center">
        About Honeycrisp
      </h1>
      <p className="text-center">
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Repellat
        quibusdam dolore corporis asperiores, architecto commodi pariatur
        ducimus! Tenetur quos id, molestias perspiciatis ea unde soluta nisi
        placeat possimus rerum sapiente.
      </p>
    </div>
  );
};

export default AboutPage;
