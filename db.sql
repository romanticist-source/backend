CREATE TABLE "user" (
  "id" VARCHAR PRIMARY KEY DEFAULT UUID_v7(),
  "name" VARCHAR NOT NULL,
  "age" INT NOT NULL,
  "mail" VARCHAR NOT NULL,
  "password" VARCHAR NOT NULL,
  "address" VARCHAR,
  "comment" VARCHAR,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "is_deleted" BOOLEAN DEFAULT FALSE
);
CREATE TABLE "helper" (
  "id" VARCHAR PRIMARY KEY DEFAULT UUID_v7(),
  "name" VARCHAR NOT NULL,
  "nickname" VARCHAR NOT NULL,
  "phone_number" VARCHAR NOT NULL,
  "email" VARCHAR NOT NULL,
  "relationship" VARCHAR NOT NULL
);
CREATE TABLE "emergency_contact" (
  "user_id" VARCHAR NOT NULL,
  "helper_id" VARCHAR NOT NULL,
  "name" VARCHAR NOT NULL,
  "relationship" VARCHAR NOT NULL,
  "phone_number" VARCHAR NOT NULL,
  "is_main" BOOLEAN DEFAULT FALSE
);
CREATE TABLE "user_status_card" (
  "id" VARCHAR PRIMARY KEY,
  "user_id" VARCHAR NOT NULL,
  "blood_type" VARCHAR,
  "allergy" VARCHAR,
  "medicine" VARCHAR
);
CREATE TABLE "user_status_card_disease" (
  "id" VARCHAR PRIMARY KEY,
  "user_status_card_id" VARCHAR NOT NULL,
  "name" VARCHAR NOT NULL
);
CREATE TABLE "user_help_card" (
  "id" VARCHAR PRIMARY KEY,
  "user_id" VARCHAR NOT NULL
);
CREATE TABLE "user_schedule" (
  "id" VARCHAR PRIMARY KEY,
  "user_id" VARCHAR NOT NULL,
  "title" VARCHAR,
  "description" TEXT,
  "schedule_type" VARCHAR NOT NULL,
  "is_repeat" BOOLEAN NOT NULL,
  "start_at" TIMESTAMP NOT NULL
);
CREATE TABLE "user_repeat_schedule" (
  "id" VARCHAR PRIMARY KEY,
  "user_id" VARCHAR NOT NULL,
  "title" VARCHAR NOT NULL,
  "description" VARCHAR NOT NULL,
  "schedule_type" VARCHAR NOT NULL,
  "interval" INT NOT NULL,
  "schedule_time" TIME NOT NULL
);
CREATE TABLE "alert_history" (
  "id" VARCHAR PRIMARY KEY,
  "user_id" VARCHAR NOT NULL,
  "title" VARCHAR NOT NULL,
  "description" VARCHAR NOT NULL,
  "importance" SMALLINT NOT NULL,
  "alert_type" VARCHAR NOT NULL,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE "user_alert_history" (
  "user_id" VARCHAR NOT NULL,
  "alert_id" VARCHAR NOT NULL,
  "is_checked" BOOLEAN DEFAULT FALSE
);
CREATE TABLE "helper_alert_history" (
  "helper_id" VARCHAR NOT NULL,
  "alert_id" VARCHAR NOT NULL,
  "is_checked" BOOLEAN DEFAULT FALSE
);
ALTER TABLE "user_status_card"
ADD FOREIGN KEY ("user_id") REFERENCES "user" ("id");
ALTER TABLE "user_help_card"
ADD FOREIGN KEY ("user_id") REFERENCES "user" ("id");
ALTER TABLE "alert_history"
ADD FOREIGN KEY ("user_id") REFERENCES "user" ("id");
ALTER TABLE "user_schedule"
ADD FOREIGN KEY ("user_id") REFERENCES "user" ("id");
ALTER TABLE "emergency_contact"
ADD FOREIGN KEY ("user_id") REFERENCES "user" ("id");
ALTER TABLE "emergency_contact"
ADD FOREIGN KEY ("helper_id") REFERENCES "helper" ("id");
ALTER TABLE "user_repeat_schedule"
ADD FOREIGN KEY ("user_id") REFERENCES "user" ("id");
ALTER TABLE "helper_alert_history"
ADD FOREIGN KEY ("helper_id") REFERENCES "helper" ("id");
ALTER TABLE "helper_alert_history"
ADD FOREIGN KEY ("alert_id") REFERENCES "alert_history" ("id");
ALTER TABLE "user_status_card_disease"
ADD FOREIGN KEY ("user_status_card_id") REFERENCES "user_status_card" ("id");
ALTER TABLE "user_alert_history"
ADD FOREIGN KEY ("user_id") REFERENCES "user" ("id");
ALTER TABLE "user_alert_history"
ADD FOREIGN KEY ("alert_id") REFERENCES "alert_history" ("id");