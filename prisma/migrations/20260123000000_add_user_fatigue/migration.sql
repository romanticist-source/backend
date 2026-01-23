-- CreateTable
CREATE TABLE "user_fatigue" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "user_id" TEXT NOT NULL,
    "fatigue_level" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_fatigue_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "user_fatigue" ADD CONSTRAINT "user_fatigue_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
