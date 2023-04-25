'use client';

import { v4 as uuid } from 'uuid';
import { guestLogin } from '@/lib/api';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface GuestLoginProps {
  id: string;
}

const GuestLogin = ({ id }: GuestLoginProps) => {
  const router = useRouter();
  const [showGuestForm, setShowGuestForm] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleJoinAsGuestClick = () => {
    setShowGuestForm(true);
  };

  const handleGuestNameChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setGuestName(event.target.value);
  };

  const handleGuestLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      setIsSubmitting(true);
      const guestEmail = `${uuid().slice(0, 8)}@guest.com`;
      const guestPassword = uuid().slice(0, 8);

      const newUser = await guestLogin({
        name: guestName,
        email: guestEmail,
        password: guestPassword,
      });

      if (newUser) {
        await signIn('login', {
          email: guestEmail,
          password: guestPassword,
          redirect: true,
          callbackUrl: `/sessions/${id}`,
        });
      }
      router.refresh();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center my-2">
      {error && (
        <div className="alert alert-error shadow-lg mt-3  ">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current flex-shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{error}</span>
          </div>
        </div>
      )}
      {showGuestForm ? (
        <form onSubmit={(event) => handleGuestLogin(event)} className="flex">
          <input
            type="text"
            placeholder="Enter your name"
            onChange={handleGuestNameChange}
            className="input input-sm input-bordered input-accent text-center max-w-xs mr-2"
          />
          <button
            type="submit"
            className={`btn btn-sm btn-accent ${isSubmitting && 'loading'}`}
          >
            {isSubmitting ? 'Joining...' : 'Join'}
          </button>
        </form>
      ) : (
        <button
          className="btn btn-accent btn-sm ml-2"
          onClick={handleJoinAsGuestClick}
        >
          Join as guest
        </button>
      )}
    </div>
  );
};

export default GuestLogin;
