import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import { UserFatigueUseCase } from "../application/usecase/user-fatigue-usecase.js";
import {
  UserFatigueSchema,
  CreateUserFatigueSchema,
  UpdateUserFatigueSchema,
  UserFatigueListSchema,
  UserFatigueIdParamSchema,
  UserIdParamSchema,
  ErrorSchema,
} from "../schemas/user-fatigue-schema.js";
import { UserFatigue } from "../domain/user-fatigue.js";

type Variables = {
  userFatigueUseCase: UserFatigueUseCase;
};

export const createUserFatigueRouter = (useCase: UserFatigueUseCase) => {
  const router = new OpenAPIHono<{ Variables: Variables }>();

  router.use("*", async (c, next) => {
    c.set("userFatigueUseCase", useCase);
    await next();
  });

  // GET /user-fatigue - Get all fatigue records
  const getAllRoute = createRoute({
    method: "get",
    path: "/",
    tags: ["UserFatigue"],
    summary: "Get all fatigue records",
    responses: {
      200: {
        description: "List of fatigue records",
        content: {
          "application/json": {
            schema: UserFatigueListSchema,
          },
        },
      },
    },
  });

  router.openapi(getAllRoute, async (c) => {
    const useCase = c.get("userFatigueUseCase");
    const records = await useCase.getAll();
    const response = records.map((r: UserFatigue) => ({
      ...r,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
    }));
    return c.json(response, 200);
  });

  // GET /user-fatigue/:id - Get fatigue record by ID
  const getByIdRoute = createRoute({
    method: "get",
    path: "/{id}",
    tags: ["UserFatigue"],
    summary: "Get fatigue record by ID",
    request: {
      params: UserFatigueIdParamSchema,
    },
    responses: {
      200: {
        description: "Fatigue record found",
        content: {
          "application/json": {
            schema: UserFatigueSchema,
          },
        },
      },
      404: {
        description: "Fatigue record not found",
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
      },
    },
  });

  router.openapi(getByIdRoute, async (c) => {
    const { id } = c.req.valid("param");
    const useCase = c.get("userFatigueUseCase");
    const record = await useCase.getById(id);
    if (!record) {
      return c.json({ message: "Fatigue record not found" }, 404);
    }
    return c.json(
      {
        ...record,
        createdAt: record.createdAt.toISOString(),
        updatedAt: record.updatedAt.toISOString(),
      },
      200
    );
  });

  // GET /user-fatigue/user/:userId - Get fatigue records by user ID
  const getByUserIdRoute = createRoute({
    method: "get",
    path: "/user/{userId}",
    tags: ["UserFatigue"],
    summary: "Get fatigue records by user ID",
    request: {
      params: UserIdParamSchema,
    },
    responses: {
      200: {
        description: "List of fatigue records for user",
        content: {
          "application/json": {
            schema: UserFatigueListSchema,
          },
        },
      },
    },
  });

  router.openapi(getByUserIdRoute, async (c) => {
    const { userId } = c.req.valid("param");
    const useCase = c.get("userFatigueUseCase");
    const records = await useCase.getByUserId(userId);
    const response = records.map((r: UserFatigue) => ({
      ...r,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
    }));
    return c.json(response, 200);
  });

  // POST /user-fatigue - Create new fatigue record
  const createRoute_ = createRoute({
    method: "post",
    path: "/",
    tags: ["UserFatigue"],
    summary: "Create new fatigue record",
    request: {
      body: {
        content: {
          "application/json": {
            schema: CreateUserFatigueSchema,
          },
        },
      },
    },
    responses: {
      201: {
        description: "Fatigue record created",
        content: {
          "application/json": {
            schema: UserFatigueSchema,
          },
        },
      },
      400: {
        description: "Invalid input",
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
      },
    },
  });

  router.openapi(createRoute_, async (c) => {
    const body = c.req.valid("json");
    const useCase = c.get("userFatigueUseCase");
    try {
      const record = await useCase.create(body);
      return c.json(
        {
          ...record,
          createdAt: record.createdAt.toISOString(),
          updatedAt: record.updatedAt.toISOString(),
        },
        201
      );
    } catch (error) {
      return c.json(
        { message: error instanceof Error ? error.message : "Unknown error" },
        400
      );
    }
  });

  // PUT /user-fatigue/:id - Update fatigue record
  const updateRoute = createRoute({
    method: "put",
    path: "/{id}",
    tags: ["UserFatigue"],
    summary: "Update fatigue record",
    request: {
      params: UserFatigueIdParamSchema,
      body: {
        content: {
          "application/json": {
            schema: UpdateUserFatigueSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: "Fatigue record updated",
        content: {
          "application/json": {
            schema: UserFatigueSchema,
          },
        },
      },
      400: {
        description: "Invalid input",
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
      },
      404: {
        description: "Fatigue record not found",
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
      },
    },
  });

  router.openapi(updateRoute, async (c) => {
    const { id } = c.req.valid("param");
    const body = c.req.valid("json");
    const useCase = c.get("userFatigueUseCase");
    try {
      const record = await useCase.update(id, body);
      if (!record) {
        return c.json({ message: "Fatigue record not found" }, 404);
      }
      return c.json(
        {
          ...record,
          createdAt: record.createdAt.toISOString(),
          updatedAt: record.updatedAt.toISOString(),
        },
        200
      );
    } catch (error) {
      return c.json(
        { message: error instanceof Error ? error.message : "Unknown error" },
        400
      );
    }
  });

  // DELETE /user-fatigue/:id - Delete fatigue record
  const deleteRoute = createRoute({
    method: "delete",
    path: "/{id}",
    tags: ["UserFatigue"],
    summary: "Delete fatigue record",
    request: {
      params: UserFatigueIdParamSchema,
    },
    responses: {
      204: {
        description: "Fatigue record deleted",
      },
      404: {
        description: "Fatigue record not found",
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
      },
    },
  });

  router.openapi(deleteRoute, async (c) => {
    const { id } = c.req.valid("param");
    const useCase = c.get("userFatigueUseCase");
    const deleted = await useCase.delete(id);
    if (!deleted) {
      return c.json({ message: "Fatigue record not found" }, 404);
    }
    return c.body(null, 204);
  });

  return router;
};
