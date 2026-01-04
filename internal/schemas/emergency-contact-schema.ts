import { z } from "../lib/zod.js";

// Emergency Contact schemas for OpenAPI
export const EmergencyContactSchema = z
  .object({
    userId: z
      .string()
      .openapi({ example: "123e4567-e89b-12d3-a456-426614174000" }),
    helperId: z
      .string()
      .openapi({ example: "123e4567-e89b-12d3-a456-426614174001" }),
    name: z.string().openapi({ example: "佐藤花子" }),
    relationship: z.string().openapi({ example: "娘" }),
    phoneNumber: z.string().openapi({ example: "090-1234-5678" }),
    email: z
      .string()
      .nullable()
      .openapi({ example: "hanako.sato@example.com" }),
    address: z.string().nullable().openapi({ example: "東京都渋谷区1-2-3" }),
    isMain: z.boolean().openapi({ example: true }),
  })
  .openapi("EmergencyContact");

export const CreateEmergencyContactSchema = z
  .object({
    userId: z
      .string()
      .openapi({ example: "123e4567-e89b-12d3-a456-426614174000" }),
    helperId: z
      .string()
      .openapi({ example: "123e4567-e89b-12d3-a456-426614174001" }),
    name: z.string().min(1).openapi({ example: "佐藤花子" }),
    relationship: z.string().min(1).openapi({ example: "娘" }),
    phoneNumber: z.string().min(1).openapi({ example: "090-1234-5678" }),
    email: z
      .string()
      .nullable()
      .optional()
      .openapi({ example: "hanako.sato@example.com" }),
    address: z
      .string()
      .nullable()
      .optional()
      .openapi({ example: "東京都渋谷区1-2-3" }),
    isMain: z.boolean().openapi({ example: true }),
  })
  .openapi("CreateEmergencyContact");

export const UpdateEmergencyContactSchema = z
  .object({
    name: z.string().min(1).optional().openapi({ example: "佐藤花子" }),
    relationship: z.string().min(1).optional().openapi({ example: "娘" }),
    phoneNumber: z
      .string()
      .min(1)
      .optional()
      .openapi({ example: "090-1234-5678" }),
    email: z
      .string()
      .nullable()
      .optional()
      .openapi({ example: "hanako.sato@example.com" }),
    address: z
      .string()
      .nullable()
      .optional()
      .openapi({ example: "東京都渋谷区1-2-3" }),
    isMain: z.boolean().optional().openapi({ example: true }),
  })
  .openapi("UpdateEmergencyContact");

export const ErrorSchema = z
  .object({
    error: z.string().openapi({ example: "エラーメッセージ" }),
  })
  .openapi("Error");
