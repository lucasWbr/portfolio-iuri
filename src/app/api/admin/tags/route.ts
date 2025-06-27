import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET - Buscar todas as tags (para admin)
export async function GET() {
  try {
    const tags = await prisma.tags.findMany({
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

// POST - Criar nova tag
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, isActive, showInMenu } = body;

    // Verificar se tag já existe
    const existingTag = await prisma.tags.findUnique({
      where: { name },
    });

    if (existingTag) {
      return NextResponse.json(
        { success: false, error: "Tag já existe" },
        { status: 400 }
      );
    }

    const tag = await prisma.tags.create({
      data: {
        name,
        description: description || null,
        isActive: isActive ?? true,
        showInMenu: showInMenu ?? true,
      },
    });

    return NextResponse.json({
      success: true,
      data: tag,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "Erro ao criar tag",
      },
      { status: 500 }
    );
  }
}
