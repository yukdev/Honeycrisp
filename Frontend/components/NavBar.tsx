import Link from 'next/link';
import NavLink from './NavLink';
import { getServerSession } from 'next-auth';
import { authOptions } from '../app/api/auth/[...nextauth]/route';
const userlinks = [
  {
    label: 'Sessions',
    path: '/sessions',
  },
  {
    label: 'Log out',
    path: '/logout',
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

const NavBar = async () => {
  const session = await getServerSession(authOptions);

  return (
    <div className="navbar bg-primary text-primary-content sticky top-0 z-50">
      <div className="flex-1">
        <Link href="/" className="btn btn-ghost normal-case text-xl">
          Honeycrisp
        </Link>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          {session?.user ? (
            <>
              {userlinks.map((link) => (
                <li key={link.label}>
                  <NavLink {...link} />
                </li>
              ))}
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
