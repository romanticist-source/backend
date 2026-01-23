import { z } from "@hono/zod-openapi";

export const UserFatigueSchema = z
  .object({
    id: z.string().uuid().openapi({ example: "123e4567-e89b-12d3-a456-426614174000" }),
    userId: z.string().uuid().openapi({ example: "123e4567-e89b-12d3-a456-426614174001" }),
    fatigueLevel: z.number().int().min(1).max(10).openapi({ example: 5 }),
    createdAt: z.string().datetime().openapi({ example: "2024-01-01T00:00:00.000Z" }),
    updatedAt: z.string().datetime().openapi({ example: "2024-01-01T00:00:00.000Z" }),
  })
  .openapi("UserFatigue");

export const CreateUserFatigueSchema = z
  .object({
    userId: z.string().uuid().openapi({ example: "123e4567-e89b-12d3-a456-426614174001" }),
    fatigueLevel: z.number().int().min(1).max(10).openapi({ example: 5 }),
  })
  .openapi("CreateUserFatigue");

export const UpdateUserFatigueSchema = z
  .object({
    fatigueLevel: z.number().int().min(1).max(10).optional().openapi({ example: 7 }),
  })
  .openapi("UpdateUserFatigue");

export const UserFatigueListSchema = z.array(UserFatigueSchema).openapi("UserFatigueList");

export const UserFatigueIdParamSchema = z.object({
  id: z.string().uuid().openapi({ example: "123e4567-e89b-12d3-a456-426614174000" }),
});

export const UserIdParamSchema = z.object({
  userId: z.string().uuid().openapi({ example: "123e4567-e89b-12d3-a456-426614174001" }),
});

export const ErrorSchema = z
  .object({
    message: z.string().openapi({ example: "Error message" }),
  })
  .openapi("Error");
