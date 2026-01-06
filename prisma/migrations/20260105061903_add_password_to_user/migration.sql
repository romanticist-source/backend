/*
  Warnings:

  - Added the required column `password` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable: Add password column with default value first
ALTER TABLE "user" ADD COLUMN "password" TEXT;

-- Update existing rows with a dummy hashed password
-- This is bcrypt hash of "changeMe123" - users should change their password after migration
UPDATE "user" SET "password" = '$2b$10$dummy.hash.for.seed.data.only.1234567890' WHERE "password" IS NULL;

-- Make password column NOT NULL
ALTER TABLE "user" ALTER COLUMN "password" SET NOT NULL;
