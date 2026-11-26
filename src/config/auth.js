import { betterAuth } from "better-auth";
import { APIError } from "better-auth/api";
import { admin, jwt } from "better-auth/plugins";

import { mentorLagbeAuthAdapter } from "./mentorlagbe-auth-adapter.js";

import {
  ac,
  adminRole,
  studentRole,
  tutorRole,
} from "./permissions.js";

export const auth = betterAuth({
  database: mentorLagbeAuthAdapter(),

  baseURL: process.env.BETTER_AUTH_URL,

  secret: process.env.BETTER_AUTH_SECRET,

  trustedOrigins: [process.env.CLIENT_URL],

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },

  socialProviders: {
    ...(process.env.GOOGLE_CLIENT_ID &&
    process.env.GOOGLE_CLIENT_SECRET
      ? {
          google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          },
        }
      : {}),
  },

  user: {
    additionalFields: {
      accountType: {
        type: "string",
        required: false,
        defaultValue: "student",
        input: true,
      },

      // Bangladesh Division
      // Google OAuth onboarding-এর জন্য optional
      division: {
        type: "string",
        required: false,
        input: true,
      },

      plan: {
        type: "string",
        required: true,
        defaultValue: "free",
        input: false,
      },

      phone: {
        type: "string",
        required: false,
        input: false,
      },

      bio: {
        type: "string",
        required: false,
        input: false,
      },

      // Tracks whether initial account setup is complete
      onboardingCompleted: {
        type: "boolean",
        required: false,
        defaultValue: false,
        input: false,
      },
    },
  },

  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const accountType = user.accountType || "student";

          if (!["student", "tutor"].includes(accountType)) {
            throw new APIError("BAD_REQUEST", {
              message:
                "Only student and tutor registration is allowed.",
            });
          }

          const {
            accountType: _accountType,
            ...userData
          } = user;

          const hasDivision =
            typeof user.division === "string" &&
            user.division.trim().length > 0;

          return {
            data: {
              ...userData,
              role: accountType,
              onboardingCompleted: hasDivision,
            },
          };
        },
      },

      update: {
        before: async (user) => {
          if (Object.hasOwn(user, "role")) {
            throw new APIError("FORBIDDEN", {
              message: "You cannot change your account role.",
            });
          }

          if (Object.hasOwn(user, "onboardingCompleted")) {
            throw new APIError("FORBIDDEN", {
              message:
                "You cannot directly change onboarding status.",
            });
          }

          return {
            data: user,
          };
        },
      },
    },
  },

  plugins: [
    admin({
      ac,
      roles: {
        admin: adminRole,
        student: studentRole,
        tutor: tutorRole,
      },
      defaultRole: "student",
    }),

    jwt({
      jwt: {
        definePayload: ({ user }) => ({
          id: user.id,
          email: user.email,
          role: user.role,
          plan: user.plan,
          onboardingCompleted: user.onboardingCompleted,
        }),
      },
    }),
  ],
});