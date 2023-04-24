import { getServerSession } from 'next-auth';
import React from 'react';
import { authOptions } from '../../api/auth/[...nextauth]/route';
import UpdateForm from '@/components/UpdateForm';

interface UserPageProps {
  params: {
    id: string;
  };
}

const UserPage = async ({ params: { id } }: UserPageProps) => {
  const userSession = ((await getServerSession(authOptions)) as any) ?? {};

  return (
    <div className="flex flex-col min-h-screen">
      <UpdateForm id={id} userSession={userSession} />
    </div>
  );
};

export default UserPage;
