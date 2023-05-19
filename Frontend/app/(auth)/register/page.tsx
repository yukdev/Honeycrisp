import { getServerSession } from 'next-auth';
import { authOptions } from '../../api/auth/[...nextauth]/route';
import AuthForm from '@/components/AuthForm';
import UnauthorizedPage from '@/components/UnauthorizedPage';

const Register = async () => {
  const userSession = (await getServerSession(authOptions)) as any;

  if (userSession?.user) {
    return <UnauthorizedPage errorMessage="You are already logged in." />;
  }

  return <AuthForm mode="register" />;
};

export default Register;
