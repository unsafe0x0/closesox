import { NextRequest, NextResponse } from "next/server";
import DbClient from "@/prisma/DbClient";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { githubRepoUrl, todo } = await req.json();

    if (!githubRepoUrl || !todo) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 },
      );
    }

    const existing = await DbClient.savedRepo.findFirst({
      where: {
        userId: session.user.id,
        githubRepoUrl,
      },
    });

    if (todo === "remove") {
      if (!existing) {
        return NextResponse.json(
          { message: "Repository not found" },
          { status: 404 },
        );
      }

      await DbClient.savedRepo.delete({
        where: { id: existing.id },
      });

      return NextResponse.json(
        { message: "Repository removed successfully" },
        { status: 200 },
      );
    }

    if (todo === "add") {
      if (existing) {
        return NextResponse.json(
          { message: "Repository already bookmarked" },
          { status: 409 },
        );
      }

      await DbClient.savedRepo.create({
        data: {
          userId: session.user.id,
          githubRepoUrl,
        },
      });

      return NextResponse.json(
        { message: "Repository saved successfully" },
        { status: 201 },
      );
    }

    return NextResponse.json({ message: "Invalid action" }, { status: 400 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
