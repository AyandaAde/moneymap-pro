import { prisma } from "@/lib/db/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { timePeriod, date } = await req.json();
  const user = await currentUser();
  if (!user) return NextResponse.redirect("/sign-in");
  const dbUser = await prisma.user.findUnique({
    where: {
      userId: user.id,
    },
  });
  if (date === "all") {
    try {
      const transactions = await prisma.transaction.findMany({
        where: {
          OR: [
            {
              userId: dbUser?.id,
            },
            {
              userId: "494729302049485739320393",
            },
          ],
        },
      });
      return NextResponse.json(transactions);
    } catch (error) {
      console.log(error);
      return new NextResponse("Error fetching transactions", { status: 400 });
    }
  } else if (date === (new Date().toString().slice(4, 7) + " " + new Date().toString().slice(11,15))) {
    try {
      const transactions = await prisma.transaction.findMany({
        where: {
          OR: [
            {
              userId: dbUser?.id,
            },
            {
              userId: "494729302049485739320393",
            },
          ],
          AND: [
            {
              createdAtMonth: date,
            },
          ],
        },
      });
      return NextResponse.json(transactions);
    } catch (error) {
      console.log(error);
      return new NextResponse("Error fetching transactions", { status: 400 });
    }
  }

  try {
    const transactions = await prisma.transaction.findMany({
      where: {
        OR: [
          {
            userId: dbUser?.id,
          },
          {
            userId: "494729302049485739320393",
          },
        ],
        AND: [
          {
            createdAt: date,
          },
        ],
      },
    });
    return NextResponse.json(transactions);
  } catch (error) {
    console.log(error);
    return new NextResponse("Error fetching transactions", { status: 400 });
  }
}
