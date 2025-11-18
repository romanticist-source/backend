# Swagger UI クイックスタートガイド

## 🎉 セットアップ完了!

バックエンドAPIのSwagger/OpenAPIドキュメントが利用可能になりました。

## 📍 アクセス方法

### 1. サーバーを起動

```bash
pnpm dev
```

### 2. Swagger UIを開く

ブラウザで以下のURLにアクセス:

**<http://localhost:3000/ui>**

### 3. OpenAPI仕様を確認

JSON形式のOpenAPI仕様:

**<http://localhost:3000/doc>**

## 🧪 APIをテストする

### Swagger UIでのテスト手順

#### 1. GET /users - すべてのユーザーを取得

1. Swagger UIで「Users」セクションを展開
2. `GET /users` をクリック
3. 「Try it out」ボタンをクリック
4. 「Execute」ボタンをクリック
5. レスポンスを確認

#### 2. POST /users - 新規ユーザーを作成

1. `POST /users` をクリック
2. 「Try it out」ボタンをクリック
3. リクエストボディを編集:

```json
{
  "name": "山田太郎",
  "age": 65,
  "mail": "yamada@example.com",
  "password": "password123",
  "address": "東京都渋谷区1-1-1",
  "comment": "テストユーザー"
}
```

4. 「Execute」ボタンをクリック
5. レスポンス(201 Created)を確認

#### 3. GET /users/{id} - 特定のユーザーを取得

1. `GET /users/{id}` をクリック
2. 「Try it out」ボタンをクリック
3. `id` フィールドに作成したユーザーのIDを入力
4. 「Execute」ボタンをクリック
5. レスポンスを確認

## 📚 利用可能なエンドポイント

### ✅ OpenAPI対応済み (Swagger UIでテスト可能)

#### User API (`/users`)

| メソッド | エンドポイント | 説明 |
|---------|--------------|------|
| GET | `/users` | すべてのユーザーを取得 |
| GET | `/users/{id}` | IDでユーザーを取得 |
| GET | `/users/mail/{mail}` | メールアドレスでユーザーを取得 |
| POST | `/users` | 新規ユーザーを作成 |
| PUT | `/users/{id}` | ユーザー情報を更新 |
| DELETE | `/users/{id}` | ユーザーを完全削除 |
| PATCH | `/users/{id}/soft-delete` | ユーザーを論理削除 |

### ⚠️ 従来のエンドポイント (OpenAPI未対応)

以下のエンドポイントは動作しますが、Swagger UIには表示されません:

- `/helpers` - ヘルパー管理
- `/emergency-contacts` - 緊急連絡先管理
- `/user-status-cards` - ユーザーステータスカード管理
- `/user-schedules` - ユーザースケジュール管理
- `/alerts` - アラート履歴管理
- `/user-help-cards` - ユーザーヘルプカード管理

## 🔍 Swagger UIの機能

### 主な機能

1. **インタラクティブなAPIテスト**
   - ブラウザから直接APIを呼び出し
   - リクエスト/レスポンスをリアルタイムで確認

2. **詳細なドキュメント**
   - 各エンドポイントの説明
   - リクエスト/レスポンスのスキーマ
   - サンプルデータ

3. **スキーマ定義**
   - データモデルの詳細
   - 必須/任意フィールドの表示
   - 型情報と制約

### 便利な機能

- **タグによるグループ化**: 関連するエンドポイントをまとめて表示
- **サンプル値の自動入力**: 「Try it out」時にサンプルデータが自動入力
- **レスポンスコードの説明**: 200, 404, 500などの意味を表示
- **スキーマ検証**: リクエストデータが自動検証される

## 🛠️ トラブルシューティング

### Swagger UIが表示されない

```bash
# サーバーが起動しているか確認
curl http://localhost:3000

# OpenAPI JSONが取得できるか確認
curl http://localhost:3000/doc
```

### ポート3000が使用中

`.env`ファイルでポートを変更:

```env
PORT=3001
```

### データベース接続エラー

1. PostgreSQLが起動しているか確認
2. `.env`の`DATABASE_URL`が正しいか確認
3. データベースマイグレーションを実行:

```bash
pnpm db:migrate
```

## 📖 詳細なドキュメント

より詳しい情報は以下のドキュメントを参照してください:

- `docs/SWAGGER_SETUP.md` - Swagger設定の詳細
- `docs/SWAGGER_COMPLETION.md` - セットアップ完了の概要
- `README.md` - プロジェクト全体のドキュメント

## 🎯 次のステップ

1. ✅ Swagger UIでUser APIをテストする
2. ⏳ 他のAPIエンドポイントもOpenAPI対応にする
3. ⏳ 認証機能を追加する
4. ⏳ デプロイ環境のURLを設定に追加する

---

**Enjoy coding with Swagger! 🚀**
