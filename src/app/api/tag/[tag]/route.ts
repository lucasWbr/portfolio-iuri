import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { tag: string } }
) {
  try {
    const decodedTag = decodeURIComponent(params.tag);

    // Buscar trabalhos que contêm a tag
    const trabalhos = await prisma.trabalhos.findMany({
      where: {
        tags: {
          has: decodedTag,
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Buscar todas as tags disponíveis para o menu
    const allTrabalhos = await prisma.trabalhos.findMany({
      select: { tags: true },
    });

    const allTags = [
      ...new Set(allTrabalhos.flatMap((trabalho) => trabalho.tags)),
    ] as string[];

    return NextResponse.json({
      success: true,
      trabalhos,
      allTags,
    });
  } catch (error) {
    console.error("Erro ao buscar trabalhos por tag:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erro ao buscar trabalhos por tag",
      },
      { status: 500 }
    );
  }
}
