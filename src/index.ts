import { Hono } from 'hono'
import { PostgresUserRepository } from '../internal/adapters/gateways/postgres-user-repository.js'
import { PostgresHelperRepository } from '../internal/adapters/gateways/postgres-helper-repository.js'
import { PostgresEmergencyContactRepository } from '../internal/adapters/gateways/postgres-emergency-contact-repository.js'
import { PostgresUserStatusCardRepository, PostgresUserStatusCardDiseaseRepository } from '../internal/adapters/gateways/postgres-user-status-card-repository.js'
import { PostgresUserScheduleRepository, PostgresUserRepeatScheduleRepository } from '../internal/adapters/gateways/postgres-user-schedule-repository.js'
import { PostgresAlertHistoryRepository } from '../internal/adapters/gateways/postgres-alert-history-repository.js'
import { PostgresUserHelpCardRepository } from '../internal/adapters/gateways/postgres-user-help-card-repository.js'

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

// Get database URL from environment variable
const DATABASE_URL = process.env.DATABASE_URL || 'postgres://postgres:password@localhost:5432/romanticist'

// Dependency Injection - Wiring up the Hexagonal Architecture
// User
const userRepository = new PostgresUserRepository(DATABASE_URL)
const userUseCase = new UserUseCase(userRepository)
const userRouter = createUserRouter(userUseCase)

// Helper
const helperRepository = new PostgresHelperRepository(DATABASE_URL)
const helperUseCase = new HelperUseCase(helperRepository)
const helperRouter = createHelperRouter(helperUseCase)

// Emergency Contact
const emergencyContactRepository = new PostgresEmergencyContactRepository(DATABASE_URL)
const emergencyContactUseCase = new EmergencyContactUseCase(emergencyContactRepository)
const emergencyContactRouter = createEmergencyContactRouter(emergencyContactUseCase)

// User Status Card
const userStatusCardRepository = new PostgresUserStatusCardRepository(DATABASE_URL)
const userStatusCardDiseaseRepository = new PostgresUserStatusCardDiseaseRepository(DATABASE_URL)
const userStatusCardUseCase = new UserStatusCardUseCase(userStatusCardRepository, userStatusCardDiseaseRepository)
const userStatusCardRouter = createUserStatusCardRouter(userStatusCardUseCase)

// User Schedule
const userScheduleRepository = new PostgresUserScheduleRepository(DATABASE_URL)
const userRepeatScheduleRepository = new PostgresUserRepeatScheduleRepository(DATABASE_URL)
const userScheduleUseCase = new UserScheduleUseCase(userScheduleRepository, userRepeatScheduleRepository)
const userScheduleRouter = createUserScheduleRouter(userScheduleUseCase)

// Alert History
const alertHistoryRepository = new PostgresAlertHistoryRepository(DATABASE_URL)
const alertHistoryUseCase = new AlertHistoryUseCase(alertHistoryRepository)
const alertHistoryRouter = createAlertHistoryRouter(alertHistoryUseCase)

// User Help Card
const userHelpCardRepository = new PostgresUserHelpCardRepository(DATABASE_URL)
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
