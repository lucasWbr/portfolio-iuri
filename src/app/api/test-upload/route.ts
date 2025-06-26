import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

export async function POST(req: NextRequest) {
  try {
    console.log("Iniciando teste de upload...");

    // Verificar se o bucket existe
    const { data: buckets, error: bucketsError } =
      await supabaseAdmin.storage.listBuckets();

    if (bucketsError) {
      console.error("Erro ao listar buckets:", bucketsError);
      return NextResponse.json(
        {
          success: false,
          error: "Erro ao acessar storage",
          details: bucketsError.message,
        },
        { status: 500 }
      );
    }

    console.log("Buckets disponíveis:", buckets);

    const portfolioBucket = buckets.find(
      (bucket) => bucket.name === "portfolio-iuri"
    );

    if (!portfolioBucket) {
      return NextResponse.json(
        {
          success: false,
          error: "Bucket 'portfolio-iuri' não encontrado",
          availableBuckets: buckets.map((b) => b.name),
        },
        { status: 404 }
      );
    }

    // Testar upload de um arquivo pequeno
    const testFileName = `test/${Date.now()}-test.txt`;
    const testFile = new Blob(["Hello World"], { type: "text/plain" });

    console.log("Tentando upload de teste...");
    const { data, error } = await supabaseAdmin.storage
      .from("portfolio-iuri")
      .upload(testFileName, testFile);

    if (error) {
      console.error("Erro no upload:", error);
      return NextResponse.json(
        {
          success: false,
          error: "Erro no upload",
          details: error.message,
        },
        { status: 400 }
      );
    }

    console.log("Upload bem sucedido:", data);

    // Tentar obter URL pública
    const { data: publicUrlData } = supabaseAdmin.storage
      .from("portfolio-iuri")
      .getPublicUrl(data.path);

    // Limpar o arquivo de teste
    await supabaseAdmin.storage.from("portfolio-iuri").remove([data.path]);

    return NextResponse.json({
      success: true,
      message: "Teste de upload bem sucedido",
      bucketInfo: portfolioBucket,
      testUpload: data,
      publicUrl: publicUrlData.publicUrl,
    });
  } catch (error) {
    console.error("Erro inesperado:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erro inesperado",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 }
    );
  }
}
