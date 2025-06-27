import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  try {
    const { name } = await params;
    const tagName = decodeURIComponent(name);

    const count = await prisma.trabalhos.count({
      where: {
        tags: {
          has: tagName,
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: count,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "Erro ao contar uso da tag",
      },
      { status: 500 }
    );
  }
}
