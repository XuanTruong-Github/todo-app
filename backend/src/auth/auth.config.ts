import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';

export function createAuthInstance(database) {
  return betterAuth({
    database: mongodbAdapter(database),
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
    },
    secret: process.env.BETTER_AUTH_SECRET,
    baseURL: "http://localhost:8080"
  });
}
export type Auth = ReturnType<typeof createAuthInstance>;