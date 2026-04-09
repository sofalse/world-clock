import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';

import type { Provider } from 'next-auth/providers';

const providers: Provider[] = [];

if (process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET) {
  providers.push(
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  );
}

export const { handlers, auth } = NextAuth({
  providers,
  session: {
    strategy: 'jwt',
  },
});
