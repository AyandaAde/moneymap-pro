import { prisma } from "@/lib/db/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
    const id = req.url.split("/")[5];
  try {
    await prisma.transaction.delete({
      where: {
        id,
      },
    });
    return new NextResponse("Successfully created transaction.");
  } catch (error) {
    console.log("Error", error);
    return new NextResponse("Error creating transaction", { status: 500 });
  }
}
