import { getServerSession } from 'next-auth';
import { authOptions } from '../../api/auth/[...nextauth]/route';
import NewSessionForm from '@/components/NewSessionForm';

const CreateSessionPage = async () => {
  const userSession = (await getServerSession(authOptions)) as any;
  return (
    <div>
      <NewSessionForm userSession={userSession} />
    </div>
  );
};

export default CreateSessionPage;
