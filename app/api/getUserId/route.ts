import { prisma } from "@/lib/db/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  const user = await currentUser();
  if (!user) return NextResponse.redirect("/sign-in");

  const { id, fullName, imageUrl, emailAddresses } = user!;
  try {
    const dbUser = await prisma.user.findUnique({
      where: {
        userId: id,
      },
    });

    if (!dbUser)
      await prisma.user.create({
        data: {
          userId: id!,
          fullName: fullName || "",
          image: imageUrl!,
          email: emailAddresses[0].emailAddress,
        },
      });
    return new NextResponse(dbUser?.id);
  } catch (error) {
    console.error("Error fetching user:", error);
    return new NextResponse("Error fetching user", { status: 500 });
  }
}
