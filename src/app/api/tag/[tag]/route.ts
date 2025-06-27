import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ tag: string }> }
) {
  try {
    const { tag } = await params;
    const decodedTag = decodeURIComponent(tag);

    // Buscar informações da tag específica
    const tagInfo = await prisma.tags.findFirst({
      where: {
        name: decodedTag,
        isActive: true,
      },
    });

    // Buscar trabalhos que contêm a tag
    const trabalhos = await prisma.trabalhos.findMany({
      where: {
        tags: {
          has: decodedTag,
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Buscar todas as tags ativas para o menu
    const allTags = await prisma.tags.findMany({
      where: {
        isActive: true,
        showInMenu: true,
      },
      orderBy: { name: "asc" },
    });

    // Se não encontrou a tag na tabela, tentar verificar se existe nos trabalhos
    let finalTagInfo = tagInfo;
    if (!tagInfo && trabalhos.length > 0) {
      // Tag existe nos trabalhos mas não na tabela, criar uma entrada temporária
      finalTagInfo = {
        id: `temp-${decodedTag}`,
        name: decodedTag,
        description: null,
        isActive: true,
        showInMenu: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }

    return NextResponse.json({
      success: true,
      trabalhos,
      allTags,
      tagInfo: finalTagInfo, // Informações da tag específica (incluindo descrição)
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "Erro ao buscar trabalhos por tag",
      },
      { status: 500 }
    );
  }
}
