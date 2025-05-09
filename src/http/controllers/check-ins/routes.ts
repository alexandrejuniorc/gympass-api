import { verifyJWT } from "@/http/middlewares/verify-jwt.middleware";
import { FastifyInstance } from "fastify";
import { create } from "./create.controller";
import { validate } from "./validate.controller";
import { history } from "./history.controller";
import { metrics } from "./metrics.controller";
import { verifyUserRole } from "@/http/middlewares/verify-user-role.middleware";
import { FastifyTypedInstance } from "@/@types/fastify-instance";
import { z } from "zod";

export async function checkInsRoutes(app: FastifyTypedInstance) {
  app.addHook("onRequest", verifyJWT);

  app.get(
    "/check-ins/history",
    {
      schema: {
        tags: ["Check-ins"],
        summary: "User check-in history",
        description:
          "Retrieves the authenticated user's paginated check-in history. Returns 20 items per page, sorted by most recent first.",
        security: [{ bearerAuth: [] }],
        querystring: z.object({ page: z.coerce.number().min(1).default(1) }),
        response: {
          200: z.object({
            checkIns: z.array(
              z.object({
                id: z.string(),
                created_at: z.coerce.string(),
                validated_at: z.coerce.string().nullable(),
                user_id: z.string(),
                gym_id: z.string(),
              })
            ),
          }),
          400: z
            .object({
              message: z.string(),
              issues: z.record(z.any()),
            })
            .describe("Validation error"),
          401: z
            .object({
              message: z.string(),
            })
            .describe("Unauthorized access - JWT token missing or invalid"),
          403: z
            .object({
              message: z.string(),
            })
            .describe("Forbidden - insufficient permissions for this action"),
        },
      },
    },
    history
  );
  app.get(
    "/check-ins/metrics",
    {
      schema: {
        tags: ["Check-ins"],
        summary: "User check-in count",
        description:
          "Returns the total number of check-ins made by the authenticated user. Useful for tracking workout frequency and achievement milestones.",
        security: [{ bearerAuth: [] }],
        response: {
          200: z.object({
            checkInsCount: z.number(),
          }),
          400: z
            .object({
              message: z.string(),
              issues: z.record(z.any()),
            })
            .describe("Validation error"),
          401: z
            .object({
              message: z.string(),
            })
            .describe("Unauthorized access - JWT token missing or invalid"),
          403: z
            .object({
              message: z.string(),
            })
            .describe("Forbidden - insufficient permissions for this action"),
        },
      },
    },
    metrics
  );

  app.post(
    "/gyms/:gymId/check-ins",
    {
      schema: {
        tags: ["Check-ins"],
        summary: "Record a gym check-in",
        description:
          "Creates a new check-in at the specified gym for the authenticated user. Business rules: Users cannot check in more than once per day, and must be within 100m of the gym's location to check in successfully.",
        security: [{ bearerAuth: [] }],
        params: z.object({
          gymId: z.string().uuid(),
        }),
        body: z.object({
          latitude: z.number().refine((value) => {
            const isValidLatitude = Math.abs(value) <= 90;
            return isValidLatitude;
          }),
          longitude: z.number().refine((value) => {
            const isValidLongitude = Math.abs(value) <= 180;
            return isValidLongitude;
          }),
        }),
        response: {
          201: z.object({}),
          400: z
            .object({
              message: z.string(),
              issues: z.record(z.any()),
            })
            .describe("Validation error"),
          401: z
            .object({
              message: z.string(),
            })
            .describe("Unauthorized access - JWT token missing or invalid"),
          403: z
            .object({
              message: z.string(),
            })
            .describe("Forbidden - insufficient permissions for this action"),
        },
      },
    },
    create
  );

  app.patch(
    "/check-ins/:checkInId/validate",
    {
      onRequest: [verifyUserRole("ADMIN")],
      schema: {
        tags: ["Check-ins"],
        summary: "[ADMIN ONLY] Validate a user's check-in",
        description:
          "⚠️ **REQUIRES ADMIN ROLE**: Validates a user's check-in. Check-ins can only be validated within 20 minutes of their creation time. Once validated, the check-in counts toward the user's official workout record.",
        security: [{ bearerAuth: [] }],
        params: z.object({
          checkInId: z.string().uuid(),
        }),
        response: {
          204: z.object({}),
          400: z
            .object({
              message: z.string(),
              issues: z.record(z.any()),
            })
            .describe("Validation error"),
          401: z
            .object({
              message: z.string(),
            })
            .describe("Unauthorized access - JWT token missing or invalid"),
          403: z
            .object({
              message: z.string(),
            })
            .describe("Forbidden - insufficient permissions for this action"),
        },
      },
    },
    validate
  );
}
