import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client'

import { PrismaUserRepository } from '../internal/adapters/gateways/prisma-user-repository.js'
import { PrismaHelperRepository } from '../internal/adapters/gateways/prisma-helper-repository.js'
import { PrismaEmergencyContactRepository } from '../internal/adapters/gateways/prisma-emergency-contact-repository.js'
import { PrismaUserStatusCardRepository, PrismaUserStatusCardDiseaseRepository } from '../internal/adapters/gateways/prisma-user-status-card-repository.js'
import { PrismaUserScheduleRepository, PrismaUserRepeatScheduleRepository } from '../internal/adapters/gateways/prisma-user-schedule-repository.js'
import { PrismaAlertHistoryRepository } from '../internal/adapters/gateways/prisma-alert-history-repository.js'
import { PrismaUserHelpCardRepository } from '../internal/adapters/gateways/prisma-user-help-card-repository.js'

import { UserUseCase } from '../internal/application/usecase/user-usecase.js'
import { HelperUseCase } from '../internal/application/usecase/helper-usecase.js'
import { EmergencyContactUseCase } from '../internal/application/usecase/emergency-contact-usecase.js'
import { UserStatusCardUseCase } from '../internal/application/usecase/user-status-card-usecase.js'
import { UserScheduleUseCase } from '../internal/application/usecase/user-schedule-usecase.js'
import { AlertHistoryUseCase } from '../internal/application/usecase/alert-history-usecase.js'
import { UserHelpCardUseCase } from '../internal/application/usecase/user-help-card-usecase.js'

import { createUserRouter } from '../internal/router/user-router.js'
import { createHelperRouter } from '../internal/router/helper-router.js'
import { createEmergencyContactRouter } from '../internal/router/emergency-contact-router.js'
import { createUserStatusCardRouter } from '../internal/router/user-status-card-router.js'
import { createUserScheduleRouter } from '../internal/router/user-schedule-router.js'
import { createAlertHistoryRouter } from '../internal/router/alert-history-router.js'
import { createUserHelpCardRouter } from '../internal/router/user-help-card-router.js'

const app = new Hono()

// Initialize Prisma Client
const prisma = new PrismaClient()

// Dependency Injection - Wiring up the Hexagonal Architecture
// User
const userRepository = new PrismaUserRepository(prisma)
const userUseCase = new UserUseCase(userRepository)
const userRouter = createUserRouter(userUseCase)

// Helper
const helperRepository = new PrismaHelperRepository(prisma)
const helperUseCase = new HelperUseCase(helperRepository)
const helperRouter = createHelperRouter(helperUseCase)

// Emergency Contact
const emergencyContactRepository = new PrismaEmergencyContactRepository(prisma)
const emergencyContactUseCase = new EmergencyContactUseCase(emergencyContactRepository)
const emergencyContactRouter = createEmergencyContactRouter(emergencyContactUseCase)

// User Status Card
const userStatusCardRepository = new PrismaUserStatusCardRepository(prisma)
const userStatusCardDiseaseRepository = new PrismaUserStatusCardDiseaseRepository(prisma)
const userStatusCardUseCase = new UserStatusCardUseCase(userStatusCardRepository, userStatusCardDiseaseRepository)
const userStatusCardRouter = createUserStatusCardRouter(userStatusCardUseCase)

// User Schedule
const userScheduleRepository = new PrismaUserScheduleRepository(prisma)
const userRepeatScheduleRepository = new PrismaUserRepeatScheduleRepository(prisma)
const userScheduleUseCase = new UserScheduleUseCase(userScheduleRepository, userRepeatScheduleRepository)
const userScheduleRouter = createUserScheduleRouter(userScheduleUseCase)

// Alert History
const alertHistoryRepository = new PrismaAlertHistoryRepository(prisma)
const alertHistoryUseCase = new AlertHistoryUseCase(alertHistoryRepository)
const alertHistoryRouter = createAlertHistoryRouter(alertHistoryUseCase)

// User Help Card
const userHelpCardRepository = new PrismaUserHelpCardRepository(prisma)
const userHelpCardUseCase = new UserHelpCardUseCase(userHelpCardRepository)
const userHelpCardRouter = createUserHelpCardRouter(userHelpCardUseCase)

const welcomeStrings = [
  'Hello Hono!',
  'To learn more about Hono on Vercel, visit https://vercel.com/docs/frameworks/backend/hono'
]

app.get('/', (c) => {
  return c.text(welcomeStrings.join('\n\n'))
})

// Mount routes
app.route('/users', userRouter)
app.route('/helpers', helperRouter)
app.route('/emergency-contacts', emergencyContactRouter)
app.route('/user-status-cards', userStatusCardRouter)
app.route('/user-schedules', userScheduleRouter)
app.route('/alerts', alertHistoryRouter)
app.route('/user-help-cards', userHelpCardRouter)

export default app
