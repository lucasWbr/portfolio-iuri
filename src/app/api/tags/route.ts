import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const tags = await prisma.tags.findMany({
      where: {
        isActive: true,
        showInMenu: true,
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({
      success: true,
      data: tags,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "Erro ao buscar tags",
      },
      { status: 500 }
    );
  }
}
