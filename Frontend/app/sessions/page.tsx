'use client';
import { fetcher } from '@/lib/api';
import Link from 'next/link';

interface Item {
  id: string;
  name: string;
  price: number;
  createdAt: string;
  updatedAt: string;
  sessionId: string;
}

interface Session {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  ownerId: string;
  ownerName: string;
  finalized: boolean;
  tax: number;
  tip: number;
  bill?: number;
  items: Item[];
}

const SessionsPage = async () => {
  const sessions = await fetcher({
    url: 'sessions',
    method: 'GET',
  });

  return (
    <div className="container min-h-screen">
      <h1 className="text-3xl font-bold text-center my-5">Sessions</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {sessions.map((session: Session) => (
          <Link
            href={`/sessions/${session.id}`}
            key={session.id}
            className="hover:shadow-xl transition duration-300 ease-in-out transform hover:-translate-y-1"
          >
            <div className="card w-96 bg-secondary text-secondary-content">
              <div className="card-body">
                <h2 className="card-title">{session.name}</h2>
                <p>Host: {session.ownerName}</p>
                <div className="card-actions justify-end">
                  <button className="btn">
                    Bill: {session.bill ? session.bill : 'Pending'}
                  </button>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export const revalidate = 60;

export default SessionsPage;
