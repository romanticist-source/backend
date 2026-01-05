import { z } from "../lib/zod.js";

// Alert History schemas for OpenAPI
export const AlertHistorySchema = z
  .object({
    id: z.string().openapi({ example: "123e4567-e89b-12d3-a456-426614174006" }),
    userId: z
      .string()
      .openapi({ example: "123e4567-e89b-12d3-a456-426614174000" }),
    title: z.string().openapi({ example: "転倒検知" }),
    description: z
      .string()
      .openapi({ example: "リビングで転倒が検知されました" }),
    importance: z.number().int().openapi({ example: 3 }),
    alertType: z.string().openapi({ example: "fall" }),
    createdAt: z.string().openapi({ example: "2024-01-15T14:30:00.000Z" }),
  })
  .openapi("AlertHistory");

export const CreateAlertHistorySchema = z
  .object({
    userId: z
      .string()
      .openapi({ example: "123e4567-e89b-12d3-a456-426614174000" }),
    title: z.string().min(1).openapi({ example: "転倒検知" }),
    description: z
      .string()
      .min(1)
      .openapi({ example: "リビングで転倒が検知されました" }),
    importance: z.number().int().min(1).max(5).openapi({ example: 3 }),
    alertType: z.string().openapi({ example: "fall" }),
  })
  .openapi("CreateAlertHistory");

export const UpdateAlertHistorySchema = z
  .object({
    title: z.string().min(1).optional().openapi({ example: "転倒検知" }),
    description: z
      .string()
      .min(1)
      .optional()
      .openapi({ example: "リビングで転倒が検知されました" }),
    importance: z
      .number()
      .int()
      .min(1)
      .max(5)
      .optional()
      .openapi({ example: 3 }),
    alertType: z.string().optional().openapi({ example: "fall" }),
  })
  .openapi("UpdateAlertHistory");

export const ErrorSchema = z
  .object({
    error: z.string().openapi({ example: "エラーメッセージ" }),
  })
  .openapi("Error");
