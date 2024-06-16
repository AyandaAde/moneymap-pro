import { prisma } from "@/lib/db/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  const user = await currentUser();
  if (!user) return NextResponse.redirect("/sign-in");

  try {
    const dbUser = await prisma.user.findUnique({
      where: {
        userId: user.id,
      },
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
    const biggestExpenseAmount = Math.max(
      ...expenses.map((expense) => expense.amount)
    );
    const biggestExpense = await prisma.transaction.findFirst({
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
            amount: biggestExpenseAmount,
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

    const biggestIncomeAmount = Math.max(
      ...income.map((income) => income.amount)
    );

    const biggestIncome = await prisma.transaction.findFirst({
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
            amount: biggestIncomeAmount,
          },
        ],
      },
    });

    return NextResponse.json({
      transactions: { expenses, income, biggestIncome, biggestExpense },
    });
  } catch (error) {
    console.log(error);
    return new NextResponse("Error fetching transactions", { status: 400 });
  }
}
