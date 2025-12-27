import { Hono } from "hono";
import type { UserUseCase } from "../application/usecase/user-usecase.js";
import { getCookie, setCookie } from "hono/cookie";

// Presentation Layer - HTTP Router (Adapter)
export function createUserRouter(userUseCase: UserUseCase) {
  const router = new Hono();

  // GET /users - Get all users
  router.get("/", async (c) => {
    try {
      const includeDeleted = c.req.query("includeDeleted") === "true";
      const users = await userUseCase.getAllUsers(includeDeleted);

      // Remove password from response
      const sanitizedUsers = users.map((user) => {
        return user;
      });

      return c.json(sanitizedUsers);
    } catch (error) {
      return c.json({ error: "Failed to fetch users" }, 500);
    }
  });

  // GET /users/:id - Get user by ID
  router.get("/:id", async (c) => {
    try {
      const id = c.req.param("id");
      const user = await userUseCase.getUserById(id);

      if (!user) {
        return c.json({ error: "User not found" }, 404);
      }

      // Remove password from response
      return c.json(user);
    } catch (error) {
      return c.json({ error: "Failed to fetch user" }, 500);
    }
  });

  // GET /users/mail/:mail - Get user by email
  router.get("/mail/:mail", async (c) => {
    try {
      const mail = c.req.param("mail");
      const user = await userUseCase.getUserByMail(mail);

      if (!user) {
        return c.json({ error: "User not found" }, 404);
      }

      // Remove password from response
      return c.json(user);
    } catch (error) {
      return c.json({ error: "Failed to fetch user" }, 500);
    }
  });

  // POST /users - Create new user
  router.post("/", async (c) => {
    try {
      const body = await c.req.json();
      const user = await userUseCase.createUser(body);

      // Remove password from response
      return c.json(user, 201);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to create user";
      return c.json({ error: message }, 400);
    }
  });

  // PUT /users/:id - Update user
  router.put("/:id", async (c) => {
    try {
      const id = c.req.param("id");
      const body = await c.req.json();
      const user = await userUseCase.updateUser(id, body);

      if (!user) {
        return c.json({ error: "User not found" }, 404);
      }

      // Remove password from response
      return c.json(user);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to update user";
      return c.json({ error: message }, 400);
    }
  });

  // DELETE /users/:id - Hard delete user
  router.delete("/:id", async (c) => {
    try {
      const id = c.req.param("id");
      const deleted = await userUseCase.deleteUser(id);

      if (!deleted) {
        return c.json({ error: "User not found" }, 404);
      }

      return c.json({ message: "User deleted successfully" });
    } catch (error) {
      return c.json({ error: "Failed to delete user" }, 500);
    }
  });

  // POST /users/:id/soft-delete - Soft delete user
  router.post("/:id/soft-delete", async (c) => {
    try {
      const id = c.req.param("id");
      const deleted = await userUseCase.softDeleteUser(id);

      if (!deleted) {
        return c.json({ error: "User not found or already deleted" }, 404);
      }

      return c.json({ message: "User soft deleted successfully" });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to soft delete user";
      return c.json({ error: message }, 400);
    }
  });

  router.post("/google", async (c) => {
    try {
      const body = await c.req.json();

      if (!body.id) {
        return c.json({ error: "Missing required fields" }, 400);
      }

      const user = await userUseCase.upsertGoogleUser(body);

      // ---- Cookie をセット ----
      setCookie(c, "auth", user.id, {
        path: "/",
        httpOnly: true,
        secure: false,
        sameSite: "Lax",
        maxAge: 60 * 60 * 24 * 7, // 7日
      });

      return c.json(user, 200);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to login via Google";
      return c.json({ error: message }, 400);
    }
  });

  router.get("/me", async (c) => {
    const userId = getCookie(c, "auth");

    if (!userId) {
      return c.json({ error: "Not logged in" }, 401);
    }

    const user = await userUseCase.getUserById(userId);
    if (!user) {
      return c.json({ error: "User not found" }, 404);
    }

    return c.json(user);
  });

  return router;
}
