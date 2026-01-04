import { z } from "../lib/zod.js";

// User Schedule schemas for OpenAPI
export const UserScheduleSchema = z
  .object({
    id: z.string().openapi({ example: "123e4567-e89b-12d3-a456-426614174004" }),
    userId: z
      .string()
      .openapi({ example: "123e4567-e89b-12d3-a456-426614174000" }),
    title: z.string().nullable().openapi({ example: "病院の予約" }),
    description: z.string().nullable().openapi({ example: "内科の定期検診" }),
    scheduleType: z.string().openapi({ example: "hospital" }),
    isRepeat: z.boolean().openapi({ example: false }),
    startAt: z.string().openapi({ example: "2024-01-15T10:00:00.000Z" }),
  })
  .openapi("UserSchedule");

export const CreateUserScheduleSchema = z
  .object({
    userId: z
      .string()
      .openapi({ example: "123e4567-e89b-12d3-a456-426614174000" }),
    title: z
      .string()
      .nullable()
      .default(null)
      .openapi({ example: "病院の予約" }),
    description: z
      .string()
      .nullable()
      .default(null)
      .openapi({ example: "内科の定期検診" }),
    scheduleType: z.string().openapi({ example: "hospital" }),
    isRepeat: z.boolean().openapi({ example: false }),
    startAt: z.string().openapi({ example: "2024-01-15T10:00:00.000Z" }),
  })
  .openapi("CreateUserSchedule");

export const UpdateUserScheduleSchema = z
  .object({
    title: z.string().nullable().optional().openapi({ example: "病院の予約" }),
    description: z
      .string()
      .nullable()
      .optional()
      .openapi({ example: "内科の定期検診" }),
    scheduleType: z.string().optional().openapi({ example: "hospital" }),
    isRepeat: z.boolean().optional().openapi({ example: false }),
    startAt: z
      .string()
      .optional()
      .openapi({ example: "2024-01-15T10:00:00.000Z" }),
  })
  .openapi("UpdateUserSchedule");

export const UserRepeatScheduleSchema = z
  .object({
    id: z.string().openapi({ example: "123e4567-e89b-12d3-a456-426614174005" }),
    userId: z
      .string()
      .openapi({ example: "123e4567-e89b-12d3-a456-426614174000" }),
    title: z.string().openapi({ example: "薬の服用" }),
    description: z.string().openapi({ example: "朝の血圧の薬" }),
    scheduleType: z.string().openapi({ example: "medicine" }),
    interval: z.number().int().openapi({ example: 1 }),
    scheduleTime: z.string().openapi({ example: "08:00" }),
  })
  .openapi("UserRepeatSchedule");

export const CreateUserRepeatScheduleSchema = z
  .object({
    userId: z
      .string()
      .openapi({ example: "123e4567-e89b-12d3-a456-426614174000" }),
    title: z.string().min(1).openapi({ example: "薬の服用" }),
    description: z.string().min(1).openapi({ example: "朝の血圧の薬" }),
    scheduleType: z.string().openapi({ example: "medicine" }),
    interval: z.number().int().positive().openapi({ example: 1 }),
    scheduleTime: z.string().openapi({ example: "08:00" }),
  })
  .openapi("CreateUserRepeatSchedule");

export const UpdateUserRepeatScheduleSchema = z
  .object({
    title: z.string().min(1).optional().openapi({ example: "薬の服用" }),
    description: z
      .string()
      .min(1)
      .optional()
      .openapi({ example: "朝の血圧の薬" }),
    scheduleType: z.string().optional().openapi({ example: "medicine" }),
    interval: z.number().int().positive().optional().openapi({ example: 1 }),
    scheduleTime: z.string().optional().openapi({ example: "08:00" }),
  })
  .openapi("UpdateUserRepeatSchedule");

export const ErrorSchema = z
  .object({
    error: z.string().openapi({ example: "エラーメッセージ" }),
  })
  .openapi("Error");
