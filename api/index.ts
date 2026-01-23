import { OpenAPIHono } from "@hono/zod-openapi";
import { swaggerUI } from "@hono/swagger-ui";
import { PrismaClient } from "@prisma/client";
import { Hono } from "hono"; // Vercel detection

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
import { PrismaHelperConnectRepository } from "../internal/adapters/gateways/prisma-helper-connect-repository.js";

import { AuthUseCase } from "../internal/application/usecase/auth-usecase.js";
import { UserUseCase } from "../internal/application/usecase/user-usecase.js";
import { HelperUseCase } from "../internal/application/usecase/helper-usecase.js";
import { EmergencyContactUseCase } from "../internal/application/usecase/emergency-contact-usecase.js";
import { UserStatusCardUseCase } from "../internal/application/usecase/user-status-card-usecase.js";
import { UserScheduleUseCase } from "../internal/application/usecase/user-schedule-usecase.js";
import { AlertHistoryUseCase } from "../internal/application/usecase/alert-history-usecase.js";
import { UserHelpCardUseCase } from "../internal/application/usecase/user-help-card-usecase.js";
import { HelperConnectUseCase } from "../internal/application/usecase/helper-connect-usecase.js";

import { createAuthRouter } from "../internal/router/auth-router-openapi.js";
import { createUserRouter } from "../internal/router/user-router-openapi.js";
import { createHelperRouter } from "../internal/router/helper-router-openapi.js";
import { createEmergencyContactRouter } from "../internal/router/emergency-contact-router-openapi.js";
import { createUserStatusCardRouter } from "../internal/router/user-status-card-router-openapi.js";
import { createUserScheduleRouter } from "../internal/router/user-schedule-router-openapi.js";
import { createAlertHistoryRouter } from "../internal/router/alert-history-router-openapi.js";
import { createUserHelpCardRouter } from "../internal/router/user-help-card-router-openapi.js";
import { createHelperConnectRouter } from "../internal/router/helper-connect-router-openapi.js";

// Prisma Client singleton for serverless environments
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

const app = new OpenAPIHono();

// Allowed origins for CORS
const allowedOrigins = [
  "http://localhost:8081",
  "http://localhost:3000",
  process.env.ALLOWED_ORIGIN,
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined,
].filter(Boolean) as string[];

// CORS middleware - runs in all environments
app.use("*", async (c, next) => {
  const origin = c.req.header("Origin");
  const isAllowed =
    allowedOrigins.includes(origin as string) ||
    origin?.endsWith(".vercel.app");
  const allowedOrigin = isAllowed ? origin : "*";

  // Set CORS headers before handling request
  c.header("Access-Control-Allow-Origin", allowedOrigin);
  c.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  c.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version, X-CSRF-Token");
  c.header("Access-Control-Allow-Credentials", "true");
  c.header("Access-Control-Max-Age", "86400");

  // Handle preflight requests
  if (c.req.method === "OPTIONS") {
    return c.body(null, 204);
  }

  await next();
});

// Dependency Injection - Wiring up the Hexagonal Architecture
// Auth
const authUserRepository = new PrismaUserRepository(prisma);
const authUseCase = new AuthUseCase(authUserRepository);
const authRouter = createAuthRouter(authUseCase);

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

// Helper Connect
const helperConnectRepository = new PrismaHelperConnectRepository(prisma);
const helperConnectUseCase = new HelperConnectUseCase(helperConnectRepository);
const helperConnectRouter = createHelperConnectRouter(helperConnectUseCase);

const welcomeStrings = [
  "Hello Hono!",
  "To learn more about Hono on Vercel, visit https://vercel.com/docs/frameworks/backend/hono",
];

app.get("/", (c) => {
  return c.text(welcomeStrings.join("\n\n"));
});

// Health check endpoint (doesn't require DB connection)
app.get("/health", (c) => {
  return c.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

// DB health check endpoint
app.get("/health/db", async (c) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return c.json({
      status: "ok",
      database: "connected",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return c.json(
      {
        status: "error",
        database: "disconnected",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      503
    );
  }
});

// Mount routes with /api prefix
app.route("/auth", authRouter);
app.route("/users", userRouter);
app.route("/helpers", helperRouter);
app.route("/emergency-contacts", emergencyContactRouter);
app.route("/user-status-cards", userStatusCardRouter);
app.route("/user-schedules", userScheduleRouter);
app.route("/alerts", alertHistoryRouter);
app.route("/user-help-cards", userHelpCardRouter);
app.route("/helper-connect", helperConnectRouter);

// OpenAPI JSON endpoint
const servers = [];

// Add production server if VERCEL_URL is available
if (process.env.VERCEL_URL) {
  servers.push({
    url: `https://${process.env.VERCEL_URL}`,
    description: "本番環境 (Vercel)",
  });
}

// Add custom production server if API_URL is set
if (process.env.API_URL) {
  servers.push({
    url: process.env.API_URL,
    description: "本番環境",
  });
}

// Always add localhost for development
servers.push({
  url: "http://localhost:3000",
  description: "開発環境",
});

app.doc("/doc", {
  openapi: "3.0.0",
  info: {
    version: "1.0.0",
    title: "HAL Backend API",
    description: "HAL システムのバックエンドAPI",
  },
  servers,
});

// Swagger UI endpoint
app.get("/ui", swaggerUI({ url: "/doc" }));

export default app;
