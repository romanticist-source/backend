/*
  Warnings:

  - Added the required column `updated_at` to the `helper` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
-- Step 1: Add columns with nullable or default values
ALTER TABLE "helper" ADD COLUMN     "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "is_deleted" BOOLEAN DEFAULT false,
ADD COLUMN     "password" TEXT,
ADD COLUMN     "updated_at" TIMESTAMP(3);

-- Step 2: Update existing rows with current timestamp
UPDATE "helper" SET "created_at" = CURRENT_TIMESTAMP WHERE "created_at" IS NULL;
UPDATE "helper" SET "updated_at" = CURRENT_TIMESTAMP WHERE "updated_at" IS NULL;
UPDATE "helper" SET "is_deleted" = false WHERE "is_deleted" IS NULL;

-- Step 3: Make columns NOT NULL
ALTER TABLE "helper" ALTER COLUMN "created_at" SET NOT NULL;
ALTER TABLE "helper" ALTER COLUMN "updated_at" SET NOT NULL;
ALTER TABLE "helper" ALTER COLUMN "is_deleted" SET NOT NULL;

-- CreateTable
CREATE TABLE "helper_connect" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "user_id" TEXT NOT NULL,
    "helper_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "deleted_at" TIMESTAMP(3),
    "deleted_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "helper_connect_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "helper_connect_user_id_helper_id_key" ON "helper_connect"("user_id", "helper_id");

-- AddForeignKey
ALTER TABLE "helper_connect" ADD CONSTRAINT "helper_connect_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "helper_connect" ADD CONSTRAINT "helper_connect_helper_id_fkey" FOREIGN KEY ("helper_id") REFERENCES "helper"("id") ON DELETE CASCADE ON UPDATE CASCADE;
