import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const usuario = await prisma.usuario.findFirst();

    return NextResponse.json({
      success: true,
      data: usuario,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "Erro ao buscar configurações",
      },
      { status: 500 }
    );
  }
}
