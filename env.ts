import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    REDIS_URL: z.string().url().min(1),
  },
  client: {},
  experimental__runtimeEnv: {},
});
