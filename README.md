# Romanticist Backend

Hexagonal Architecture (Clean Architecture) を採用した Hono + PostgreSQL + Prisma のバックエンドAPI

## 📖 API ドキュメント (Swagger)

サーバーを起動後、以下のURLでSwagger UIを確認できます:

- **Swagger UI**: http://localhost:3000/ui
- **OpenAPI JSON**: http://localhost:3000/doc

Swagger UIでは、各エンドポイントの詳細な仕様を確認でき、直接APIをテストすることができます。

## 🏗️ アーキテクチャ

```
internal/
├── domain/              # ドメイン層（エンティティ、ポート）
├── application/         # アプリケーション層（ユースケース）
├── adapters/           # アダプター層（実装）
│   └── gateways/       # データアクセス実装（Prisma）
└── router/             # HTTPルーター
```

## 🚀 セットアップ

### 1. 依存パッケージのインストール

```bash
pnpm install
```

### 2. 環境変数の設定

`.env.example` を `.env` にコピーして、データベース接続情報を設定します。

```bash
cp .env.example .env
```

`.env` ファイル:
```env
DATABASE_URL=postgres://username:password@localhost:5432/database_name
PORT=3000
```

### 3. PostgreSQLのセットアップ

PostgreSQLサーバーを起動して、データベースを作成します。

```bash
# Docker を使う場合
docker run --name postgres-romanticist \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=romanticist \
  -p 5432:5432 \
  -d postgres:16
```

### 4. データベースのマイグレーション

Prismaを使用してデータベーススキーマを作成します。

```bash
# マイグレーションを実行してテーブルを作成
pnpm db:migrate

# または初回セットアップ時
pnpm db:setup
```

### 5. サーバーの起動

```bash
pnpm dev
```

## 📚 API エンドポイント

### Users API

- `GET /users` - すべてのユーザーを取得（クエリパラメータ: `includeDeleted=true` で削除済みユーザーも含む）
- `GET /users/:id` - 特定のユーザーを取得
- `GET /users/mail/:mail` - メールアドレスでユーザーを取得
- `POST /users` - 新しいユーザーを作成
- `PUT /users/:id` - ユーザー情報を更新
- `DELETE /users/:id` - ユーザーを完全削除（ハードデリート）
- `POST /users/:id/soft-delete` - ユーザーを論理削除（ソフトデリート）

### Helpers API

- `GET /helpers` - すべてのヘルパーを取得
- `GET /helpers/:id` - 特定のヘルパーを取得
- `GET /helpers/email/:email` - メールアドレスでヘルパーを取得
- `POST /helpers` - 新しいヘルパーを作成
- `PUT /helpers/:id` - ヘルパー情報を更新
- `DELETE /helpers/:id` - ヘルパーを削除

### Emergency Contacts API

- `GET /emergency-contacts` - すべての緊急連絡先を取得
- `GET /emergency-contacts/user/:userId` - ユーザーの緊急連絡先を取得
- `GET /emergency-contacts/helper/:helperId` - ヘルパーの緊急連絡先を取得
- `GET /emergency-contacts/:userId/:helperId` - 特定の緊急連絡先を取得
- `POST /emergency-contacts` - 新しい緊急連絡先を作成
- `PUT /emergency-contacts/:userId/:helperId` - 緊急連絡先を更新
- `DELETE /emergency-contacts/:userId/:helperId` - 緊急連絡先を削除

### User Status Cards API

- `GET /user-status-cards/status-cards` - すべてのステータスカードを取得
- `GET /user-status-cards/status-cards/:id` - 特定のステータスカードを取得
- `GET /user-status-cards/status-cards/user/:userId` - ユーザーのステータスカードを取得
- `POST /user-status-cards/status-cards` - 新しいステータスカードを作成
- `PUT /user-status-cards/status-cards/:id` - ステータスカードを更新
- `DELETE /user-status-cards/status-cards/:id` - ステータスカードを削除
- `GET /user-status-cards/diseases` - すべての病名を取得
- `GET /user-status-cards/diseases/:id` - 特定の病名を取得
- `GET /user-status-cards/diseases/status-card/:statusCardId` - ステータスカードの病名を取得
- `POST /user-status-cards/diseases` - 新しい病名を作成
- `PUT /user-status-cards/diseases/:id` - 病名を更新
- `DELETE /user-status-cards/diseases/:id` - 病名を削除

### User Schedules API

- `GET /user-schedules/schedules` - すべてのスケジュールを取得
- `GET /user-schedules/schedules/:id` - 特定のスケジュールを取得
- `GET /user-schedules/schedules/user/:userId` - ユーザーのスケジュールを取得
- `POST /user-schedules/schedules` - 新しいスケジュールを作成
- `PUT /user-schedules/schedules/:id` - スケジュールを更新
- `DELETE /user-schedules/schedules/:id` - スケジュールを削除
- `GET /user-schedules/repeat-schedules` - すべての繰り返しスケジュールを取得
- `GET /user-schedules/repeat-schedules/:id` - 特定の繰り返しスケジュールを取得
- `GET /user-schedules/repeat-schedules/user/:userId` - ユーザーの繰り返しスケジュールを取得
- `POST /user-schedules/repeat-schedules` - 新しい繰り返しスケジュールを作成
- `PUT /user-schedules/repeat-schedules/:id` - 繰り返しスケジュールを更新
- `DELETE /user-schedules/repeat-schedules/:id` - 繰り返しスケジュールを削除

### Alerts API

- `GET /alerts` - すべてのアラートを取得
- `GET /alerts/:id` - 特定のアラートを取得
- `GET /alerts/user/:userId` - ユーザーのアラートを取得
- `POST /alerts` - 新しいアラートを作成
- `PUT /alerts/:id` - アラートを更新
- `DELETE /alerts/:id` - アラートを削除
- `GET /alerts/user-history/:userId` - ユーザーのアラート履歴を取得
- `POST /alerts/:alertHistoryId/check-by-user/:userId` - ユーザーがアラートを確認済みにする
- `GET /alerts/helper-history/:helperId` - ヘルパーのアラート履歴を取得
- `POST /alerts/:alertHistoryId/check-by-helper/:helperId` - ヘルパーがアラートを確認済みにする

### User Help Cards API

- `GET /user-help-cards` - すべてのヘルプカードを取得
- `GET /user-help-cards/:id` - 特定のヘルプカードを取得
- `GET /user-help-cards/user/:userId` - ユーザーのヘルプカードを取得
- `POST /user-help-cards` - 新しいヘルプカードを作成
- `DELETE /user-help-cards/:id` - ヘルプカードを削除

### リクエスト例

#### ユーザーの作成

```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "山田太郎",
    "age": 30,
    "mail": "yamada@example.com",
    "password": "securepassword123",
    "address": "東京都渋谷区",
    "comment": "よろしくお願いします"
  }'
```

#### ユーザーの一覧取得

```bash
curl http://localhost:3000/users
```

#### ユーザーの取得

```bash
curl http://localhost:3000/users/{user-id}
```

#### メールアドレスでユーザーを検索

```bash
curl http://localhost:3000/users/mail/yamada@example.com
```

#### ユーザー情報の更新

```bash
curl -X PUT http://localhost:3000/users/{user-id} \
  -H "Content-Type: application/json" \
  -d '{
    "name": "山田花子",
    "age": 31
  }'
```

#### ユーザーの論理削除

```bash
curl -X POST http://localhost:3000/users/{user-id}/soft-delete
```

#### ユーザーの完全削除

```bash
curl -X DELETE http://localhost:3000/users/{user-id}
```

## 🔧 開発

### Prisma コマンド

```bash
# スキーマを編集後、マイグレーションを作成
pnpm db:migrate

# 本番環境へのマイグレーション適用
pnpm db:migrate:deploy

# Prisma Clientの再生成
pnpm db:generate

# Prisma Studio（GUIツール）を起動
pnpm db:studio

# データベースのリセット（全データ削除）
pnpm db:reset
```

### データベースのリセット

```bash
# PostgreSQL コンテナのリセット
docker stop postgres-romanticist
docker rm postgres-romanticist

# 再度セットアップ
docker run --name postgres-romanticist \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=romanticist \
  -p 5432:5432 \
  -d postgres:16

pnpm db:migrate
```

## 📦 技術スタック

- **Hono** - 高速な Web フレームワーク
- **PostgreSQL** - リレーショナルデータベース
- **Prisma** - 次世代 TypeScript ORM
- **TypeScript** - 型安全な開発

## Hexagonal Architecture
