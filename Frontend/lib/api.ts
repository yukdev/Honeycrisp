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
    body: json ? JSON.stringify(body) : body,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    const { error } = JSON.parse(await res.text());
    throw new Error(error);
  }

  return json ? await res.json() : await res.text();
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
    return resp;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
};

export const login = async (user: LoginUser) => {
  try {
    const resp = await fetcher({
      url: 'users/login',
      method: 'POST',
      body: user,
    });

    return resp;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
};
