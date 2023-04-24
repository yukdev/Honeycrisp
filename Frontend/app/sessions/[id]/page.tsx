import { getSession } from '@/lib/api';
import Session from '@/components/Session';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../api/auth/[...nextauth]/route';
import SessionFinalized from '@/components/SessionFinalized';
import GuestLogin from '@/components/GuestLogin';

interface Props {
  params: {
    id: string;
  };
}

const SessionPage = async ({ params: { id } }: Props) => {
  const userSession = ((await getServerSession(authOptions)) as any) ?? {};
  const userId = userSession?.user?.id;
  const session = await getSession(id);
  const { finalized } = session;

  return (
    <div className="flex flex-col min-h-screen">
      <section id="session-info" className="w-full max-w-2xl mt-8">
        <h1 className="text-3xl font-bold mb-4 text-center text-accent">
          {session.name}
        </h1>
        <div className="flex justify-center items-center mb-3">
          <div className="flex flex-col items-center justify-center mx-8">
            <h2 className="text-lg font-bold mb-2 text-center text-secondary">
              Tip
            </h2>
            <p className="text-2xl font-bold text-center text-accent">{`${session.tip}%`}</p>
          </div>
          <div className="flex flex-col items-center justify-center mx-8">
            <h2 className="text-lg font-bold mb-2 text-center text-secondary">
              Tax
            </h2>
            <p className="text-2xl font-bold text-center text-accent">{`${session.tax}%`}</p>
          </div>
          <div className="flex flex-col items-center justify-center mx-8">
            <h2 className="text-lg font-bold mb-2 text-center text-secondary">
              Total
            </h2>
            <p className="text-2xl font-bold text-center underline text-accent">{`$${session.bill}`}</p>
          </div>
        </div>
        <div className="flex justify-center">
          <h2 className="text-xl font-bold text-center text-base-content">
            {`Owner: ${session.ownerId === userId ? 'You' : session.ownerName}`}
          </h2>
        </div>
        {!userSession.user && !finalized && <GuestLogin id={id} />}
        {userSession?.user?.isGuest && !finalized && (
          <div className="flex justify-center">
            <h2 className="text-center text-error">
              {`Viewing as guest (${userSession.user.name})`}
            </h2>
          </div>
        )}
      </section>
      {finalized ? (
        <SessionFinalized userSession={userSession} session={session} />
      ) : (
        <Session userSession={userSession} session={session} />
      )}
    </div>
  );
};

export default SessionPage;
