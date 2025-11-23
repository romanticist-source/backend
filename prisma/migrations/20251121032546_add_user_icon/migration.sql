/*
  Warnings:

  - You are about to drop the column `password` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user" DROP COLUMN "password",
ADD COLUMN     "icon" TEXT,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "age" DROP NOT NULL;
