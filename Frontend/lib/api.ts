const BASE_URL = 'http://localhost:3001/';

interface RequestProps {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  json?: boolean;
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

export const getSessions = () => fetcher({ url: 'sessions', method: 'GET' });

export const getSession = (id: string) =>
  fetcher({ url: `sessions/${id}`, method: 'GET' });
