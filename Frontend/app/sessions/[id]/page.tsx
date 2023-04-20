import { getSession } from '@/lib/api';
import Session from '@/components/Session';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../api/auth/[...nextauth]/route';
import SessionFinalized from '@/components/SessionFinalized';

interface Props {
  params: {
    id: string;
  };
}

const SessionPage = async ({ params: { id } }: Props) => {
  const userSession = (await getServerSession(authOptions)) as any;
  const session = await getSession(id);

  const { finalized } = session;
  return (
    <div>
      {finalized ? (
        <SessionFinalized userSession={userSession} session={session} />
      ) : (
        <Session userSession={userSession} session={session} />
      )}
    </div>
  );
};

export default SessionPage;
