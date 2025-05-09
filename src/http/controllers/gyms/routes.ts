import { verifyJWT } from "@/http/middlewares/verify-jwt.middleware";
import { search } from "./search.controller";
import { nearby } from "./nearby.controller";
import { create } from "./create.controller";
import { verifyUserRole } from "@/http/middlewares/verify-user-role.middleware";
import { z } from "zod";
import { FastifyTypedInstance } from "@/@types/fastify-instance";

export async function gymsRoutes(app: FastifyTypedInstance) {
  app.addHook("onRequest", verifyJWT);

  app.get(
    "/gyms/search",
    {
      schema: {
        tags: ["Gyms"],
        summary: "Search for gyms by name",
        description:
          "Searches for gyms by their name using a text query. Returns a paginated list of matching gyms, with 20 results per page.",
        security: [{ bearerAuth: [] }],
        querystring: z.object({
          query: z.string(),
          page: z.coerce.number().min(1).default(1), // coerce converts string to number
        }),
        response: {
          200: z.object({
            gyms: z.array(
              z.object({
                id: z.string(),
                title: z.string(),
                description: z.string().nullable(),
                phone: z.string().nullable(),
                latitude: z.coerce.number(),
                longitude: z.coerce.number(),
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
    search
  );
  app.get(
    "/gyms/nearby",
    {
      schema: {
        tags: ["Gyms"],
        summary: "Find gyms near a location",
        description:
          "Locates gyms within a 10km radius of the provided coordinates. Results are ordered by proximity to the specified location.",
        security: [{ bearerAuth: [] }],
        querystring: z.object({
          latitude: z.coerce.number().refine((value) => {
            const isValidLatitude = Math.abs(value) <= 90;
            return isValidLatitude;
          }),
          longitude: z.coerce.number().refine((value) => {
            const isValidLongitude = Math.abs(value) <= 180;
            return isValidLongitude;
          }),
        }),
        response: {
          200: z.object({
            gyms: z.array(
              z.object({
                id: z.string(),
                title: z.string(),
                description: z.string().nullable(),
                phone: z.string().nullable(),
                latitude: z.coerce.number(),
                longitude: z.coerce.number(),
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
    nearby
  );

  app.post(
    "/gyms",
    {
      onRequest: [verifyUserRole("ADMIN")],
      schema: {
        tags: ["Gyms"],
        summary: "[ADMIN ONLY] Create a new gym",
        description:
          "⚠️ **REQUIRES ADMIN ROLE**: Creates a new gym in the system with the provided details. Only administrators can add new gyms to the platform.",
        security: [{ bearerAuth: [] }],
        body: z.object({
          title: z.string(),
          description: z.string().nullable(),
          phone: z.string().nullable(),
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
}
