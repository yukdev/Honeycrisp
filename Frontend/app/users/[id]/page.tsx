import { getServerSession } from 'next-auth';
import React from 'react';
import { authOptions } from '../../api/auth/[...nextauth]/route';
import UpdateForm from '@/components/UpdateForm';
import Unauthorized from '@/components/Unauthorized';

interface UserPageProps {
  params: {
    id: string;
  };
}

const UserPage = async ({ params: { id } }: UserPageProps) => {
  const userSession = ((await getServerSession(authOptions)) as any) ?? {};
  const userId = userSession?.user?.id;

  if (id !== userId) {
    return (
      <Unauthorized errorMessage="You cannot edit another user's details" />
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <UpdateForm id={id} userSession={userSession} />
    </div>
  );
};

export default UserPage;
