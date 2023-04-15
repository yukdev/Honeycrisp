import NextAuth, { type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { login, register } from '@/lib/api';

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  providers: [
    CredentialsProvider({
      name: 'Log in',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        const { email, password } = credentials;
        const resp = await login({ email, password });
        if (!resp) {
          return null;
        }
        return resp;
      },
    }),
    CredentialsProvider({
      name: 'Register',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
        name: { label: 'Name', type: 'text' },
      },
      async authorize(credentials) {
        if (
          !credentials?.email ||
          !credentials?.password ||
          !credentials?.name
        ) {
          return null;
        }
        const { email, password, name } = credentials;
        const resp = await register({ email, password, name });
        if (!resp) {
          return null;
        }
        return resp;
      },
    }),
  ],
  callbacks: {
    session: ({ session, token }) => {
      // console.log('Session Callback', { session, token });
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          name: token.name,
        },
      };
    },
    jwt: ({ token, user }) => {
      // console.log('JWT Callback', { token, user });
      if (user) {
        const u = user as unknown as { id: string; name: string };
        return {
          ...token,
          id: u.id,
          name: u.name,
        };
      }
      return token;
    },
  },
  pages: {
    signIn: '/login',
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
