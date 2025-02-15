import { createClient } from "redis";
import { env } from "@/env";

const redisClient = createClient({
  url: env.REDIS_URL,
});

redisClient.on("error", (error) => {
  console.error("Redis Client Error", error);
});

(async () => {
  await redisClient.connect();
})();

export default redisClient;
