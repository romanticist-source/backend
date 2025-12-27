# Vercel環境変数の設定

このプロジェクトをVercelにデプロイする際には、以下の環境変数を設定する必要があります。

## 必須の環境変数

### DATABASE_URL
PostgreSQLデータベースへの接続文字列

```
DATABASE_URL="postgresql://username:password@host:5432/database?schema=public"
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
   - https://vercel.com/docs/storage/vercel-postgres

2. **Neon**
   - サーバーレスPostgreSQL
   - 無料枠あり
   - https://neon.tech/

3. **Supabase**
   - PostgreSQLベースのBaaS
   - 無料枠あり
   - https://supabase.com/

4. **Railway**
   - PostgreSQLホスティング
   - 無料枠あり
   - https://railway.app/

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

### 2. GitHubとの連携

1. GitHubリポジトリにコードをプッシュ
2. Vercelダッシュボードで "Import Project" をクリック
3. GitHubリポジトリを選択
4. 環境変数を設定
5. デプロイ

### 3. デプロイ後の確認

デプロイが完了したら、以下のエンドポイントにアクセスして動作確認:

- ルート: `https://your-project.vercel.app/`
- Swagger UI: `https://your-project.vercel.app/ui`
- OpenAPI JSON: `https://your-project.vercel.app/doc`

## トラブルシューティング

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
