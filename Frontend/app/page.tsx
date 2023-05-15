import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]/route';
import GuestLogin from '@/components/GuestLogin';
import DemoLogin from '@/components/DemoLogin';

const HomePage = async () => {
  const userSession = ((await getServerSession(authOptions)) as any) ?? {};

  return (
    <div className="hero min-h-screen">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">
            Hello {userSession?.user?.name}
          </h1>
          {!userSession?.user && (
            <p className="my-6">
              Welcome to Honeycrisp, your user-friendly bill-management app.
            </p>
          )}
          {userSession?.user && !userSession.user.isGuest && (
            <div className="my-6">
              <Link href={'/sessions'} className="mx-2">
                <button className="btn btn-primary">My Sessions</button>
              </Link>
              <Link href={'/sessions/new'}>
                <button className="btn btn-outline btn-primary">
                  Create a new session
                </button>
              </Link>
            </div>
          )}
          {!userSession?.user && (
            <>
              <div className="mt-6">
                <Link href={'/register'} className="mx-2">
                  <button className="btn btn-primary">Register</button>
                </Link>
                <Link href={'/login'}>
                  <button className="btn btn-primary">Log in</button>
                </Link>
              </div>
              <div>
                <GuestLogin />
                <DemoLogin />
              </div>
            </>
          )}
          {userSession?.user && userSession.user.isGuest && (
            <div className="text-primary-content flex flex-col justify-center my-6">
              <p>How was Honeycrisp?</p>
              <p>Would you like to migrate your account to a full account?</p>
              <Link href={`/users/${userSession.user.id}`}>
                <button className="btn btn-sm btn-primary mt-2">Migrate</button>
              </Link>
            </div>
          )}
          <div></div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
