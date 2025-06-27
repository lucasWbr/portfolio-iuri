import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const trabalhos = await prisma.trabalhos.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: trabalhos,
    });
  } catch (error) {
    console.error("Erro ao buscar trabalhos:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erro ao buscar trabalhos",
      },
      { status: 500 }
    );
  }
}
