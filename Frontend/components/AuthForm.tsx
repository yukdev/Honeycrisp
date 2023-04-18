'use client';

import { register } from '@/lib/api';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (mode === 'login') {
        const response = await signIn('login', {
          email: formData.email,
          password: formData.password,
          redirect: false,
          callbackUrl: '/',
        });

        if (response) {
          const { error, url } = response;
          if (error) {
            console.log(error);
            setError(error);
          }
          if (url) {
            router.push(url!);
            router.refresh();
          }
        }
      } else {
        const { name, email, password } = formData;
        try {
          const newUser = await register({ name, email, password });

          if (newUser) {
            await signIn('login', {
              email: email,
              password: password,
              redirect: true,
              callbackUrl: '/',
            });
          }
        } catch (error) {
          if (error instanceof Error) {
            setError(error.message);
          }
        }
      }
    },
    [formData, mode, router],
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
