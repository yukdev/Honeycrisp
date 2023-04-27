import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { login } from '@/lib/api';

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  providers: [
    CredentialsProvider({
      id: 'login',
      name: 'Log in',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials');
        }
        const { email, password } = credentials;
        const user = await login({ email, password });
        if (user) {
          return user;
        } else {
          throw new Error('Invalid email or password.');
        }
      },
    }),
  ],
  callbacks: {
    session: ({ session, token }) => {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          name: token.name,
          isGuest: token.isGuest,
        },
      };
    },
    jwt: ({ token, user }) => {
      if (user) {
        const u = user as unknown as {
          id: string;
          name: string;
          isGuest: boolean;
        };
        return {
          ...token,
          id: u.id,
          name: u.name,
          isGuest: u.isGuest,
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
