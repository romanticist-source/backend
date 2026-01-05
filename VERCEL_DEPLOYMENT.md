# Vercel環境変数の設定

このプロジェクトをVercelにデプロイする際には、以下の環境変数を設定する必要があります。

## 必須の環境変数

### DATABASE_URL

PostgreSQLデータベースへの接続文字列

**重要**: Vercelのサーバーレス環境では、connection poolingを使用することを強く推奨します。

```
# 推奨: Connection Poolingを使用
DATABASE_URL="postgresql://username:password@host:5432/database?connection_limit=1&pool_timeout=10"
```

### ALLOWED_ORIGIN

フロントエンドアプリケーションのオリジン（CORS設定）

```
ALLOWED_ORIGIN="https://your-frontend-domain.vercel.app"
```

### NODE_ENV

環境の種類

```
NODE_ENV="production"
```

## Vercelでの環境変数の設定方法

1. Vercelダッシュボードにログイン
2. プロジェクトを選択
3. "Settings" タブをクリック
4. "Environment Variables" セクションに移動
5. 以下の環境変数を追加:
   - Name: `DATABASE_URL`
   - Value: PostgreSQLの接続文字列
   - Environment: Production, Preview, Development (必要に応じて選択)

## データベースのセットアップ

### 推奨オプション

1. **Vercel Postgres**
   - Vercelの統合データベースサービス
   - 自動的に環境変数が設定される
   - <https://vercel.com/docs/storage/vercel-postgres>

2. **Neon**
   - サーバーレスPostgreSQL
   - 無料枠あり
   - <https://neon.tech/>

3. **Supabase**
   - PostgreSQLベースのBaaS
   - 無料枠あり
   - <https://supabase.com/>

4. **Railway**
   - PostgreSQLホスティング
   - 無料枠あり
   - <https://railway.app/>

## デプロイ手順

### 1. Vercel CLIを使用する場合

```bash
# Vercel CLIをインストール
npm install -g vercel

# ログイン
vercel login

# デプロイ
vercel

# 本番環境にデプロイ
vercel --prod
```

### 3. デプロイ後の確認

デプロイが完了したら、以下のエンドポイントにアクセスして動作確認:

- ルート: `https://your-project.vercel.app/`
- Swagger UI: `https://your-project.vercel.app/ui`
- OpenAPI JSON: `https://your-project.vercel.app/doc`

## トラブルシューティング

### 504 Timeout エラー

504 Timeout エラーが発生する場合、以下を確認してください:

1. **DATABASE_URL に connection pooling パラメータを追加**

   ```
   DATABASE_URL="postgresql://username:password@host:5432/database?connection_limit=1&pool_timeout=10"
   ```

2. **データベースが Vercel からアクセス可能か確認**
   - データベースがパブリックインターネットからアクセス可能である必要があります
   - ファイアウォール設定を確認してください

3. **ヘルスチェックエンドポイントで確認**
Vercel の環境変数に `ALLOWED_ORIGIN` を設定してください:

```
ALLOWED_ORIGIN=https://your-frontend-domain.vercel.app
```

複数のオリジンを許可する場合は、`api/index.ts` を修正してください。**Vercel の関数実行時間制限**

- 無料プランでは10秒、Proプランでは最大60秒まで設定可能
- `vercel.json` で `maxDuration` を設定済み（30秒）

### ビルドエラー

Prismaのクライアント生成でエラーが発生する場合:

1. `vercel-build` スクリプトが正しく設定されているか確認
2. `DATABASE_URL` が正しく設定されているか確認

### データベース接続エラー

1. `DATABASE_URL` の形式を確認
2. データベースがインターネットからアクセス可能か確認
3. ファイアウォール設定を確認

### CORS エラー

`api/index.ts` の `allowedOrigins` 配列に本番環境のドメインを追加してください:

```typescript
const allowedOrigins = [
  "http://localhost:8081",
  "https://your-frontend-domain.vercel.app",
];
```

## セキュリティ推奨事項

1. 環境変数は必ずVercelのダッシュボードで設定し、コードにハードコーディングしない
2. データベースの接続文字列には強力なパスワードを使用
3. 本番環境では必ずHTTPSを使用
4. CORS設定で許可するオリジンを適切に制限

## その他の設定

### カスタムドメイン

Vercelダッシュボードの "Domains" タブでカスタムドメインを設定できます。

### 自動デプロイ

GitHubと連携している場合、`main` ブランチへのプッシュで自動的にデプロイされます。
