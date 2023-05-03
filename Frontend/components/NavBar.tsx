import Link from 'next/link';
import NavLink from './NavLink';
import UserMenu from './UserMenu';
import { FaBars } from 'react-icons/fa';

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
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <FaBars />
          </label>
          <ul
            tabIndex={0}
            className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
          >
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
      <div className="navbar-center hidden lg:flex">
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
      <div className="navbar-end">
        {userSession?.user && (
          <NavLink label="Create session" path="/sessions/new" center={true} />
        )}
      </div>
    </div>
  );
  // return (
  //   <div className="navbar bg-primary text-primary-content sticky top-0 z-50">
  //     <div className="navbar-start">
  // <Link href="/" className="btn btn-ghost normal-case text-2xl">
  //   Honeycrisp
  // </Link>
  //     </div>
  //     <div className="navbar-center">
  // {userSession?.user && (
  //   <NavLink label="Create session" path="/sessions/new" center={true} />
  // )}
  //     </div>
  //     <div className="navbar-end">
  //       <ul className="menu menu-horizontal px-1">
  // {userSession?.user ? (
  //   <>
  //     {userlinks.map((link) => (
  //       <li key={link.label}>
  //         <NavLink {...link} />
  //       </li>
  //     ))}
  //     <UserMenu userSession={userSession} />
  //   </>
  // ) : (
  //   <>
  //     {guestlinks.map((link) => (
  //       <li key={link.label}>
  //         <NavLink {...link} />
  //       </li>
  //     ))}
  //   </>
  // )}
  //       </ul>
  //     </div>
  //   </div>
  // );
};

export default NavBar;
