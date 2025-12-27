-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "age" INTEGER,
    "mail" TEXT NOT NULL,
    "icon" TEXT,
    "address" TEXT,
    "comment" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "helper" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "relationship" TEXT NOT NULL,

    CONSTRAINT "helper_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "emergency_contact" (
    "user_id" TEXT NOT NULL,
    "helper_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "relationship" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "is_main" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "emergency_contact_pkey" PRIMARY KEY ("user_id","helper_id")
);

-- CreateTable
CREATE TABLE "user_status_card" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "user_id" TEXT NOT NULL,
    "blood_type" TEXT,
    "allergy" TEXT,
    "medicine" TEXT,
    "height" TEXT,
    "weight" TEXT,
    "disability" TEXT,
    "notes" TEXT,

    CONSTRAINT "user_status_card_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_status_card_disease" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "user_status_card_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "user_status_card_disease_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_help_card" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "user_id" TEXT NOT NULL,
    "hospital_name" TEXT,
    "hospital_phone" TEXT,

    CONSTRAINT "user_help_card_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_schedule" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "user_id" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "schedule_type" TEXT NOT NULL,
    "is_repeat" BOOLEAN NOT NULL,
    "start_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_schedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_repeat_schedule" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "user_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "schedule_type" TEXT NOT NULL,
    "interval" INTEGER NOT NULL,
    "schedule_time" TIME NOT NULL,

    CONSTRAINT "user_repeat_schedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alert_history" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "user_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "importance" SMALLINT NOT NULL,
    "alert_type" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "alert_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_alert_history" (
    "user_id" TEXT NOT NULL,
    "alert_id" TEXT NOT NULL,
    "is_checked" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "user_alert_history_pkey" PRIMARY KEY ("user_id","alert_id")
);

-- CreateTable
CREATE TABLE "helper_alert_history" (
    "helper_id" TEXT NOT NULL,
    "alert_id" TEXT NOT NULL,
    "is_checked" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "helper_alert_history_pkey" PRIMARY KEY ("helper_id","alert_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_mail_key" ON "user"("mail");

-- CreateIndex
CREATE UNIQUE INDEX "helper_email_key" ON "helper"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_status_card_user_id_key" ON "user_status_card"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_help_card_user_id_key" ON "user_help_card"("user_id");

-- AddForeignKey
ALTER TABLE "emergency_contact" ADD CONSTRAINT "emergency_contact_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "emergency_contact" ADD CONSTRAINT "emergency_contact_helper_id_fkey" FOREIGN KEY ("helper_id") REFERENCES "helper"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_status_card" ADD CONSTRAINT "user_status_card_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_status_card_disease" ADD CONSTRAINT "user_status_card_disease_user_status_card_id_fkey" FOREIGN KEY ("user_status_card_id") REFERENCES "user_status_card"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_help_card" ADD CONSTRAINT "user_help_card_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_schedule" ADD CONSTRAINT "user_schedule_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_repeat_schedule" ADD CONSTRAINT "user_repeat_schedule_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alert_history" ADD CONSTRAINT "alert_history_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_alert_history" ADD CONSTRAINT "user_alert_history_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_alert_history" ADD CONSTRAINT "user_alert_history_alert_id_fkey" FOREIGN KEY ("alert_id") REFERENCES "alert_history"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "helper_alert_history" ADD CONSTRAINT "helper_alert_history_helper_id_fkey" FOREIGN KEY ("helper_id") REFERENCES "helper"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "helper_alert_history" ADD CONSTRAINT "helper_alert_history_alert_id_fkey" FOREIGN KEY ("alert_id") REFERENCES "alert_history"("id") ON DELETE CASCADE ON UPDATE CASCADE;
