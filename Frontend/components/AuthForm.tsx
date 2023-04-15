'use client';

import { register } from '@/lib/api';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useCallback, useState } from 'react';

const registerContent = {
  linkUrl: '/login',
  linkText: 'Already have an account?',
  header: 'Create a new account',
  subheader: 'Please enter your details',
  buttonText: 'Register',
};

const loginContent = {
  linkUrl: '/register',
  linkText: "Don't have an account?",
  header: 'Welcome back!',
  subheader: 'Please login to your account',
  buttonText: 'Login',
};

const initialFormData = {
  email: '',
  password: '',
  name: '',
};

const Authform = ({ mode }: { mode: 'register' | 'login' }) => {
  const [formData, setFormData] = useState(initialFormData);
  const [error, setError] = useState('');

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (mode === 'login') {
        await signIn('credentials', {
          email: formData.email,
          password: formData.password,
          redirect: true,
          callbackUrl: '/',
        });
      }
    },
    [formData, mode],
  );

  const handleFormChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    },
    [],
  );

  const formContent = mode === 'register' ? registerContent : loginContent;

  return (
    <div className="container min-h-screen flex justify-center items-center">
      <div className="card w-96 bg-neutral text-neutral-content">
        <div className="card-body items-center text-center">
          <h3 className="card-title text-primary">{formContent.header}</h3>
          <p>{formContent.subheader}</p>
          <form onSubmit={handleSubmit}>
            {mode === 'register' && (
              <div className="form-control w-full max-w-xs">
                <label className="label">
                  <span className="label-text">Name</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered input-primary w-full max-w-xs"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                />
              </div>
            )}
            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                className="input input-bordered input-primary w-full max-w-xs"
                name="email"
                value={formData.email}
                onChange={handleFormChange}
              />
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                className="input input-bordered input-primary w-full max-w-xs"
                name="password"
                value={formData.password}
                onChange={handleFormChange}
              />
            </div>
            <div className="my-3">
              <button className="btn btn-sm btn-secondary">
                {formContent.buttonText}
              </button>
            </div>
            <div>
              <Link href={formContent.linkUrl} className="text-accent">
                {formContent.linkText}
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Authform;
