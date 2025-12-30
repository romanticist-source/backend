# Swagger / OpenAPI 設定ガイド

## 概要

このプロジェクトでは、`@hono/zod-openapi`と`@hono/swagger-ui`を使用してOpenAPI仕様を生成し、Swagger UIでAPIドキュメントを表示できるようになっています。

## アクセス方法

サーバーを起動後、以下のURLにアクセスできます:

- **Swagger UI**: <http://localhost:3000/ui>
- **OpenAPI JSON**: <http://localhost:3000/doc>

## 実装済みの機能

### ✅ Userエンドポイント (OpenAPI対応済み)

`/users` エンドポイントは完全にOpenAPI対応されています:

- すべてのエンドポイントにスキーマ定義
- リクエスト/レスポンスの型検証
- Swagger UIでのインタラクティブなテスト機能
- 日本語の説明とサンプルデータ

### 📝 未対応のエンドポイント

以下のエンドポイントはまだOpenAPI対応していません:

- `/helpers`
- `/emergency-contacts`
- `/user-status-cards`
- `/user-schedules`
- `/alerts`
- `/user-help-cards`

## 新しいエンドポイントをOpenAPI対応にする手順

### 1. スキーマファイルの作成

`internal/schemas/`に新しいスキーマファイルを作成します。

例: `internal/schemas/helper-schema.ts`

```typescript
import { z } from '@hono/zod-openapi'

export const HelperSchema = z.object({
  id: z.string().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
  name: z.string().openapi({ example: '佐藤花子' }),
  email: z.string().email().openapi({ example: 'sato@example.com' }),
  // ... その他のフィールド
}).openapi('Helper')

export const CreateHelperSchema = z.object({
  name: z.string().min(1).openapi({ example: '佐藤花子' }),
  email: z.string().email().openapi({ example: 'sato@example.com' }),
  // ... その他のフィールド
}).openapi('CreateHelper')

export const ErrorSchema = z.object({
  error: z.string().openapi({ example: 'エラーメッセージ' })
}).openapi('Error')
```

### 2. ルーターをOpenAPI対応に変更

```typescript
import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi'
import type { HelperUseCase } from '../application/usecase/helper-usecase.js'
import { HelperSchema, CreateHelperSchema, ErrorSchema } from '../schemas/helper-schema.js'

export function createHelperRouter(helperUseCase: HelperUseCase) {
  const router = new OpenAPIHono()

  // ルート定義
  const getAllHelpersRoute = createRoute({
    method: 'get',
    path: '/',
    tags: ['Helpers'],
    summary: 'すべてのヘルパーを取得',
    description: 'すべてのヘルパー情報を取得します。',
    responses: {
      200: {
        description: 'ヘルパー一覧の取得成功',
        content: {
          'application/json': {
            schema: z.array(HelperSchema)
          }
        }
      },
      500: {
        description: 'サーバーエラー',
        content: {
          'application/json': {
            schema: ErrorSchema
          }
        }
      }
    }
  })

  // ルートハンドラー
  router.openapi(getAllHelpersRoute, async (c) => {
    try {
      const helpers = await helperUseCase.getAllHelpers()
      return c.json(helpers, 200)
    } catch (error) {
      return c.json({ error: 'Failed to fetch helpers' }, 500)
    }
  })

  return router
}
```

### 3. インポートを更新

`api/index.ts`で新しいルーターをインポートします:

```typescript
import { createHelperRouter } from '../internal/router/helper-router-openapi.js'
```

## ベストプラクティス

### 1. 日本語の説明を追加

```typescript
summary: 'ユーザーを取得',
description: '指定されたIDのユーザー情報を取得します。',
```

### 2. 適切なサンプルデータ

```typescript
z.string().openapi({ example: '山田太郎' })
z.number().openapi({ example: 65 })
```

### 3. タグを使用してグループ化

```typescript
tags: ['Users'],  // Swagger UIでグループ化されます
```

### 4. エラーレスポンスを定義

```typescript
responses: {
  200: { /* 成功レスポンス */ },
  404: { /* Not Found */ },
  500: { /* サーバーエラー */ }
}
```

### 5. 型安全性を保つ

```typescript
const { id } = c.req.valid('param')  // 型安全なパラメータ取得
const body = c.req.valid('json')     // 型安全なボディ取得
```

## トラブルシューティング

### Swagger UIが表示されない

1. サーバーが起動しているか確認
2. <http://localhost:3000/doc> でOpenAPI JSONが取得できるか確認
3. ブラウザのコンソールでエラーを確認

### スキーマエラーが出る

1. すべての必須フィールドが定義されているか確認
2. zodのバージョンが正しいか確認
3. `openapi()` メソッドを呼び出しているか確認

### 型エラーが出る

1. `c.req.valid()` を使用しているか確認
2. レスポンスの型がスキーマと一致しているか確認
3. Date型は `toISOString()` で文字列に変換

## 参考リンク

- [Hono OpenAPI Documentation](https://hono.dev/examples/zod-openapi)
- [Zod Documentation](https://zod.dev)
- [OpenAPI Specification](https://swagger.io/specification/)
