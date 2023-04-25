'use client';

import { v4 as uuid } from 'uuid';
import { guestLogin } from '@/lib/api';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaExclamationTriangle } from 'react-icons/fa';

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

  const handleGuestNameInput = (event: React.ChangeEvent<HTMLInputElement>) => {
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
        <div className="alert alert-error shadow-lg my-3">
          <div>
            <FaExclamationTriangle />
            <span>{error}</span>
          </div>
        </div>
      )}
      {showGuestForm ? (
        <form onSubmit={(event) => handleGuestLogin(event)} className="flex">
          <input
            type="text"
            placeholder="Enter your name"
            onChange={handleGuestNameInput}
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
