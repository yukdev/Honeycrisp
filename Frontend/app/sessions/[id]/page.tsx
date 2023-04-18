import { getSession } from '@/lib/api';
import Session from '@/components/Session';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../api/auth/[...nextauth]/route';

interface Props {
  params: {
    id: string;
  };
}

const SessionPage = async ({ params: { id } }: Props) => {
  const userSession = (await getServerSession(authOptions)) as any;
  const session = await getSession(id);
  return (
    <div className="card">
      <Session userSession={userSession} session={session} />
    </div>
  );
};

export default SessionPage;
