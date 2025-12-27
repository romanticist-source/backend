import { PrismaClient } from '@prisma/client'

export async function seed(prisma: PrismaClient) {
  // Seed Users (ユーザー)
  console.log('📝 Seeding users...')

  const users = [
    {
      id: 'user-001',
      name: '佐藤 一郎',
      age: 75,
      mail: 'ichiro.sato@example.com',
      address: '東京都新宿区西新宿1-1-1',
      comment: '心臓病の既往歴あり。毎日の服薬管理が必要。',
    },
    {
      id: 'user-002',
      name: '田中 幸子',
      age: 82,
      mail: 'sachiko.tanaka@example.com',
      address: '東京都渋谷区渋谷2-2-2',
      comment: '認知症の初期症状あり。見守りが必要。',
    },
    {
      id: 'user-003',
      name: '山本 健太',
      age: 68,
      mail: 'kenta.yamamoto@example.com',
      address: '東京都品川区大崎3-3-3',
      comment: '糖尿病。食事管理と運動が重要。',
    },
    {
      id: 'user-004',
      name: '鈴木 博',
      age: 70,
      mail: 'hiroshi.suzuki@example.com',
      address: '東京都豊島区池袋4-4-4',
      comment: '健康維持のための予防医療に関心あり。',
    },
    {
      id: 'user-005',
      name: '高橋 由美',
      age: 45,
      mail: 'yumi.takahashi@example.com',
      address: '東京都港区赤坂5-5-5',
      comment: '事故によるリハビリ中。一時的な介助が必要。',
    },
  ]

  const createdUsers = []
  for (const user of users) {
    const { id, ...userData } = user
    const created = await prisma.user.upsert({
      where: { id: user.id },
      update: userData,
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
    {
      name: '中村 医師',
      nickname: '中村先生',
      phoneNumber: '03-1111-2222',
      email: 'nakamura@hospital.com',
      relationship: '主治医',
    },
    {
      name: 'ボランティア 田中',
      nickname: 'ボラさん',
      phoneNumber: '090-9999-8888',
      email: 'volunteer.tanaka@npo.org',
      relationship: 'ボランティア',
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
      bloodType: 'A型',
      allergy: JSON.stringify(['卵', '牛乳']),
      medicine: JSON.stringify([{ name: 'アスピリン' }, { name: '降圧剤' }]),
      height: '165',
      weight: '62',
      disability: '軽度の難聴',
      notes: JSON.stringify({ otherNotes: '大きな声で話しかけてください。左耳が聞こえにくいです。' }),
    },
    {
      userId: createdUsers[1].id,
      bloodType: 'O型',
      allergy: JSON.stringify([]),
      medicine: JSON.stringify([{ name: '認知症治療薬' }]),
      height: '152',
      weight: '48',
      disability: '軽度認知障害',
      notes: JSON.stringify({ otherNotes: '急な環境変化に不安を感じやすいです。ゆっくり説明してください。' }),
    },
    {
      userId: createdUsers[2].id,
      bloodType: 'B型',
      allergy: JSON.stringify(['そば', 'ピーナッツ']),
      medicine: JSON.stringify([{ name: 'インスリン' }, { name: 'メトホルミン' }]),
      height: '170',
      weight: '75',
      disability: '視力低下（糖尿病性網膜症）',
      notes: JSON.stringify({ otherNotes: '低血糖に注意。ブドウ糖を常に携帯しています。' }),
    },
    {
      userId: createdUsers[3].id,
      bloodType: 'AB型',
      allergy: JSON.stringify([]),
      medicine: JSON.stringify([{ name: 'ビタミン剤' }]),
      height: '168',
      weight: '65',
      disability: null,
      notes: JSON.stringify({ otherNotes: '毎朝の散歩を日課にしています。' }),
    },
    {
      userId: createdUsers[4].id,
      bloodType: 'A型',
      allergy: JSON.stringify(['抗生物質']),
      medicine: JSON.stringify([{ name: '鎮痛剤' }, { name: '湿布' }]),
      height: '158',
      weight: '50',
      disability: '右足骨折（リハビリ中）',
      notes: JSON.stringify({ otherNotes: '松葉杖を使用しています。段差に注意が必要です。' }),
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
    // User 1 (Heart)
    { userStatusCardId: createdStatusCards[0].id, name: '高血圧症' },
    { userStatusCardId: createdStatusCards[0].id, name: '労作性狭心症' },
    // User 2 (Dementia)
    { userStatusCardId: createdStatusCards[1].id, name: 'アルツハイマー型認知症' },
    { userStatusCardId: createdStatusCards[1].id, name: '骨粗鬆症' },
    // User 3 (Diabetes)
    { userStatusCardId: createdStatusCards[2].id, name: '2型糖尿病' },
    { userStatusCardId: createdStatusCards[2].id, name: '脂質異常症' },
    { userStatusCardId: createdStatusCards[2].id, name: '糖尿病性網膜症' },
    // User 4 (Healthy/Preventive)
    { userStatusCardId: createdStatusCards[3].id, name: '花粉症' },
    { userStatusCardId: createdStatusCards[3].id, name: '変形性膝関節症' },
    // User 5 (Rehab)
    { userStatusCardId: createdStatusCards[4].id, name: '右脛骨骨折' },
    { userStatusCardId: createdStatusCards[4].id, name: '外傷性頸部症候群' },
  ]

  for (const disease of diseases) {
    await prisma.userStatusCardDisease.create({
      data: disease,
    })
  }

  console.log(`✅ Seeded ${diseases.length} diseases`)

  // Seed UserHelpCards (ヘルプカード)
  console.log('📝 Seeding user help cards...')

  const helpCards = [
    {
      userId: createdUsers[0].id,
      hospitalName: '新宿中央病院',
      hospitalPhone: '03-1234-5678',
    },
    {
      userId: createdUsers[1].id,
      hospitalName: '渋谷メモリークリニック',
      hospitalPhone: '03-2345-6789',
    },
    {
      userId: createdUsers[2].id,
      hospitalName: '品川糖尿病センター',
      hospitalPhone: '03-3456-7890',
    },
    {
      userId: createdUsers[3].id,
      hospitalName: '豊島総合病院',
      hospitalPhone: '03-5555-6666',
    },
    {
      userId: createdUsers[4].id,
      hospitalName: '赤坂整形外科',
      hospitalPhone: '03-7777-8888',
    },
  ]

  for (const helpCard of helpCards) {
    await prisma.userHelpCard.upsert({
      where: { userId: helpCard.userId },
      update: helpCard,
      create: helpCard,
    })
  }

  console.log(`✅ Seeded ${helpCards.length} user help cards`)

  // Seed EmergencyContacts (緊急連絡先)
  console.log('📝 Seeding emergency contacts...')

  const emergencyContacts = [
    // User 1 Contacts
    {
      userId: createdUsers[0].id,
      helperId: createdHelpers[0].id, // Son
      name: '山田 太郎',
      relationship: '長男',
      phoneNumber: '090-1234-5678',
      email: 'taro.yamada@example.com',
      address: '東京都世田谷区三軒茶屋1-1-1',
      isMain: true,
    },
    {
      userId: createdUsers[0].id,
      helperId: createdHelpers[3].id, // Care Manager
      name: '佐藤 美咲',
      relationship: 'ケアマネージャー',
      phoneNumber: '080-4567-8901',
      email: 'misaki.sato@care-manager.com',
      address: '東京都新宿区高田馬場2-2-2',
      isMain: false,
    },
    // User 2 Contacts
    {
      userId: createdUsers[1].id,
      helperId: createdHelpers[1].id, // Daughter
      name: '山田 花子',
      relationship: '長女',
      phoneNumber: '080-2345-6789',
      email: 'hanako.yamada@example.com',
      address: '東京都目黒区中目黒3-3-3',
      isMain: true,
    },
    {
      userId: createdUsers[1].id,
      helperId: createdHelpers[5].id, // Nurse
      name: '高橋 恵子',
      relationship: '訪問看護師',
      phoneNumber: '080-6789-0123',
      email: 'keiko.takahashi@care-service.com',
      address: '東京都港区六本木4-4-4',
      isMain: false,
    },
    // User 3 Contacts
    {
      userId: createdUsers[2].id,
      helperId: createdHelpers[2].id, // Helper
      name: '田中 次郎',
      relationship: 'ヘルパー',
      phoneNumber: '070-3456-7890',
      email: 'jiro.tanaka@care-service.com',
      address: '東京都品川区五反田5-5-5',
      isMain: true,
    },
    {
      userId: createdUsers[2].id,
      helperId: createdHelpers[6].id, // Doctor
      name: '中村 医師',
      relationship: '主治医',
      phoneNumber: '03-1111-2222',
      email: 'nakamura@hospital.com',
      address: '東京都品川区大崎病院',
      isMain: false,
    },
    // User 4 Contacts
    {
      userId: createdUsers[3].id,
      helperId: createdHelpers[4].id, // Neighbor
      name: '鈴木 健一',
      relationship: '近隣住民',
      phoneNumber: '090-5678-9012',
      email: 'kenichi.suzuki@example.com',
      address: '東京都豊島区池袋4-4-5',
      isMain: true,
    },
    // User 5 Contacts
    {
      userId: createdUsers[4].id,
      helperId: createdHelpers[7].id, // Volunteer
      name: 'ボランティア 田中',
      relationship: 'ボランティア',
      phoneNumber: '090-9999-8888',
      email: 'volunteer.tanaka@npo.org',
      address: '東京都港区赤坂NPOセンター',
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
    // User 1
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
    // User 2
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
    // User 3
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
    // User 4
    {
      userId: createdUsers[3].id,
      title: '健康診断',
      description: '年1回の定期健診',
      scheduleType: 'appointment',
      isRepeat: false,
      startAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 10, 9, 30),
    },
    {
      userId: createdUsers[3].id,
      title: 'ゲートボール',
      description: '地域のサークル活動',
      scheduleType: 'social',
      isRepeat: false,
      startAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2, 14, 0),
    },
    // User 5
    {
      userId: createdUsers[4].id,
      title: 'リハビリ',
      description: '理学療法士によるリハビリ',
      scheduleType: 'rehabilitation',
      isRepeat: false,
      startAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 11, 0),
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
    // User 1
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
    // User 2
    {
      userId: createdUsers[1].id,
      title: '認知症薬服用',
      description: '毎日朝食後に服用',
      scheduleType: 'medication',
      interval: 1,
      scheduleTime: new Date('1970-01-01T08:00:00'),
    },
    // User 3
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
    // User 4
    {
      userId: createdUsers[3].id,
      title: 'ラジオ体操',
      description: '毎朝の習慣',
      scheduleType: 'rest',
      interval: 1,
      scheduleTime: new Date('1970-01-01T06:30:00'),
    },
    // User 5
    {
      userId: createdUsers[4].id,
      title: 'ストレッチ',
      description: '就寝前のストレッチ',
      scheduleType: 'rehabilitation',
      interval: 1,
      scheduleTime: new Date('1970-01-01T22:00:00'),
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
    {
      userId: createdUsers[1].id,
      title: '徘徊検知',
      description: '自宅から離れた場所に移動しています',
      importance: 5,
      alertType: 'emergency',
      createdAt: new Date(now.getTime() - 1 * 60 * 60 * 1000),
    },
    {
      userId: createdUsers[3].id,
      title: 'システムメンテナンス',
      description: '明日深夜にメンテナンスを行います',
      importance: 1,
      alertType: 'system',
      createdAt: new Date(now.getTime() - 72 * 60 * 60 * 1000),
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
    { userId: createdUsers[1].id, alertId: createdAlerts[5].id, isChecked: false }, // Emergency
    { userId: createdUsers[3].id, alertId: createdAlerts[6].id, isChecked: true }, // System
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
    { helperId: createdHelpers[1].id, alertId: createdAlerts[5].id, isChecked: false }, // Emergency for Daughter
    { helperId: createdHelpers[5].id, alertId: createdAlerts[5].id, isChecked: false }, // Emergency for Nurse
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
}
