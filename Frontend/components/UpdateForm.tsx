'use client';

import { guestUpdate, userUpdate } from '@/lib/api';
import { signIn } from 'next-auth/react';
import { useCallback, useState } from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';

interface UpdateFormProps {
  id: string;
  userSession: {
    user: {
      id: string;
      name: string;
      email: string;
      isGuest: boolean;
    };
  };
}

const UpdateForm = ({ id, userSession }: UpdateFormProps) => {
  const initialFormData = {
    email: userSession.user.isGuest ? '' : userSession.user.email,
    name: userSession.user.name,
    password: '',
    currentPassword: '',
  };

  const [formData, setFormData] = useState(initialFormData);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState('');

  const isGuest = userSession.user.isGuest;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      setError('');
      setIsUpdating(true);
      const updateData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      };

      await (userSession.user.isGuest
        ? guestUpdate(id, updateData)
        : userUpdate(id, {
            ...updateData,
            currentPassword: formData.currentPassword,
          }));

      await signIn('login', {
        email: formData.email,
        password: formData.password || formData.currentPassword,
        redirect: true,
        callbackUrl: `/users/${id}`,
      });
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const handleFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
    <div className="container min-h-screen flex justify-center items-center">
      <div className="card w-96 bg-neutral text-neutral-content">
        <div className="card-body items-center flex flex-col">
          <h3 className="card-title text-3xl text-center">
            {isGuest ? 'Fill out' : 'Update'} your information
          </h3>
          <form onSubmit={handleSubmit} className="w-75">
            <div className="form-control w-full max-w-xs flex flex-col justify-center items-center">
              <label className="label flex justify-center items-center">
                <span className="label-text text-neutral-content">Name</span>
              </label>
              <input
                type="text"
                className="input input-sm input-bordered input-primary w-full max-w-xs text-center"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
              />
            </div>
            <div className="form-control w-full max-w-xs flex flex-col justify-center items-center">
              <label className="label flex justify-center items-center">
                <span className="label-text text-neutral-content">Email</span>
              </label>
              <input
                type="email"
                className="input input-sm input-bordered input-primary w-full max-w-xs text-center"
                name="email"
                value={formData.email}
                onChange={handleFormChange}
              />
              <label className="label flex justify-center items-center">
                <span className="label-text text-neutral-content">
                  {!userSession.user.isGuest && 'New '}Password
                </span>
              </label>
              <input
                type="password"
                className="input input-sm input-bordered input-primary w-full max-w-xs text-center"
                name="password"
                value={formData.password}
                onChange={handleFormChange}
                minLength={4}
              />
              {!isGuest && (
                <>
                  <label className="label flex justify-center items-center">
                    <span className="label-text text-neutral-content">
                      Current Password
                    </span>
                  </label>
                  <input
                    type="password"
                    className="input input-sm input-bordered input-primary w-full max-w-xs text-center"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleFormChange}
                    minLength={4}
                  />
                </>
              )}
            </div>
            {error && (
              <div className="alert alert-error shadow-lg mt-3">
                <div>
                  <FaExclamationTriangle />
                  <span>{error}</span>
                </div>
              </div>
            )}
            <div className="mt-5 flex justify-center">
              <button
                className={`btn btn-sm btn-secondary ${
                  isUpdating && 'loading'
                }`}
              >
                {isUpdating
                  ? userSession.user.isGuest
                    ? 'Migrating...'
                    : 'Updating...'
                  : userSession.user.isGuest
                  ? 'Migrate'
                  : 'Update'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateForm;
