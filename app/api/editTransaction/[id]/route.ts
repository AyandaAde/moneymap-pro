import { prisma } from "@/lib/db/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
    const id = req.url.split("/")[5];
    const { amount} = await req.json();
    const dbAmount = parseInt(amount) * 100;
  try {
    await prisma.transaction.update({
      where: { id },
      data: {
        amount: dbAmount,
      },
    });
    return new NextResponse("Successfully created transaction.");
  } catch (error) {
    console.log("Error", error);
    return new NextResponse("Error creating transaction", { status: 500 });
  }
}
