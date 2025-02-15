import { prisma } from "@/lib/db/prisma";
import { rateLimit } from "@/lib/rate-limit";
import redisClient from "@/lib/redis";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || req.ip;
  const url = new URL(req.url);
  const { searchParams } = url;
  const userId = searchParams.get("userId");
  const cacheKey = `transactions-${userId}`;

  if(!userId) return new NextResponse("User ID is required", { status: 400 });
  // const { remaining, isRateLimitReached } = await rateLimit(ip, url, 5, 10);

  // if (isRateLimitReached) {
  //   return new NextResponse("Rate limit reached", {
  //     status: 429,
  //     headers: {
  //       "Retry-After": "1",
  //     },
  //   });
  // }

  try {
    // const cachedData = await redisClient.get(cacheKey);
    // if (cachedData) {
    //   return new NextResponse(cachedData, {
    //     status: 200,
    //     headers: {
    //       "X-RateLimit-Limit": "1",
    //       "X-RateLimit-Remaining": remaining.toString(),
    //       "X-RateLimit-Reset": new Date(Date.now() + 1000).toISOString(),
    //     },
    //   });
    // }

    const dbUser = await prisma.user.findUnique({
      where: {
        userId: userId!,
      },
    });

    const transactions = await prisma.transaction.findMany({
      where: {
        OR: [
          {
            userId: dbUser?.id!,
          },
          {
            userId: "494729302049485739320393",
          },
        ],
      },
      orderBy: {
        id: "desc",
      },
      take: 5,
    });

    const expenses = await prisma.transaction.findMany({
      where: {
        OR: [
          {
            userId: dbUser?.id!,
          },
          {
            userId: "494729302049485739320393",
          },
        ],
        AND: [
          {
            type: "expense",
          },
        ],
      },
    });

    const income = await prisma.transaction.findMany({
      where: {
        OR: [
          {
            userId: dbUser?.id!,
          },
          {
            userId: "494729302049485739320393",
          },
        ],
        AND: [
          {
            type: "income",
          },
        ],
      },
    });

    // await redisClient.set(
    //   cacheKey,
    //   JSON.stringify({ transactions, expenses, income }),
    //   {
    //     EX: 86400,
    //   }
    // );
    return new NextResponse(
      JSON.stringify({ transactions, expenses, income }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error getting transactions", error);
    return new NextResponse("Error getting transactions", { status: 500 });
  }
}
