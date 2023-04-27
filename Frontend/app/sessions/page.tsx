import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { getSessions } from '@/lib/api';
import Link from 'next/link';
import { Session } from '@/lib/types';

const SessionsPage = async () => {
  const userSession = (await getServerSession(authOptions)) as any;
  const {
    user: { id: userId },
  } = userSession;

  let sessions = (await getSessions(userId)) as Session[];
  sessions.sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt));

  const finalizedSessions = sessions.filter((session) => session.finalized);
  const unfinalizedSessions = sessions.filter((session) => !session.finalized);

  return (
    <div className="container min-h-screen">
      {sessions.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full">
          <h1 className="text-3xl font-bold text-base-content text-center">
            You have no sessions.
          </h1>
          <h2 className="text-xl font-bold text-base-content text-center">
            Please either create one or join one via a link.
          </h2>
          <Link href={'/sessions/new'} className="mt-3">
            <button className="btn btn-outline btn-primary">
              Create a new session
            </button>
          </Link>
        </div>
      )}
      {unfinalizedSessions.length > 0 && (
        <h1 className="text-3xl font-bold text-base-content text-center my-5">
          Pending Sessions
        </h1>
      )}
      <div className="flex flex-col w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {unfinalizedSessions.map((session: Session) => (
            <Link
              href={`/sessions/${session.id}`}
              key={session.id}
              className="hover:shadow-xl transition duration-300 ease-in-out transform hover:-translate-y-1"
            >
              <div className="card w-96 bg-accent text-accent-content">
                <div className="card-body">
                  <h2 className="card-title">{session.name}</h2>
                  <p className="text-accent-content   mt-2">
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
          {finalizedSessions.map((session: Session) => (
            <Link
              href={`/sessions/${session.id}`}
              key={session.id}
              className="hover:shadow-xl transition duration-300 ease-in-out transform hover:-translate-y-1"
            >
              <div className="card w-96 bg-secondary text-secondary-content">
                <div className="card-body">
                  <h2 className="card-title">{session.name}</h2>
                  <p
                    className={`text-secondary-content mt-2 ${
                      userId == session.ownerId && 'font-bold'
                    }`}
                  >
                    Owner:{' '}
                    {userId == session.ownerId ? 'You' : session.ownerName}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="text-lg font-bold">
                      Bill: ${session.bill ?? 'N/A'}
                    </div>
                    <div className="card-actions">
                      <button className="btn no-animation">View</button>
                    </div>
                  </div>
                  <progress
                    className="progress progress-accent w-100 mt-2"
                    value={session.split!.filter((s) => s.paid).length}
                    max={session.split!.length}
                  ></progress>
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
