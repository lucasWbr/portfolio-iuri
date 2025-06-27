import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// PUT - Atualizar tag
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, description, isActive, showInMenu } = body;

    // Se está alterando o nome, verificar se já existe
    if (name) {
      const existingTag = await prisma.tags.findFirst({
        where: {
          name: name,
          NOT: { id },
        },
      });

      if (existingTag) {
        return NextResponse.json(
          { success: false, error: "Já existe uma tag com esse nome" },
          { status: 400 }
        );
      }
    }

    const tag = await prisma.tags.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(isActive !== undefined && { isActive }),
        ...(showInMenu !== undefined && { showInMenu }),
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
        error: "Erro ao atualizar tag",
      },
      { status: 500 }
    );
  }
}

// DELETE - Deletar tag
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // Verificar se a tag está sendo usada em algum trabalho
    const tagToDelete = await prisma.tags.findUnique({
      where: { id },
    });

    if (!tagToDelete) {
      return NextResponse.json(
        { success: false, error: "Tag não encontrada" },
        { status: 404 }
      );
    }

    const trabalhosComTag = await prisma.trabalhos.count({
      where: {
        tags: {
          has: tagToDelete.name,
        },
      },
    });

    if (trabalhosComTag > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Não é possível deletar. Esta tag está sendo usada em ${trabalhosComTag} trabalho(s)`,
        },
        { status: 400 }
      );
    }

    await prisma.tags.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "Erro ao deletar tag",
      },
      { status: 500 }
    );
  }
}
