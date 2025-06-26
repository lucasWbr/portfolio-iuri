import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const folder = (formData.get("folder") as string) || "uploads";

    if (!file) {
      return NextResponse.json(
        { success: false, error: "Nenhum arquivo enviado" },
        { status: 400 }
      );
    }

    // Validar arquivo
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: "Tipo de arquivo não permitido" },
        { status: 400 }
      );
    }

    if (file.size > 10 * 1024 * 1024) {
      // 10MB
      return NextResponse.json(
        { success: false, error: "Arquivo muito grande (máximo 10MB)" },
        { status: 400 }
      );
    }

    // Gerar nome do arquivo
    const fileExt = file.name.split(".").pop();
    const fileName = `${folder}/${Date.now()}-${Math.random()
      .toString(36)
      .substring(2)}.${fileExt}`;

    // Upload para o Supabase
    const { data, error } = await supabase.storage
      .from("portfolio-iuri")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Erro no upload:", error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }

    // Obter URL pública
    const { data: publicUrlData } = supabase.storage
      .from("portfolio-iuri")
      .getPublicUrl(data.path);

    return NextResponse.json({
      success: true,
      data: {
        path: data.path,
        publicUrl: publicUrlData.publicUrl,
      },
    });
  } catch (error) {
    console.error("Erro inesperado no upload:", error);
    return NextResponse.json(
      { success: false, error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
