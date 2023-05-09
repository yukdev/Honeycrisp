import { getServerSession } from 'next-auth';
import { authOptions } from '../../api/auth/[...nextauth]/route';
import SessionNewForm from '@/components/SessionNewForm';

const CreateSessionPage = async () => {
  const userSession = (await getServerSession(authOptions)) as any;
  return (
    <div>
      <SessionNewForm userSession={userSession} />
    </div>
  );
};

export default CreateSessionPage;
