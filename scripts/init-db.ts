import { PrismaClient } from '@prisma/client'

console.log('🚀 Initializing database with Prisma...')

const prisma = new PrismaClient()

try {
  // Test database connection
  await prisma.$connect()
  console.log('✅ Database connection successful')

  // Seed Users (ユーザー)
  console.log('📝 Seeding users...')

  const users = [
    {
      name: '佐藤 一郎',
      age: 75,
      mail: 'ichiro.sato@example.com',
      password: 'password123',
      address: '東京都新宿区西新宿1-1-1',
      comment: '心臓病の既往歴あり。毎日の服薬管理が必要。',
    },
    {
      name: '田中 幸子',
      age: 82,
      mail: 'sachiko.tanaka@example.com',
      password: 'password123',
      address: '東京都渋谷区渋谷2-2-2',
      comment: '認知症の初期症状あり。見守りが必要。',
    },
    {
      name: '山本 健太',
      age: 68,
      mail: 'kenta.yamamoto@example.com',
      password: 'password123',
      address: '東京都品川区大崎3-3-3',
      comment: '糖尿病。食事管理と運動が重要。',
    },
  ]

  const createdUsers = []
  for (const user of users) {
    const created = await prisma.user.upsert({
      where: { mail: user.mail },
      update: user,
      create: user,
    })
    createdUsers.push(created)
  }

  console.log(`✅ Seeded ${users.length} users`)

  // Seed Helpers (介助者)
  console.log('📝 Seeding helpers...')

  const helpers = [
    {
      name: '山田 太郎',
      nickname: '太郎さん',
      phoneNumber: '090-1234-5678',
      email: 'taro.yamada@example.com',
      relationship: '長男',
    },
    {
      name: '山田 花子',
      nickname: '花子さん',
      phoneNumber: '080-2345-6789',
      email: 'hanako.yamada@example.com',
      relationship: '長女',
    },
    {
      name: '田中 次郎',
      nickname: '田中さん',
      phoneNumber: '070-3456-7890',
      email: 'jiro.tanaka@care-service.com',
      relationship: 'ヘルパー',
    },
    {
      name: '佐藤 美咲',
      nickname: '佐藤さん',
      phoneNumber: '080-4567-8901',
      email: 'misaki.sato@care-manager.com',
      relationship: 'ケアマネージャー',
    },
    {
      name: '鈴木 健一',
      nickname: '鈴木さん',
      phoneNumber: '090-5678-9012',
      email: 'kenichi.suzuki@example.com',
      relationship: '近隣住民',
    },
    {
      name: '高橋 恵子',
      nickname: '高橋さん',
      phoneNumber: '080-6789-0123',
      email: 'keiko.takahashi@care-service.com',
      relationship: '訪問看護師',
    },
  ]

  const createdHelpers = []
  for (const helper of helpers) {
    const created = await prisma.helper.upsert({
      where: { email: helper.email },
      update: helper,
      create: helper,
    })
    createdHelpers.push(created)
  }

  console.log(`✅ Seeded ${helpers.length} helpers`)

  // Seed UserStatusCards (ユーザーステータスカード)
  console.log('📝 Seeding user status cards...')

  const statusCards = [
    {
      userId: createdUsers[0].id,
      bloodType: '型',
      allergy: '卵、牛乳',
      medicine: 'アスピリン、降圧剤',
    },
    {
      userId: createdUsers[1].id,
      bloodType: 'O型',
      allergy: 'なし',
      medicine: '認知症治療薬',
    },
    {
      userId: createdUsers[2].id,
      bloodType: 'B型',
      allergy: '卵、牛乳',
      medicine: 'インスリン、メトホルミン',
    },
  ]

  const createdStatusCards = []
  for (const card of statusCards) {
    const created = await prisma.userStatusCard.upsert({
      where: { userId: card.userId },
      update: card,
      create: card,
    })
    createdStatusCards.push(created)
  }

  console.log(`✅ Seeded ${statusCards.length} user status cards`)

  // Seed UserStatusCardDiseases (疾患情報)
  console.log('📝 Seeding user status card diseases...')

  const diseases = [
    { userStatusCardId: createdStatusCards[0].id, name: '高血圧' },
    { userStatusCardId: createdStatusCards[0].id, name: '狭心症' },
    { userStatusCardId: createdStatusCards[1].id, name: 'アルツハイマー型認知症' },
    { userStatusCardId: createdStatusCards[1].id, name: '骨粗しょう症' },
    { userStatusCardId: createdStatusCards[2].id, name: '2型糖尿病' },
    { userStatusCardId: createdStatusCards[2].id, name: '高脂血症' },
  ]

  for (const disease of diseases) {
    await prisma.userStatusCardDisease.create({
      data: disease,
    })
  }

  console.log(`✅ Seeded ${diseases.length} diseases`)

  // Seed UserHelpCards (ヘルプカード)
  console.log('📝 Seeding user help cards...')

  for (const user of createdUsers) {
    await prisma.userHelpCard.upsert({
      where: { userId: user.id },
      update: { userId: user.id },
      create: { userId: user.id },
    })
  }

  console.log(`✅ Seeded ${createdUsers.length} user help cards`)

  // Seed EmergencyContacts (緊急連絡先)
  console.log('📝 Seeding emergency contacts...')

  const emergencyContacts = [
    {
      userId: createdUsers[0].id,
      helperId: createdHelpers[0].id,
      name: '山田 太郎',
      relationship: '長男',
      phoneNumber: '090-1234-5678',
      isMain: true,
    },
    {
      userId: createdUsers[0].id,
      helperId: createdHelpers[3].id,
      name: '佐藤 美咲',
      relationship: 'ケアマネージャー',
      phoneNumber: '080-4567-8901',
      isMain: false,
    },
    {
      userId: createdUsers[1].id,
      helperId: createdHelpers[1].id,
      name: '山田 花子',
      relationship: '長女',
      phoneNumber: '080-2345-6789',
      isMain: true,
    },
    {
      userId: createdUsers[1].id,
      helperId: createdHelpers[5].id,
      name: '高橋 恵子',
      relationship: '訪問看護師',
      phoneNumber: '080-6789-0123',
      isMain: false,
    },
    {
      userId: createdUsers[2].id,
      helperId: createdHelpers[2].id,
      name: '田中 次郎',
      relationship: 'ヘルパー',
      phoneNumber: '070-3456-7890',
      isMain: true,
    },
  ]

  for (const contact of emergencyContacts) {
    await prisma.emergencyContact.upsert({
      where: {
        userId_helperId: {
          userId: contact.userId,
          helperId: contact.helperId,
        },
      },
      update: contact,
      create: contact,
    })
  }

  console.log(`✅ Seeded ${emergencyContacts.length} emergency contacts`)

  // Seed UserSchedules (スケジュール)
  console.log('📝 Seeding user schedules...')

  const now = new Date()
  const schedules = [
    {
      userId: createdUsers[0].id,
      title: '朝の服薬',
      description: '血圧の薬を服用',
      scheduleType: 'medication',
      isRepeat: false,
      startAt: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 7, 0),
    },
    {
      userId: createdUsers[0].id,
      title: '通院',
      description: '心臓内科の定期検診',
      scheduleType: 'appointment',
      isRepeat: false,
      startAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 3, 10, 0),
    },
    {
      userId: createdUsers[1].id,
      title: 'デイサービス',
      description: 'リハビリとレクリエーション',
      scheduleType: 'appointment',
      isRepeat: false,
      startAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 9, 0),
    },
    {
      userId: createdUsers[1].id,
      title: '昼食',
      description: '栄養バランスの取れた食事',
      scheduleType: 'meal',
      isRepeat: false,
      startAt: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0),
    },
    {
      userId: createdUsers[2].id,
      title: 'インスリン注射',
      description: '食前のインスリン投与',
      scheduleType: 'medication',
      isRepeat: false,
      startAt: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 7, 30),
    },
    {
      userId: createdUsers[2].id,
      title: '散歩',
      description: '30分の軽い運動',
      scheduleType: 'rest',
      isRepeat: false,
      startAt: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 15, 0),
    },
  ]

  for (const schedule of schedules) {
    await prisma.userSchedule.create({
      data: schedule,
    })
  }

  console.log(`✅ Seeded ${schedules.length} user schedules`)

  // Seed UserRepeatSchedules (繰り返しスケジュール)
  console.log('📝 Seeding user repeat schedules...')

  const repeatSchedules = [
    {
      userId: createdUsers[0].id,
      title: '朝の服薬',
      description: '毎日朝7時に服薬',
      scheduleType: 'medication',
      interval: 1,
      scheduleTime: new Date('1970-01-01T07:00:00'),
    },
    {
      userId: createdUsers[0].id,
      title: '夜の服薬',
      description: '毎日夜9時に服薬',
      scheduleType: 'medication',
      interval: 1,
      scheduleTime: new Date('1970-01-01T21:00:00'),
    },
    {
      userId: createdUsers[1].id,
      title: '認知症薬服用',
      description: '毎日朝食後に服用',
      scheduleType: 'medication',
      interval: 1,
      scheduleTime: new Date('1970-01-01T08:00:00'),
    },
    {
      userId: createdUsers[2].id,
      title: 'インスリン注射',
      description: '毎日食前に注射',
      scheduleType: 'medication',
      interval: 1,
      scheduleTime: new Date('1970-01-01T07:30:00'),
    },
    {
      userId: createdUsers[2].id,
      title: '血糖測定',
      description: '毎日朝晩測定',
      scheduleType: 'medication',
      interval: 1,
      scheduleTime: new Date('1970-01-01T06:30:00'),
    },
  ]

  for (const schedule of repeatSchedules) {
    await prisma.userRepeatSchedule.create({
      data: schedule,
    })
  }

  console.log(`✅ Seeded ${repeatSchedules.length} user repeat schedules`)

  // Seed AlertHistories (アラート履歴)
  console.log('📝 Seeding alert histories...')

  const alertHistories = [
    {
      userId: createdUsers[0].id,
      title: '服薬リマインダー',
      description: '朝の薬を服用する時間です',
      importance: 2,
      alertType: 'medication',
      createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
    },
    {
      userId: createdUsers[0].id,
      title: '通院予定',
      description: '明後日は心臓内科の予約があります',
      importance: 3,
      alertType: 'appointment',
      createdAt: new Date(now.getTime() - 24 * 60 * 60 * 1000),
    },
    {
      userId: createdUsers[1].id,
      title: 'デイサービス送迎',
      description: '明日9時に送迎車が来ます',
      importance: 2,
      alertType: 'appointment',
      createdAt: new Date(now.getTime() - 12 * 60 * 60 * 1000),
    },
    {
      userId: createdUsers[2].id,
      title: '血糖値異常',
      description: '血糖値が高めです。食事に注意してください',
      importance: 4,
      alertType: 'health',
      createdAt: new Date(now.getTime() - 6 * 60 * 60 * 1000),
    },
    {
      userId: createdUsers[2].id,
      title: 'インスリン残量',
      description: 'インスリンの残量が少なくなっています',
      importance: 3,
      alertType: 'medication',
      createdAt: new Date(now.getTime() - 48 * 60 * 60 * 1000),
    },
  ]

  const createdAlerts = []
  for (const alert of alertHistories) {
    const created = await prisma.alertHistory.create({
      data: alert,
    })
    createdAlerts.push(created)
  }

  console.log(`✅ Seeded ${alertHistories.length} alert histories`)

  // Seed UserAlertHistories (ユーザーアラート履歴)
  console.log('📝 Seeding user alert histories...')

  const userAlertHistories = [
    { userId: createdUsers[0].id, alertId: createdAlerts[0].id, isChecked: true },
    { userId: createdUsers[0].id, alertId: createdAlerts[1].id, isChecked: false },
    { userId: createdUsers[1].id, alertId: createdAlerts[2].id, isChecked: false },
    { userId: createdUsers[2].id, alertId: createdAlerts[3].id, isChecked: true },
    { userId: createdUsers[2].id, alertId: createdAlerts[4].id, isChecked: false },
  ]

  for (const history of userAlertHistories) {
    await prisma.userAlertHistory.upsert({
      where: {
        userId_alertId: {
          userId: history.userId,
          alertId: history.alertId,
        },
      },
      update: history,
      create: history,
    })
  }

  console.log(`✅ Seeded ${userAlertHistories.length} user alert histories`)

  // Seed HelperAlertHistories (介助者アラート履歴)
  console.log('📝 Seeding helper alert histories...')

  const helperAlertHistories = [
    { helperId: createdHelpers[0].id, alertId: createdAlerts[0].id, isChecked: true },
    { helperId: createdHelpers[0].id, alertId: createdAlerts[1].id, isChecked: false },
    { helperId: createdHelpers[3].id, alertId: createdAlerts[1].id, isChecked: true },
    { helperId: createdHelpers[1].id, alertId: createdAlerts[2].id, isChecked: false },
    { helperId: createdHelpers[2].id, alertId: createdAlerts[3].id, isChecked: true },
    { helperId: createdHelpers[2].id, alertId: createdAlerts[4].id, isChecked: false },
  ]

  for (const history of helperAlertHistories) {
    await prisma.helperAlertHistory.upsert({
      where: {
        helperId_alertId: {
          helperId: history.helperId,
          alertId: history.alertId,
        },
      },
      update: history,
      create: history,
    })
  }

  console.log(`✅ Seeded ${helperAlertHistories.length} helper alert histories`)

  console.log('✨ Database initialization completed')

  await prisma.$disconnect()
  process.exit(0)
} catch (error) {
  console.error('💥 Database initialization failed:', error)
  await prisma.$disconnect()
  process.exit(1)
}
