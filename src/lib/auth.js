import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db(process.env.DB_NAME || 'fixmate');

export const auth = betterAuth({
  database: mongodbAdapter(db),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
  },
  socialProviders: {
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  },
},
account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ['google', 'email-password'],
    },
  },
  trustedOrigins: [
    'http://localhost:3000',
    process.env.NEXT_PUBLIC_APP_URL,
  ].filter(Boolean),
  user: {
    additionalFields: {
      role: {
        type: 'string',
        defaultValue: 'customer',
        input: true,
      },
      phone: {
        type: 'string',
        defaultValue: '',
        input: true,
      },
      area: {
        type: 'string',
        defaultValue: '',
        input: true,
      },
      bio: {
        type: 'string',
        defaultValue: '',
        input: true,
      },
    },
  },
 databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          // Server-side guard: nobody can self-register as admin
          const safeRole =
            user.role === 'technician' ? 'technician' : 'customer';
          return {
            data: {
              ...user,
              role: safeRole,
              emailVerified: true,
            },
          };
        },
      },
    },
  },
});