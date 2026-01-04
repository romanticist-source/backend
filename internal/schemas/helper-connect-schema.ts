import { z } from "../lib/zod.js";

// HelperConnect schemas for OpenAPI
export const HelperConnectSchema = z
  .object({
    helperId: z
      .string()
      .openapi({ example: "123e4567-e89b-12d3-a456-426614174001" }),
    userIds: z.array(z.string()).openapi({
      example: ["user-001", "user-002", "user-003"],
    }),
  })
  .openapi("HelperConnect");

export const ErrorSchema = z
  .object({
    error: z.string().openapi({ example: "エラーメッセージ" }),
  })
  .openapi("Error");
