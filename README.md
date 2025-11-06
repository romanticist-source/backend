# Romanticist Backend

Hexagonal Architecture (Clean Architecture) を採用した Hono + PostgreSQL のバックエンドAPI

## 🏗️ アーキテクチャ

```
internal/
├── domain/              # ドメイン層（エンティティ、ポート）
├── application/         # アプリケーション層（ユースケース）
├── adapters/           # アダプター層（実装）
│   └── gateways/       # データアクセス実装
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

### 4. データベースの初期化

テーブルとインデックスを作成します。

```bash
pnpm db:init
```

### 5. サーバーの起動

```bash
pnpm dev
```

## 📚 API エンドポイント

### Articles API

- `GET /articles` - すべての記事を取得
- `GET /articles/:id` - 特定の記事を取得
- `POST /articles` - 新しい記事を作成
- `PUT /articles/:id` - 記事を更新
- `DELETE /articles/:id` - 記事を削除

### リクエスト例

#### 記事の作成
```bash
curl -X POST http://localhost:3000/articles \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Hello World",
    "content": "This is my first article",
    "authorId": "user-123"
  }'
```

#### 記事の一覧取得
```bash
curl http://localhost:3000/articles
```

#### 記事の取得
```bash
curl http://localhost:3000/articles/1
```

#### 記事の更新
```bash
curl -X PUT http://localhost:3000/articles/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Title",
    "content": "Updated content"
  }'
```

#### 記事の削除
```bash
curl -X DELETE http://localhost:3000/articles/1
```

## 🔧 開発

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

pnpm db:init
```

## 📦 技術スタック

- **Hono** - 高速な Web フレームワーク
- **PostgreSQL** - リレーショナルデータベース
- **postgres.js** - PostgreSQL クライアント
- **TypeScript** - 型安全な開発

## 🎯 Hexagonal Architecture の利点

1. **依存性の逆転**: ドメイン層が外部の実装に依存しない
2. **テスタビリティ**: インターフェースを通じて簡単にモックやスタブを作成可能
3. **拡張性**: 新しいアダプターを追加することで、異なるデータソースやUIに対応可能
4. **保守性**: ビジネスロジックとインフラストラクチャが分離されている
