import { AuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials');
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          throw new Error('Invalid credentials');
        }

        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isCorrectPassword) {
          throw new Error('Invalid credentials');
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),
  ],
  pages: {
    signIn: '/auth',
  },
  debug: process.env.NODE_ENV === 'development',
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).email = token.email;
        (session.user as any).name = token.name;
      }
      return session;
    },
    async signIn({ user, account }) {
      console.log('SignIn callback called:', { provider: account?.provider, email: user.email });
      
      if (account?.provider === 'google') {
        try {
          // Check if user exists
          let existingUser = await prisma.user.findUnique({
            where: { email: user.email! },
          });
          
          console.log('Existing user:', existingUser ? 'found' : 'not found');

          if (!existingUser) {
            // Create user from Google OAuth
            existingUser = await prisma.user.create({
              data: {
                email: user.email!,
                name: user.name || user.email!.split('@')[0],
                image: user.image || undefined,
              },
            });
            
            console.log('New user created:', existingUser.id);
          }

          // User can sign in without organization - no need to check or create
          console.log('Google sign in SUCCESS');
          return true;
        } catch (error) {
          console.error('Google sign in error:', error);
          return false;
        }
      }
      return true;
    },
  },
};
