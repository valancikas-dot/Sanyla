import { AuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
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
      console.log('=== SignIn callback START ===');
      console.log('Provider:', account?.provider);
      console.log('User email:', user.email);
      console.log('User name:', user.name);
      console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
      console.log('GOOGLE_CLIENT_ID exists:', !!process.env.GOOGLE_CLIENT_ID);
      
      if (account?.provider === 'google') {
        try {
          console.log('Attempting to find user in database...');
          
          // Check if user exists
          let existingUser = await prisma.user.findUnique({
            where: { email: user.email! },
          });
          
          console.log('Existing user found:', !!existingUser);

          if (!existingUser) {
            console.log('Creating new user...');
            // Create user from Google OAuth
            existingUser = await prisma.user.create({
              data: {
                email: user.email!,
                name: user.name || user.email!.split('@')[0],
                image: user.image || undefined,
              },
            });
            
            console.log('New user created with ID:', existingUser.id);
          } else {
            console.log('User already exists with ID:', existingUser.id);
          }

          console.log('=== Google sign in SUCCESS ===');
          return true;
        } catch (error) {
          console.error('=== Google sign in ERROR ===');
          console.error('Error type:', error?.constructor?.name);
          console.error('Error message:', (error as any)?.message);
          console.error('Error stack:', (error as any)?.stack);
          return false;
        }
      }
      
      console.log('=== SignIn callback END (non-Google) ===');
      return true;
    },
  },
};
