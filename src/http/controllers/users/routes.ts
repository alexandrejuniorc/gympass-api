import { register } from "./register.controller";
import { authenticate } from "./authenticate.controller";
import { profile } from "./profile.controller";
import { verifyJWT } from "@/http/middlewares/verify-jwt.middleware";
import { refresh } from "./refresh.controller";
import { z } from "zod";
import { FastifyTypedInstance } from "@/@types/fastify-instance";

export async function usersRoutes(app: FastifyTypedInstance) {
  app.post(
    "/users",
    {
      schema: {
        tags: ["Users"],
        summary: "Register new user",
        description:
          "Creates a new user account in the system. After registration, users need to authenticate to access protected endpoints.",
        body: z.object({
          name: z.string(),
          email: z.string().email(),
          password: z.string().min(6),
        }),
        response: {
          201: z.object({}),
          400: z
            .object({
              message: z.string(),
              issues: z.record(z.any()),
            })
            .describe("Validation error"),
        },
      },
    },
    register
  );
  app.post(
    "/sessions",
    {
      schema: {
        tags: ["Users"],
        summary: "User authentication",
        description:
          "Authenticates a user with email and password, returning a JWT access token for use with protected endpoints.",
        body: z.object({
          email: z.string().email(),
          password: z.string().min(6),
        }),
        response: {
          200: z.object({
            token: z.string(),
          }),
          400: z
            .object({
              message: z.string(),
              issues: z.record(z.any()),
            })
            .describe("Validation error"),
        },
      },
    },
    authenticate
  );

  app.patch(
    "/token/refresh",
    {
      schema: {
        tags: ["Users"],
        summary: "Refresh authentication token",
        description:
          "Issues a new JWT access token using the refresh token stored in an HTTP-only cookie. This endpoint extends the user's session without requiring re-authentication.",
        response: {
          200: z.object({
            token: z.string(),
          }),
          400: z
            .object({
              message: z.string(),
              issues: z.record(z.any()),
            })
            .describe("Validation error"),
        },
      },
    },
    refresh
  );

  /** Authenticated */
  app.get(
    "/me",
    {
      onRequest: [verifyJWT],
      schema: {
        tags: ["Users"],
        summary: "Get current user profile",
        description:
          "Retrieves the profile information of the currently authenticated user based on their JWT token.",
        security: [{ bearerAuth: [] }],
        response: {
          200: z.object({
            user: z.object({
              id: z.string(),
              name: z.string(),
              email: z.string().email(),
              role: z.enum(["ADMIN", "MEMBER"]),
              created_at: z.coerce.string(),
            }),
          }),
          400: z
            .object({
              message: z.string(),
              issues: z.record(z.any()),
            })
            .describe("Validation error"),
        },
      },
    },
    profile
  );
}
