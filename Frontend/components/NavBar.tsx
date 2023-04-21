import Link from 'next/link';
import NavLink from './NavLink';
import LogOutButton from './LogOutButton';
const userlinks = [
  {
    label: 'Create session',
    path: '/sessions/new',
  },
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
      image?: any;
    };
  };
}

const NavBar = async ({ userSession }: NavBarProps) => {
  return (
    <div className="navbar bg-primary text-primary-content sticky top-0 z-50">
      <div className="flex-1">
        <Link href="/" className="btn btn-ghost normal-case text-xl">
          Honeycrisp
        </Link>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          {userSession?.user ? (
            <>
              {userlinks.map((link) => (
                <li key={link.label}>
                  <NavLink {...link} />
                </li>
              ))}
              <LogOutButton />
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
