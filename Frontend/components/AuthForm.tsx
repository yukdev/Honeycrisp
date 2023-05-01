'use client';

import { register } from '@/lib/api';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';

const registerContent = {
  linkUrl: '/login',
  linkText: 'Already have an account?',
  header: 'Create a new account',
  subheader: 'Please enter your details',
  buttonText: 'Register',
  buttonTextLoading: 'Registering...',
};

const loginContent = {
  linkUrl: '/register',
  linkText: "Don't have an account?",
  header: 'Welcome back!',
  subheader: 'Please login to your account',
  buttonText: 'Login',
  buttonTextLoading: 'Logging in...',
};

const initialFormData = {
  email: '',
  password: '',
  name: '',
};

const Authform = ({ mode }: { mode: 'register' | 'login' }) => {
  const [formData, setFormData] = useState(initialFormData);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setIsSubmitting(true);
      setError('');
      if (mode === 'login') {
        try {
          const response = await signIn('login', {
            email: formData.email,
            password: formData.password,
            redirect: false,
            callbackUrl: '/',
          });

          if (response) {
            const { error, url } = response;
            if (error) {
              setError(error);
            }
            if (url) {
              router.push(url!);
              router.refresh();
            }
          }
        } catch (error) {
          if (error instanceof Error) {
            setError(error.message);
          }
        } finally {
          setIsSubmitting(false);
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
        } finally {
          setIsSubmitting(false);
        }
      }
    },
    [formData, mode, router],
  );

  const handleFormChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.target;
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    },
    [],
  );

  const formContent = mode === 'register' ? registerContent : loginContent;

  return (
    <div className="container min-h-screen flex justify-center items-center">
      <div className="card w-96 bg-neutral text-neutral-content">
        <div className="card-body items-center text-center">
          <h3 className="card-title text-primary text-3xl">
            {formContent.header}
          </h3>
          <p>{formContent.subheader}</p>
          <form onSubmit={handleSubmit}>
            {mode === 'register' && (
              <div className="form-control w-full max-w-xs flex flex-col justify-center items-center">
                <label className="label">
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
            )}
            <div className="form-control w-full max-w-xs flex flex-col justify-center items-center">
              <label className="label">
                <span className="label-text text-neutral-content">Email</span>
              </label>
              <input
                type="email"
                className="input input-sm input-bordered input-primary w-full max-w-xs text-center"
                name="email"
                value={formData.email}
                onChange={handleFormChange}
              />
              <label className="label">
                <span className="label-text text-neutral-content">
                  Password
                </span>
              </label>
              <input
                type="password"
                className="input input-sm input-bordered input-primary w-full max-w-xs text-center"
                name="password"
                value={formData.password}
                onChange={handleFormChange}
              />
            </div>
            {error && (
              <div className="alert alert-error shadow-lg mt-3">
                <span>
                  <FaExclamationTriangle />
                  {error}
                </span>
              </div>
            )}
            <div className="mt-4">
              <button
                className={`btn btn-sm btn-secondary ${
                  isSubmitting && 'loading'
                }`}
              >
                {isSubmitting
                  ? formContent.buttonTextLoading
                  : formContent.buttonText}
              </button>
            </div>
            <div className="mt-3">
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
