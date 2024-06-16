import { prisma } from "@/lib/db/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { userId, category, amount, type } = await req.json();
  const dbAmount = parseInt(amount) * 100;
  try {
    await prisma.transaction.create({
      data: {
        userId,
        category,
        amount: dbAmount,
        type,
        createdAt: new Date().toString().slice(0,15),
      },
    });
    return new NextResponse("Successfully created transaction.");
  } catch (error) {
    console.log("Error", error);
    return new NextResponse("Error creating transaction", { status: 500 });
  }
}
