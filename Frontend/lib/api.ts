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

interface Item {
  name: string;
  price: number;
  quantity: number;
}

interface NewSession {
  ownerId: string;
  ownerName: string;
  name: string;
  items: Item[];
  tax: number;
  tip: number;
}

interface EatenItems {
  items: string[];
  userId: string;
  userName: string;
  sessionId: string;
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

export const getSessions = async (userId: string) =>
  fetcher({ url: `users/${userId}/sessions`, method: 'GET' });

export const getSession = async (id: string) =>
  fetcher({ url: `sessions/${id}`, method: 'GET' });

export const createSession = async (newSession: NewSession) => {
  try {
    const resp = await fetcher({
      url: 'sessions',
      method: 'POST',
      body: newSession,
    });
    return resp;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
};

export const eatSessionItems = async (eatenItems: EatenItems) => {
  const { items, userId, userName, sessionId } = eatenItems;
  try {
    const resp = await fetcher({
      url: `sessions/${sessionId}/eat`,
      method: 'PUT',
      body: { userId, userName, items },
    });
    return resp;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
};

export const togglePaid = async (sessionId: string, userId: string) => {
  try {
    const resp = await fetcher({
      url: `sessions/${sessionId}/paid`,
      method: 'POST',
      body: { userId },
    });
    return resp;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
};

export const finalizeSession = async (sessionId: string, userId: string) => {
  try {
    const resp = await fetcher({
      url: `sessions/${sessionId}/finalize`,
      method: 'POST',
      body: { userId },
    });
    return resp;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
};

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

export const guestLogin = async (user: RegisterUser) => {
  try {
    const resp = await fetcher({
      url: 'users/guest-login',
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
