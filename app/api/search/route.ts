import { prisma } from "@/lib/db/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { date, sort, filter, category } = await req.json();
  const order = sort === "oldest" ? "asc" : "desc";
  const sortAmount = sort === "lowest" ? "asc" : "desc";

  const user = await currentUser();
  if (!user) return NextResponse.redirect("/sign-in");
  const dbUser = await prisma.user.findUnique({
    where: {
      userId: user.id,
    },
  });
  if (date === "all") {
    try {
      if (filter === "" && category !== "") {
        if (sort === "oldest" || sort === "newest") {
          const transactions = await prisma.transaction.findMany({
            orderBy: {
              id: order,
            },
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
                  category,
                },
              ],
            },
          });
          return NextResponse.json(transactions);
        }
        const transactions = await prisma.transaction.findMany({
          orderBy: {
            amount: sortAmount,
          },
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
                category,
              },
            ],
          },
        });
        return NextResponse.json(transactions);
      } else if (category === "" && filter !== "") {
        if (sort === "oldest" || sort === "newest") {
          const transactions = await prisma.transaction.findMany({
            orderBy: {
              id: order,
            },
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
                  type: filter,
                },
              ],
            },
          });
          return NextResponse.json(transactions);
        }
        const transactions = await prisma.transaction.findMany({
          orderBy: {
            amount: sortAmount,
          },
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
                type: filter,
              },
            ],
          },
        });
        return NextResponse.json(transactions);
      }
      if (filter === "" && category === "") {
        if (sort === "oldest" || sort === "newest") {
          const transactions = await prisma.transaction.findMany({
            orderBy: {
              id: order,
            },
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
        }
        const transactions = await prisma.transaction.findMany({
          orderBy: {
            amount: sortAmount,
          },
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
        });
        return NextResponse.json(transactions);
      }
      if (sort === "oldest" || sort === "newest") {
        const transactions = await prisma.transaction.findMany({
          orderBy: {
            id: order,
          },
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
                type: filter,
              },
              {
                category,
              },
            ],
          },
        });
        return NextResponse.json(transactions);
      }
      const transactions = await prisma.transaction.findMany({
        orderBy: {
          amount: sortAmount,
        },
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
              type: filter,
            },
            {
              category,
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
    if (filter === "" && category !== "") {
      if (sort === "oldest" || sort === "newest") {
        const transactions = await prisma.transaction.findMany({
          orderBy: {
            id: order,
          },
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
                category,
              },
              {
                createdAt: date,
              },
            ],
          },
        });
        return NextResponse.json(transactions);
      }
      const transactions = await prisma.transaction.findMany({
        orderBy: {
          amount: sortAmount,
        },
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
              category,
            },
            {
              createdAt: date,
            },
          ],
        },
      });
      return NextResponse.json(transactions);
    } else if (category === "" && filter !== "") {
      if (sort === "oldest" || sort === "newest") {
        const transactions = await prisma.transaction.findMany({
          orderBy: {
            id: order,
          },
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
                type: filter,
              },
              {
                createdAt: date,
              },
            ],
          },
        });
        return NextResponse.json(transactions);
      }
      const transactions = await prisma.transaction.findMany({
        orderBy: {
          amount: sortAmount,
        },
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
              type: filter,
            },
            {
              createdAt: date,
            },
          ],
        },
      });
      return NextResponse.json(transactions);
    }
    if (sort === "oldest" || sort === "newest") {
      const transactions = await prisma.transaction.findMany({
        orderBy: {
          id: order,
        },
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
              type: filter,
            },
            {
              category,
            },
            {
              createdAt: date,
            },
          ],
        },
      });
      return NextResponse.json(transactions);
    }
    if (filter === "" && category === "") {
      if (sort === "oldest" || sort === "newest") {
        const transactions = await prisma.transaction.findMany({
          orderBy: {
            id: order,
          },
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
      }
      const transactions = await prisma.transaction.findMany({
        orderBy: {
          amount: sortAmount,
        },
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
              createdAt: date,
            },
          ],
        },
      });
      return NextResponse.json(transactions);
    }
    if (sort === "oldest" || sort === "newest") {
      const transactions = await prisma.transaction.findMany({
        orderBy: {
          id: order,
        },
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
              type: filter,
            },
            {
              category,
            },
            {
              createdAt: date,
            },
          ],
        },
      });
      return NextResponse.json(transactions);
    }
    const transactions = await prisma.transaction.findMany({
      orderBy: {
        amount: sortAmount,
      },
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
            type: filter,
          },
          {
            category,
          },
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
