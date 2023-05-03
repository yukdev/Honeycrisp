import {
  EatenItems,
  EditItem,
  GuestUser,
  LoginUser,
  NewSession,
  RegisterUser,
  UpdateUser,
} from './types';

interface RequestProps {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  json?: boolean;
}

const BASE_URL = process.env.BASE_URL;

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
    throw typeof error === 'string'
      ? new Error(error)
      : new Error(error.message);
  }

  return json ? await res.json() : await res.text();
};

export const getSessions = async (userId: string) => {
  return await fetcher({ url: `users/${userId}/sessions`, method: 'GET' });
};

export const getSession = async (id: string) => {
  return await fetcher({ url: `sessions/${id}`, method: 'GET' });
};

export const createSession = async (newSession: NewSession) => {
  return await fetcher({
    url: 'sessions',
    method: 'POST',
    body: newSession,
  });
};

export const eatSessionItems = async (eatenItems: EatenItems) => {
  const { items, userId, userName, sessionId } = eatenItems;
  return await fetcher({
    url: `sessions/${sessionId}/eat`,
    method: 'PUT',
    body: { userId, userName, items },
  });
};

export const editItem = async (item: EditItem) => {
  const { id, name, price } = item;
  return await fetcher({
    url: `items/${id}`,
    method: 'PUT',
    body: { name, price },
  });
};

export const togglePaid = async (sessionId: string, userId: string) => {
  return await fetcher({
    url: `sessions/${sessionId}/paid`,
    method: 'POST',
    body: { userId },
  });
};

export const finalizeSession = async (sessionId: string, userId: string) => {
  return await fetcher({
    url: `sessions/${sessionId}/finalize`,
    method: 'POST',
    body: { userId },
  });
};

export const unfinalizeSession = async (sessionId: string, userId: string) => {
  return await fetcher({
    url: `sessions/${sessionId}/unfinalize`,
    method: 'POST',
    body: { userId },
  });
};

export const register = async (user: RegisterUser) => {
  return await fetcher({
    url: 'users/register',
    method: 'POST',
    body: user,
  });
};

export const login = async (user: LoginUser) => {
  return await fetcher({
    url: 'users/login',
    method: 'POST',
    body: user,
  });
};

export const guestLogin = async (user: GuestUser) => {
  return await fetcher({
    url: 'users/guest-login',
    method: 'POST',
    body: user,
  });
};

export const guestUpdate = async (userId: string, user: RegisterUser) => {
  return await fetcher({
    url: `users/${userId}`,
    method: 'PUT',
    body: { ...user, isGuest: true },
  });
};

export const userUpdate = async (userId: string, user: UpdateUser) => {
  return await fetcher({
    url: `users/${userId}`,
    method: 'PUT',
    body: user,
  });
};
