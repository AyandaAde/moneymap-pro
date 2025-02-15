import redisClient from "./redis";

export async function rateLimit(
  ip: any,
  route: any,
  limit: number,
  windowInSeconds: number
) {
  const key = `rate-limit:${ip}-${route}`;
  const currentUsage = await redisClient.incr(key);

  if (currentUsage === 1) {
    await redisClient.expire(key, windowInSeconds);
  }

  const remaining = Math.max(0, limit - currentUsage);
  const isRateLimitReached = currentUsage > limit;

  return {
    remaining,
    isRateLimitReached,
  };
}
