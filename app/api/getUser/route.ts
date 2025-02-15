import { prisma } from "@/lib/db/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const fullName = searchParams.get("fullName");
  const imageUrl = searchParams.get("imageUrl");
  const emailAddresses = await req.json();

  try {
    const dbUser = await prisma.user.findUnique({
      where: {
        userId: userId!,
      },
    });

    if (!dbUser) {
      await prisma.user.create({
        data: {
          userId: userId!,
          fullName: fullName || "",
          image: imageUrl!,
          email: emailAddresses[0].emailAddress,
        },
      });
    }

    return new NextResponse("Success", { status: 200 });
  } catch (error) {
    console.error("Error getting user:", error);
    return new NextResponse(error as BodyInit, { status: 500 });
  }
}
