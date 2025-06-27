import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// Função para embaralhar array (Fisher-Yates shuffle)
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const randomize = searchParams.get("randomize") === "true";

    const trabalhos = await prisma.trabalhos.findMany({
      orderBy: { createdAt: "desc" },
    });

    // Aplicar randomização se solicitado
    const finalTrabalhos = randomize ? shuffleArray(trabalhos) : trabalhos;

    return NextResponse.json({
      success: true,
      data: finalTrabalhos,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "Erro ao buscar trabalhos",
      },
      { status: 500 }
    );
  }
}
