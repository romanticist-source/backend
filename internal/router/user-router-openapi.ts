import { createRoute, OpenAPIHono, z, extendZodWithOpenApi } from "@hono/zod-openapi";
import { getCookie } from "hono/cookie";
import type { UserUseCase } from "../application/usecase/user-usecase.js";
import {
  UserSchema,
  CreateUserSchema,
  UpdateUserSchema,
  ErrorSchema,
} from "../schemas/user-schema.js";

// Zodにopenapiメソッドを追加
extendZodWithOpenApi(z);

// Presentation Layer - HTTP Router (Adapter) with OpenAPI
export function createUserRouter(userUseCase: UserUseCase) {
  const router = new OpenAPIHono();

  // GET /users - Get all users
  const getAllUsersRoute = createRoute({
    method: "get",
    path: "/",
    tags: ["Users"],
    summary: "すべてのユーザーを取得",
    description:
      "すべてのユーザー情報を取得します。削除済みユーザーを含めることも可能です。",
    request: {
      query: z.object({
        includeDeleted: z.string().optional().openapi({
          example: "false",
          description: "削除済みユーザーを含める場合はtrue",
        }),
      }),
    },
    responses: {
      200: {
        description: "ユーザー一覧の取得成功",
        content: {
          "application/json": {
            schema: z.array(UserSchema),
          },
        },
      },
      500: {
        description: "サーバーエラー",
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
      },
    },
  });

  router.openapi(getAllUsersRoute, async (c) => {
    try {
      const includeDeleted = c.req.valid("query").includeDeleted === "true";
      const users = await userUseCase.getAllUsers(includeDeleted);

      // Convert dates to ISO strings
      const sanitizedUsers = users.map((user) => {
        return {
          ...user,
          age: user.age ?? 0,
          createdAt: user.createdAt.toISOString(),
          updatedAt: user.updatedAt.toISOString(),
        };
      });

      return c.json(sanitizedUsers, 200);
    } catch (error) {
      return c.json({ error: "Failed to fetch users" }, 500);
    }
  });

  // GET /users/:id - Get user by ID
  const getUserByIdRoute = createRoute({
    method: "get",
    path: "/{id}",
    tags: ["Users"],
    summary: "IDでユーザーを取得",
    description: "指定されたIDのユーザー情報を取得します。",
    request: {
      params: z.object({
        id: z.string().openapi({
          example: "123e4567-e89b-12d3-a456-426614174000",
          description: "ユーザーID",
        }),
      }),
    },
    responses: {
      200: {
        description: "ユーザーの取得成功",
        content: {
          "application/json": {
            schema: UserSchema,
          },
        },
      },
      404: {
        description: "ユーザーが見つかりません",
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
      },
      500: {
        description: "サーバーエラー",
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
      },
    },
  });

  router.openapi(getUserByIdRoute, async (c) => {
    try {
      const { id } = c.req.valid("param");
      const user = await userUseCase.getUserById(id);

      if (!user) {
        return c.json({ error: "User not found" }, 404);
      }

      return c.json(
        {
          ...user,
          age: user.age ?? 0,
          createdAt: user.createdAt.toISOString(),
          updatedAt: user.updatedAt.toISOString(),
        },
        200
      );
    } catch (error) {
      return c.json({ error: "Failed to fetch user" }, 500);
    }
  });

  // GET /users/mail/:mail - Get user by email
  const getUserByMailRoute = createRoute({
    method: "get",
    path: "/mail/{mail}",
    tags: ["Users"],
    summary: "メールアドレスでユーザーを取得",
    description: "指定されたメールアドレスのユーザー情報を取得します。",
    request: {
      params: z.object({
        mail: z.string().openapi({
          example: "yamada@example.com",
          description: "メールアドレス",
        }),
      }),
    },
    responses: {
      200: {
        description: "ユーザーの取得成功",
        content: {
          "application/json": {
            schema: UserSchema,
          },
        },
      },
      404: {
        description: "ユーザーが見つかりません",
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
      },
      500: {
        description: "サーバーエラー",
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
      },
    },
  });

  router.openapi(getUserByMailRoute, async (c) => {
    try {
      const { mail } = c.req.valid("param");
      const user = await userUseCase.getUserByMail(mail);

      if (!user) {
        return c.json({ error: "User not found" }, 404);
      }

      return c.json(
        {
          ...user,
          age: user.age ?? 0,
          createdAt: user.createdAt.toISOString(),
          updatedAt: user.updatedAt.toISOString(),
        },
        200
      );
    } catch (error) {
      return c.json({ error: "Failed to fetch user" }, 500);
    }
  });

  // POST /users - Create new user
  const createUserRoute = createRoute({
    method: "post",
    path: "/",
    tags: ["Users"],
    summary: "新規ユーザーを作成",
    description: "新しいユーザーを作成します。",
    request: {
      body: {
        content: {
          "application/json": {
            schema: CreateUserSchema,
          },
        },
      },
    },
    responses: {
      201: {
        description: "ユーザーの作成成功",
        content: {
          "application/json": {
            schema: UserSchema,
          },
        },
      },
      400: {
        description: "リクエストが不正です",
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
      },
    },
  });

  router.openapi(createUserRoute, async (c) => {
    try {
      const body = c.req.valid("json");
      const createInput = {
        ...body,
        icon: body.icon ?? "",
        address: body.address ?? "",
        comment: body.comment ?? "",
      };
      const user = await userUseCase.createUser(createInput);

      return c.json(
        {
          ...user,
          age: user.age ?? 0,
          createdAt: user.createdAt.toISOString(),
          updatedAt: user.updatedAt.toISOString(),
        },
        201
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to create user";
      return c.json({ error: message }, 400);
    }
  });

  // PUT /users/:id - Update user
  const updateUserRoute = createRoute({
    method: "put",
    path: "/{id}",
    tags: ["Users"],
    summary: "ユーザー情報を更新",
    description: "指定されたIDのユーザー情報を更新します。",
    request: {
      params: z.object({
        id: z.string().openapi({
          example: "123e4567-e89b-12d3-a456-426614174000",
          description: "ユーザーID",
        }),
      }),
      body: {
        content: {
          "application/json": {
            schema: UpdateUserSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: "ユーザーの更新成功",
        content: {
          "application/json": {
            schema: UserSchema,
          },
        },
      },
      404: {
        description: "ユーザーが見つかりません",
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
      },
      400: {
        description: "リクエストが不正です",
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
      },
    },
  });

  router.openapi(updateUserRoute, async (c) => {
    try {
      const { id } = c.req.valid("param");
      const body = c.req.valid("json");
      const user = await userUseCase.updateUser(id, body);

      if (!user) {
        return c.json({ error: "User not found" }, 404);
      }

      return c.json(
        {
          ...user,
          age: user.age ?? 0,
          createdAt: user.createdAt.toISOString(),
          updatedAt: user.updatedAt.toISOString(),
        },
        200
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to update user";
      return c.json({ error: message }, 400);
    }
  });

  // DELETE /users/:id - Hard delete user
  const deleteUserRoute = createRoute({
    method: "delete",
    path: "/{id}",
    tags: ["Users"],
    summary: "ユーザーを完全削除",
    description: "指定されたIDのユーザーを完全に削除します。",
    request: {
      params: z.object({
        id: z.string().openapi({
          example: "123e4567-e89b-12d3-a456-426614174000",
          description: "ユーザーID",
        }),
      }),
    },
    responses: {
      200: {
        description: "ユーザーの削除成功",
        content: {
          "application/json": {
            schema: z.object({
              success: z.boolean().openapi({ example: true }),
            }),
          },
        },
      },
      404: {
        description: "ユーザーが見つかりません",
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
      },
      500: {
        description: "サーバーエラー",
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
      },
    },
  });

  router.openapi(deleteUserRoute, async (c) => {
    try {
      const { id } = c.req.valid("param");
      const success = await userUseCase.deleteUser(id);

      if (!success) {
        return c.json({ error: "User not found" }, 404);
      }

      return c.json({ success: true }, 200);
    } catch (error) {
      return c.json({ error: "Failed to delete user" }, 500);
    }
  });

  // PATCH /users/:id/soft-delete - Soft delete user
  const softDeleteUserRoute = createRoute({
    method: "patch",
    path: "/{id}/soft-delete",
    tags: ["Users"],
    summary: "ユーザーを論理削除",
    description: "指定されたIDのユーザーを論理削除します。",
    request: {
      params: z.object({
        id: z.string().openapi({
          example: "123e4567-e89b-12d3-a456-426614174000",
          description: "ユーザーID",
        }),
      }),
    },
    responses: {
      200: {
        description: "ユーザーの論理削除成功",
        content: {
          "application/json": {
            schema: z.object({
              success: z.boolean().openapi({ example: true }),
            }),
          },
        },
      },
      404: {
        description: "ユーザーが見つかりません",
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
      },
      500: {
        description: "サーバーエラー",
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
      },
    },
  });

  router.openapi(softDeleteUserRoute, async (c) => {
    try {
      const { id } = c.req.valid("param");
      const success = await userUseCase.softDeleteUser(id);

      if (!success) {
        return c.json({ error: "User not found" }, 404);
      }

      return c.json({ success: true }, 200);
    } catch (error) {
      return c.json({ error: "Failed to soft delete user" }, 500);
    }
  });

  const upsertGoogleUserRoute = createRoute({
    method: "post",
    path: "/google",
    tags: ["Users"],
    summary: "Googleログインユーザーを登録/更新",
    description:
      "Googleから取得したユーザー情報でユーザーを作成または更新します。",
    request: {
      body: {
        content: {
          "application/json": {
            schema: CreateUserSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: "ユーザー登録・更新成功",
        content: {
          "application/json": {
            schema: UserSchema,
          },
        },
      },
      400: {
        description: "リクエストが不正",
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
      },
      500: {
        description: "サーバーエラー",
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
      },
    },
  });

  router.openapi(upsertGoogleUserRoute, async (c) => {
    const body = c.req.valid("json");
    if (!body.id || !body.mail || !body.name) {
      return c.json({ error: "Missing required fields" }, 400);
    }
    try {
      const createInput = {
        ...body,
        icon: body.icon ?? "",
        address: body.address ?? "",
        comment: body.comment ?? "",
      };
      const user = await userUseCase.upsertGoogleUser(createInput);
      return c.json(
        {
          ...user,
          age: user.age ?? 0,
          createdAt: user.createdAt.toISOString(),
          updatedAt: user.updatedAt.toISOString(),
        },
        200
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to login via Google";
      return c.json({ error: message }, 500);
    }
  });

  // GET /users/me - ログイン済みユーザー情報取得
  const getMeRoute = createRoute({
    method: "get",
    path: "/me",
    tags: ["Users"],
    summary: "ログイン中のユーザー情報を取得",
    description:
      "Cookie からユーザーIDを取得して、自分のユーザー情報を返します。",
    responses: {
      200: {
        description: "ユーザー情報取得成功",
        content: {
          "application/json": {
            schema: UserSchema,
          },
        },
      },
      401: {
        description: "未ログインまたはCookieが無効",
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
      },
      404: {
        description: "ユーザーが存在しない",
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
      },
      500: {
        description: "サーバーエラー",
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
      },
    },
  });

  router.openapi(getMeRoute, async (c) => {
    try {
      // CookieからuserIdを取得
      const userId = getCookie(c, "auth");
      if (!userId) {
        return c.json({ error: "Not logged in" }, 401);
      }

      const user = await userUseCase.getUserById(userId);
      if (!user) {
        return c.json({ error: "User not found" }, 404);
      }
      return c.json(
        {
          ...user,
          age: user.age ?? 0,
          createdAt: user.createdAt.toISOString(),
          updatedAt: user.updatedAt.toISOString(),
        },
        200
      );
    } catch (error) {
      return c.json({ error: "Failed to fetch user" }, 500);
    }
  });

  return router;
}
