import { getSession } from '@/lib/api';
import Session from '@/components/Session';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../api/auth/[...nextauth]/route';
import SessionFinalized from '@/components/SessionFinalized';
import GuestLogin from '@/components/GuestLogin';
import { FaShare } from 'react-icons/fa';
import { IoLogoVenmo } from 'react-icons/io5';
import { TipType } from '@/lib/types';
import ShareModal from '@/components/ShareModal';
import NotFoundPage from '@/components/NotFoundPage';
import Link from 'next/link';

interface SessionPageProps {
  params: {
    id: string;
  };
}

const SessionPage = async ({ params: { id } }: SessionPageProps) => {
  const userSession = ((await getServerSession(authOptions)) as any) ?? {};
  const userId = userSession?.user?.id;
  let session;
  try {
    session = await getSession(id);
  } catch (error) {
    return <NotFoundPage errorMessage={`Session not found with id: ${id}`} />;
  }

  const { finalized } = session;

  return (
    <div className="flex flex-col items-center min-h-screen">
      <ShareModal link={`${process.env.NEXTAUTH_URL}sessions/${id}`} />
      <section id="session-info" className="w-full max-w-2xl mt-8">
        <div className="flex justify-center items-center mb-3">
          <h1 className="text-3xl md:text-4xl font-bold text-center text-accent">
            {session.name}
          </h1>
          <div className="flex items-center pt-1 ml-3">
            <label
              htmlFor="share-session"
              className="btn btn-xs md:btn-sm btn-secondary"
            >
              <p className="mr-1">Share</p>
              <FaShare />
            </label>
          </div>
        </div>
        <div className="flex justify-center items-center">
          <div className="flex flex-col items-center justify-center mx-6">
            <h2 className="text-xl md:text-2xl font-bold mb-1 text-center text-secondary">
              Tip
            </h2>
            <p className="text-xl md:text-2xl font-bold text-center text-accent">{`${
              session.tipType === TipType.FLAT
                ? `$${session.tip}`
                : `${session.tip}%`
            }`}</p>
          </div>
          <div className="flex flex-col items-center justify-center mx-6">
            <h2 className="text-xl md:text-2xl font-bold mb-1 text-center text-secondary">
              Tax
            </h2>
            <p className="text-xl md:text-2xl font-bold text-center text-accent">{`${session.tax}%`}</p>
          </div>
          <div className="flex flex-col items-center justify-center mx-6">
            <h2 className="text-xl md:text-2xl font-bold mb-1 text-center text-secondary">
              Total
            </h2>
            <p className="text-xl md:text-2xl font-bold text-center text-accent">{`$${session.bill.toFixed(
              2,
            )}`}</p>
          </div>
        </div>
        <div className="flex justify-center items-center mt-1 text-2xl font-bold text-center text-base-content">
          <h2>Owner:</h2>
          <h2 className="mx-1">
            {session.ownerId === userId ? 'You' : session.ownerName}
          </h2>
          {session.ownerPaymentAddress && (
            <Link href={session.ownerPaymentAddress}>
              <IoLogoVenmo color="#008CFF" />
            </Link>
          )}
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
