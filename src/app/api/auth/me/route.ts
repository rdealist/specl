import { NextResponse } from "next/server";

import { prisma } from "@/server/db";
import { getSessionUserId } from "@/server/auth";

export async function GET() {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const workspace = await prisma.workspace.findFirst({
    where: { ownerUserId: userId },
    select: { id: true, name: true },
  });

  return NextResponse.json({
    id: user.id,
    email: user.email,
    workspace,
  });
}
