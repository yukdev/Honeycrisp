import { getSession } from '@/lib/api';
import Session from '@/components/Session';

interface Props {
  params: {
    id: string;
  };
}

const SessionPage = async ({ params: { id } }: Props) => {
  const session = await getSession(id);
  return (
    <div className="card">
      <Session session={session} />
    </div>
  );
};

export default SessionPage;
