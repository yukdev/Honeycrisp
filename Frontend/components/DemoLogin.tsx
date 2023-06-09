'use client';

import { v4 as uuid } from 'uuid';
import { demoLogin } from '@/lib/api';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';

const DemoLogin = () => {
  const [showDemoForm, setShowDemoForm] = useState(false);
  const [demoName, setDemoName] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDemoClick = () => {
    setShowDemoForm(true);
  };

  const handleDemoNameInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDemoName(event.target.value);
  };

  const handleGuestLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      setIsSubmitting(true);
      const guestEmail = `${uuid().slice(0, 8)}@guest.com`;
      const guestPassword = uuid().slice(0, 8);

      const response = await demoLogin({
        name: demoName,
        email: guestEmail,
        password: guestPassword,
      });

      if (response) {
        await signIn('login', {
          email: guestEmail,
          password: guestPassword,
          redirect: true,
          callbackUrl: '/demo',
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center">
      {error && (
        <div className="alert alert-error shadow-lg justify-center mb-2">
          <div>
            <FaExclamationTriangle />
            <span>{error}</span>
          </div>
        </div>
      )}
      {showDemoForm ? (
        <form onSubmit={(event) => handleGuestLogin(event)} className="flex">
          {!isSubmitting && (
            <input
              type="text"
              placeholder="What is your name?"
              onChange={handleDemoNameInput}
              className="input input-bordered input-accent text-center max-w-xs mr-2"
            />
          )}
          <button
            type="submit"
            className={`btn btn-accent ${isSubmitting && 'loading'}`}
          >
            {isSubmitting ? 'Setting up demo...' : 'View'}
          </button>
        </form>
      ) : (
        <button
          className="btn btn-secondary w-1/2 flex-shrink-0 ml-2"
          onClick={handleDemoClick}
        >
          View Demo
        </button>
      )}
    </div>
  );
};

export default DemoLogin;
