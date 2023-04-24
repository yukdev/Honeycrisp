import Link from 'next/link';
import NavLink from './NavLink';
import UserMenu from './UserMenu';
const userlinks = [
  {
    label: 'My sessions',
    path: '/sessions',
  },
];

const guestlinks = [
  {
    label: 'Register',
    path: '/register',
  },
  {
    label: 'Log in',
    path: '/login',
  },
];

interface NavBarProps {
  userSession: {
    user: {
      name: string;
      email: string;
      id: string;
      isGuest: boolean;
    };
  };
}

const NavBar = async ({ userSession }: NavBarProps) => {
  return (
    <div className="navbar bg-primary text-primary-content sticky top-0 z-50">
      <div className="navbar-start">
        <Link href="/" className="btn btn-ghost normal-case text-2xl">
          Honeycrisp
        </Link>
      </div>
      <div className="navbar-center">
        {userSession?.user && (
          <Link
            href="/sessions/new"
            className="btn btn-ghost normal-case text-xl"
          >
            Create session
          </Link>
        )}
      </div>
      <div className="navbar-end">
        <ul className="menu menu-horizontal px-1">
          {userSession?.user ? (
            <>
              {userlinks.map((link) => (
                <li key={link.label}>
                  <NavLink {...link} />
                </li>
              ))}
              <UserMenu userSession={userSession} />
            </>
          ) : (
            <>
              {guestlinks.map((link) => (
                <li key={link.label}>
                  <NavLink {...link} />
                </li>
              ))}
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default NavBar;
