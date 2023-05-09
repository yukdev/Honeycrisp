import { getSession } from '@/lib/api';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../api/auth/[...nextauth]/route';
import NotFound from '@/components/NotFound';
import EditSessionForm from '@/components/EditSessionForm';
import Unauthorized from '@/components/Unauthorized';

interface SessionEditPageProps {
  params: {
    id: string;
  };
}

const SessionEditPage = async ({ params: { id } }: SessionEditPageProps) => {
  const userSession = ((await getServerSession(authOptions)) as any) ?? {};
  const userId = userSession?.user?.id;
  let session;
  try {
    session = await getSession(id);
  } catch (error) {
    return <NotFound errorMessage={`Session not found with id: ${id}`} />;
  }

  if (session.ownerId !== userId) {
    return <Unauthorized errorMessage="Only the session's owner can edit it" />;
  }

  return (
    <div>
      <EditSessionForm session={session} userId={userId} />
    </div>
  );
};

export default SessionEditPage;
