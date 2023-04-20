import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { getSessions } from '@/lib/api';
import Link from 'next/link';
import { UsersSession } from '@/lib/types';

const SessionsPage = async () => {
  const userSession = (await getServerSession(authOptions)) as any;
  const {
    user: { id: userId },
  } = userSession;

  const sessions = await getSessions(userId);

  const finalizedSessions = sessions.filter(
    (session: UsersSession) => session.finalized,
  );
  const unfinalizedSessions = sessions.filter(
    (session: UsersSession) => !session.finalized,
  );

  return (
    <div className="container min-h-screen">
      {unfinalizedSessions.length > 0 && (
        <h1 className="text-3xl font-bold text-base-content text-center my-5">
          Pending Sessions
        </h1>
      )}
      <div className="flex flex-col w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {unfinalizedSessions.map((session: UsersSession) => (
            <Link
              href={`/sessions/${session.id}`}
              key={session.id}
              className="hover:shadow-xl transition duration-300 ease-in-out transform hover:-translate-y-1"
            >
              <div className="card w-96 bg-warning text-warning-content">
                <div className="card-body">
                  <h2 className="card-title">{session.name}</h2>
                  <p className="text-warning-content   mt-2">
                    Owner: {session.ownerName}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="text-lg font-bold">
                      Bill: ${session.bill ?? 'N/A'}
                    </div>
                    <div className="card-actions">
                      <button className="btn no-animation">View</button>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        {unfinalizedSessions.length > 0 && finalizedSessions.length > 0 && (
          <div className="divider my-8"></div>
        )}
        {finalizedSessions.length > 0 && (
          <h1 className="text-3xl font-bold text-base-content text-center mb-5">
            Finalized Sessions
          </h1>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {finalizedSessions.map((session: UsersSession) => (
            <Link
              href={`/sessions/${session.id}`}
              key={session.id}
              className="hover:shadow-xl transition duration-300 ease-in-out transform hover:-translate-y-1"
            >
              <div className="card w-96 bg-success text-success-content">
                <div className="card-body">
                  <h2 className="card-title">{session.name}</h2>
                  <p className="text-success-content mt-2">
                    Owner: {session.ownerName}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="text-lg font-bold">
                      Bill: ${session.bill ?? 'N/A'}
                    </div>
                    <div className="card-actions">
                      <button className="btn no-animation">View</button>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export const revalidate = 60;

export default SessionsPage;
