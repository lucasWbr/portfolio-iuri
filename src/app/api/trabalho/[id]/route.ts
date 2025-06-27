import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const trabalho = await prisma.trabalhos.findUnique({
      where: { id },
    });

    if (!trabalho) {
      return NextResponse.json(
        {
          success: false,
          error: "Trabalho não encontrado",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: trabalho,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "Erro ao buscar trabalho",
      },
      { status: 500 }
    );
  }
}
