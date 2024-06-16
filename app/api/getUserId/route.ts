import { prisma } from "@/lib/db/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  const user = await currentUser();
  if (!user) return NextResponse.redirect("/sign-in");
  const { id } = user!;

  const dbUser = await prisma.user.findUnique({
    where: {
      userId: id,
    },
  });
  return NextResponse.json(dbUser?.id);
}
