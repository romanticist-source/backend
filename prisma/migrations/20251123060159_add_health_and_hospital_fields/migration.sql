-- AlterTable
ALTER TABLE "user_help_card" ADD COLUMN     "hospital_name" TEXT,
ADD COLUMN     "hospital_phone" TEXT;

-- AlterTable
ALTER TABLE "user_status_card" ADD COLUMN     "disability" TEXT,
ADD COLUMN     "height" TEXT,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "weight" TEXT;
