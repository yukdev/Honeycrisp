import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]/route';

const HomePage = async () => {
  const session = await getServerSession(authOptions);

  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">Hello {session?.user?.name}</h1>
          <p className="py-6">
            Welcome to Honeycrisp, your user-friendly bill-splitting app.
          </p>
          {session?.user ? (
            <div>
              <Link href={'/sessions'} className="mx-2">
                <button className="btn btn-primary">My Sessions</button>
              </Link>
              <Link href={'/sessions/new'}>
                <button className="btn btn-outline btn-primary">
                  Create a new session
                </button>
              </Link>
            </div>
          ) : (
            <Link href={'/api/auth/signin'}>
              <button className="btn btn-primary">Sign In</button>
            </Link>
          )}
          <div></div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
