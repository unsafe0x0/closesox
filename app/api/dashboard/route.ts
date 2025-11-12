import { NextRequest, NextResponse } from "next/server";
import DbClient from "@/prisma/DbClient";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userData = await DbClient.user.findUnique({
      where: { id: session.user.id },
      include: { savedRepos: true },
    });

    return NextResponse.json({ data: userData }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
