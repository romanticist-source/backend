import { OpenAPIHono } from "@hono/zod-openapi";
import { swaggerUI } from "@hono/swagger-ui";
import { cors } from "hono/cors";
import { PrismaClient } from "@prisma/client";
import { serve } from "@hono/node-server";
import { handle } from "hono/vercel";

import { PrismaUserRepository } from "../internal/adapters/gateways/prisma-user-repository.js";
import { PrismaHelperRepository } from "../internal/adapters/gateways/prisma-helper-repository.js";
import { PrismaEmergencyContactRepository } from "../internal/adapters/gateways/prisma-emergency-contact-repository.js";
import {
  PrismaUserStatusCardRepository,
  PrismaUserStatusCardDiseaseRepository,
} from "../internal/adapters/gateways/prisma-user-status-card-repository.js";
import {
  PrismaUserScheduleRepository,
  PrismaUserRepeatScheduleRepository,
} from "../internal/adapters/gateways/prisma-user-schedule-repository.js";
import { PrismaAlertHistoryRepository } from "../internal/adapters/gateways/prisma-alert-history-repository.js";
import { PrismaUserHelpCardRepository } from "../internal/adapters/gateways/prisma-user-help-card-repository.js";

import { UserUseCase } from "../internal/application/usecase/user-usecase.js";
import { HelperUseCase } from "../internal/application/usecase/helper-usecase.js";
import { EmergencyContactUseCase } from "../internal/application/usecase/emergency-contact-usecase.js";
import { UserStatusCardUseCase } from "../internal/application/usecase/user-status-card-usecase.js";
import { UserScheduleUseCase } from "../internal/application/usecase/user-schedule-usecase.js";
import { AlertHistoryUseCase } from "../internal/application/usecase/alert-history-usecase.js";
import { UserHelpCardUseCase } from "../internal/application/usecase/user-help-card-usecase.js";

import { createUserRouter } from "../internal/router/user-router-openapi.js";
import { createHelperRouter } from "../internal/router/helper-router-openapi.js";
import { createEmergencyContactRouter } from "../internal/router/emergency-contact-router-openapi.js";
import { createUserStatusCardRouter } from "../internal/router/user-status-card-router-openapi.js";
import { createUserScheduleRouter } from "../internal/router/user-schedule-router-openapi.js";
import { createAlertHistoryRouter } from "../internal/router/alert-history-router-openapi.js";
import { createUserHelpCardRouter } from "../internal/router/user-help-card-router-openapi.js";

const app = new OpenAPIHono();
const allowedOrigin = "http://localhost:8081";
// CORS middleware
app.use(
  "*",
  cors({
    origin: allowedOrigin,
    allowMethods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Initialize Prisma Client
const prisma = new PrismaClient();

// Dependency Injection - Wiring up the Hexagonal Architecture
// User
const userRepository = new PrismaUserRepository(prisma);
const userUseCase = new UserUseCase(userRepository);
const userRouter = createUserRouter(userUseCase);

// Helper
const helperRepository = new PrismaHelperRepository(prisma);
const helperUseCase = new HelperUseCase(helperRepository);
const helperRouter = createHelperRouter(helperUseCase);

// Emergency Contact
const emergencyContactRepository = new PrismaEmergencyContactRepository(prisma);
const emergencyContactUseCase = new EmergencyContactUseCase(
  emergencyContactRepository
);
const emergencyContactRouter = createEmergencyContactRouter(
  emergencyContactUseCase
);

// User Status Card
const userStatusCardRepository = new PrismaUserStatusCardRepository(prisma);
const userStatusCardDiseaseRepository =
  new PrismaUserStatusCardDiseaseRepository(prisma);
const userStatusCardUseCase = new UserStatusCardUseCase(
  userStatusCardRepository,
  userStatusCardDiseaseRepository
);
const userStatusCardRouter = createUserStatusCardRouter(userStatusCardUseCase);

// User Schedule
const userScheduleRepository = new PrismaUserScheduleRepository(prisma);
const userRepeatScheduleRepository = new PrismaUserRepeatScheduleRepository(
  prisma
);
const userScheduleUseCase = new UserScheduleUseCase(
  userScheduleRepository,
  userRepeatScheduleRepository
);
const userScheduleRouter = createUserScheduleRouter(userScheduleUseCase);

// Alert History
const alertHistoryRepository = new PrismaAlertHistoryRepository(prisma);
const alertHistoryUseCase = new AlertHistoryUseCase(alertHistoryRepository);
const alertHistoryRouter = createAlertHistoryRouter(alertHistoryUseCase);

// User Help Card
const userHelpCardRepository = new PrismaUserHelpCardRepository(prisma);
const userHelpCardUseCase = new UserHelpCardUseCase(userHelpCardRepository);
const userHelpCardRouter = createUserHelpCardRouter(userHelpCardUseCase);

const welcomeStrings = [
  "Hello Hono!",
  "To learn more about Hono on Vercel, visit https://vercel.com/docs/frameworks/backend/hono",
];

app.get("/", (c) => {
  return c.text(welcomeStrings.join("\n\n"));
});

// Mount routes with /api prefix
app.route("/users", userRouter);
app.route("/helpers", helperRouter);
app.route("/emergency-contacts", emergencyContactRouter);
app.route("/user-status-cards", userStatusCardRouter);
app.route("/user-schedules", userScheduleRouter);
app.route("/alerts", alertHistoryRouter);
app.route("/user-help-cards", userHelpCardRouter);

// OpenAPI JSON endpoint
app.doc("/doc", {
  openapi: "3.0.0",
  info: {
    version: "1.0.0",
    title: "HAL Backend API",
    description: "HAL システムのバックエンドAPI",
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "開発環境",
    },
  ],
});

// Swagger UI endpoint
app.get("/ui", swaggerUI({ url: "/doc" }));

// Start the server only in development (not on Vercel)
if (process.env.NODE_ENV !== 'production') {
  const port = Number(process.env.PORT) || 3000;
  serve({
    fetch: app.fetch,
    port,
  });

  console.log(`🚀 Server is running on http://localhost:${port}`);
  console.log(`📚 Swagger UI: http://localhost:${port}/ui`);
  console.log(`📄 OpenAPI JSON: http://localhost:${port}/doc`);
}

export default handle(app);
