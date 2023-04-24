'use client';

import { guestUpdate, userUpdate } from '@/lib/api';
import { signIn } from 'next-auth/react';
import { useCallback, useState } from 'react';

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
    email: userSession.user.email,
    name: userSession.user.name,
    password: '',
    currentPassword: '',
  };

  const [formData, setFormData] = useState(initialFormData);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
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
        <div className="card-body items-center text-center">
          <h3 className="card-title text-primary text-3xl">
            Update your information
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">Name</span>
              </label>
              <input
                type="text"
                className="input input-sm input-bordered input-primary w-full max-w-xs"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
              />
            </div>
            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                className="input input-sm input-bordered input-primary w-full max-w-xs"
                name="email"
                value={formData.email}
                onChange={handleFormChange}
              />
              <label className="label">
                <span className="label-text">
                  {!userSession.user.isGuest && 'New '}Password
                </span>
              </label>
              <input
                type="password"
                className="input input-sm input-bordered input-primary w-full max-w-xs"
                name="password"
                value={formData.password}
                onChange={handleFormChange}
                minLength={4}
              />
              {!userSession.user.isGuest && (
                <>
                  <label className="label">
                    <span className="label-text">Current Password</span>
                  </label>
                  <input
                    type="password"
                    className="input input-sm input-bordered input-primary w-full max-w-xs"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleFormChange}
                    minLength={4}
                  />
                </>
              )}
            </div>
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
            <div className="my-3">
              <button
                className={`btn btn-sm btn-secondary ${
                  isUpdating && 'loading'
                }`}
              >
                {isUpdating ? 'Updating...' : 'Update'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateForm;
