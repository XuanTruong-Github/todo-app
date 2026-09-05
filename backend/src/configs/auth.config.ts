import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { openAPI } from 'better-auth/plugins';
export function createAuthInstance(database) {
  return betterAuth({
    database: mongodbAdapter(database),
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
    },
    secret: process.env.BETTER_AUTH_SECRET,
    baseURL: process.env.BETTER_AUTH_URL,
    basePath: '/api/auth',
    advanced: {
      database: {
        joins: true,
      },
    },
    hooks: {},
    plugins: [openAPI()],
  });
}
export type Auth = ReturnType<typeof createAuthInstance>;
