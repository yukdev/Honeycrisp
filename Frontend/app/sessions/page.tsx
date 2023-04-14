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
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold text-center mb-8">Sessions</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {sessions.map((session: Session) => (
          <Link
            href={`/sessions/${session.id}`}
            key={session.id}
            className="bg-white rounded-lg shadow-md p-2 md:p-4 hover:shadow-xl transition duration-300 ease-in-out transform hover:-translate-y-1 block text-center"
          >
            <div className="text-black">
              <h2 className="text-2xl font-bold mb-1">{session.name}</h2>
              <p className="text-sm text-gray-500 font-semibold mb-1">
                Payer: {session.ownerName}
              </p>
              <p
                className={`text-sm font-semibold ${
                  session.bill ? 'text-green-500' : 'text-red-500'
                }`}
              >
                Bill: {session.bill ? session.bill : 'Pending'}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export const revalidate = 60;

export default SessionsPage;
