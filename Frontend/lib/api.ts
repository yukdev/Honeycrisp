import { setCookie } from 'nookies';
import { config } from '@/lib/config';

const { COOKIE_NAME } = config;

const BASE_URL = 'http://localhost:3001/';
interface RequestProps {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  json?: boolean;
}

interface LoginUser {
  email: string;
  password: string;
}

interface RegisterUser extends LoginUser {
  name: string;
}

export const fetcher = async ({
  url,
  method,
  body,
  json = true,
}: RequestProps) => {
  const res = await fetch(`${BASE_URL}${url}`, {
    method,
    body: body && JSON.stringify(body),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error('API Error');
  }

  if (json) {
    const data = await res.json();
    return data;
  }
};

export const getSessions = async () =>
  fetcher({ url: 'sessions', method: 'GET' });

export const getSession = async (id: string) =>
  fetcher({ url: `sessions/${id}`, method: 'GET' });

export const register = async (user: RegisterUser) => {
  try {
    const resp = await fetcher({
      url: 'users/register',
      method: 'POST',
      body: user,
    });

    const { token } = resp;
    return token;
  } catch (error) {
    console.log(error);
    throw new Error('Could not register the user');
  }
};

export const login = async (user: LoginUser) => {
  try {
    const resp = await fetcher({
      url: 'users/login',
      method: 'POST',
      body: user,
    });

    const { token } = resp;
    return token;
  } catch (error) {
    console.log(error);
    throw new Error('Could not login the user');
  }
};
