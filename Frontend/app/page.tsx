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
          <h1 className="text-6xl font-bold">
            Hello {userSession?.user?.name}
          </h1>
          {!userSession?.user && (
            <div className="font-bold">
              <h2 className="text-2xl text-secondary">Welcome to Honeycrisp</h2>
              <h3 className="text-lg">
                Your user-friendly bill management app
              </h3>
            </div>
          )}
          {userSession?.user &&
            !userSession.user.isGuest &&
            !userSession.user.isDemo && (
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
              <div className="mt-3 space-y-3">
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
          {userSession?.user && userSession.user.isDemo && (
            <div className="text-primary-content flex flex-col justify-center my-6">
              <Link href="/demo">
                <button className="btn btn-primary mt-2">
                  View Demo Tasks
                </button>
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
