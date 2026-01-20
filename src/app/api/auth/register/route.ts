import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

import { prisma } from "@/server/db";
import { createSessionToken, hashPassword, setSessionCookie } from "@/server/auth";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim() : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (!email || !password || !email.includes("@")) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "Email already registered." }, { status: 409 });
  }

  const passwordHash = await hashPassword(password);

  const user = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const createdUser = await tx.user.create({
      data: { email, passwordHash },
    });

    await tx.workspace.create({
      data: {
        ownerUserId: createdUser.id,
        name: "Personal",
      },
    });

    return createdUser;
  });

  const token = await createSessionToken(user.id);
  await setSessionCookie(token);

  return NextResponse.json({ id: user.id, email: user.email }, { status: 201 });
}
