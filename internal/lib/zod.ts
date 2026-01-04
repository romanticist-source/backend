import { extendZodWithOpenApi, z } from "@hono/zod-openapi";

extendZodWithOpenApi(z);

export { z };
  