require("dotenv").config({ path: ".env" });
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log("🔍 Testando configuração do Supabase...\n");

console.log("URLs e Chaves:");
console.log(
  "- Supabase URL:",
  supabaseUrl ? "✅ Configurado" : "❌ Não configurado"
);
console.log("- Anon Key:", anonKey ? "✅ Configurado" : "❌ Não configurado");
console.log(
  "- Service Key:",
  serviceKey ? "✅ Configurado" : "❌ Não configurado"
);
console.log("");

async function testSupabase() {
  try {
    // Teste principal com service role (que é o que realmente importa para upload)
    console.log("🔑 Testando com Service Role...");
    const supabaseService = createClient(supabaseUrl, serviceKey);

    // Listar buckets com service role
    const { data: buckets, error: bucketsError } =
      await supabaseService.storage.listBuckets();

    if (bucketsError) {
      console.log(
        "❌ Erro ao conectar com service role:",
        bucketsError.message
      );
      return;
    }

    console.log("✅ Conectado com service role");
    console.log(
      "📦 Buckets encontrados:",
      buckets.map((b) => b.name)
    );

    const bucketExists = buckets.some(
      (bucket) => bucket.name === "portfolio-iuri"
    );

    if (!bucketExists) {
      console.log('❌ Bucket "portfolio-iuri" NÃO encontrado');
      console.log("\n🚨 AÇÃO NECESSÁRIA:");
      console.log(
        '1. Execute o script "create-bucket-complete.sql" no Supabase SQL Editor'
      );
      console.log("2. Execute novamente: node test-supabase.js");
      return;
    }

    console.log('✅ Bucket "portfolio-iuri" encontrado');

    // Mostrar configurações do bucket
    const portfolioBucket = buckets.find((b) => b.name === "portfolio-iuri");
    console.log("🔧 Configurações do bucket:");
    console.log("  - Público:", portfolioBucket.public);
    console.log(
      "  - Tamanho máximo:",
      portfolioBucket.file_size_limit,
      "bytes"
    );
    console.log("  - Tipos permitidos:", portfolioBucket.allowed_mime_types);

    // Criar dados de uma imagem fake (PNG 1x1 pixel)
    const base64Image =
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==";
    const imageBuffer = Buffer.from(base64Image, "base64");

    // Teste de upload
    console.log("\n📤 Testando upload...");
    const fileName = `test/${Date.now()}-test.png`;

    const { data: uploadData, error: uploadError } =
      await supabaseService.storage
        .from("portfolio-iuri")
        .upload(fileName, imageBuffer, {
          contentType: "image/png",
          upsert: false,
        });

    if (uploadError) {
      console.log("❌ Erro no upload:", uploadError.message);

      if (uploadError.message.includes("mime type")) {
        console.log(
          "\n💡 DICA: O bucket só aceita imagens (jpeg, png, gif, webp)"
        );
      } else if (uploadError.message.includes("not found")) {
        console.log("\n🚨 Execute o script SQL para criar o bucket!");
      }
      return;
    }

    console.log("✅ Upload bem sucedido:", uploadData.path);

    // Testar visualização
    console.log("\n👁️ Testando visualização...");
    const { data: urlData } = supabaseService.storage
      .from("portfolio-iuri")
      .getPublicUrl(fileName);

    console.log("✅ URL pública gerada:", urlData.publicUrl);

    // Limpar arquivo de teste
    console.log("\n🗑️ Removendo arquivo de teste...");
    const { error: deleteError } = await supabaseService.storage
      .from("portfolio-iuri")
      .remove([fileName]);

    if (deleteError) {
      console.log("⚠️ Erro ao remover:", deleteError.message);
    } else {
      console.log("✅ Arquivo de teste removido");
    }

    console.log("\n🎉 SUCESSO! Supabase Storage configurado corretamente!");
    console.log("✅ O sistema de upload no dashboard deve funcionar agora.");

    // Teste adicional: verificar se anon key consegue visualizar arquivos
    console.log("\n🧪 Testando visualização com anon key...");
    const supabaseAnon = createClient(supabaseUrl, anonKey);

    // Upload um arquivo temporário para testar visualização
    const testFileName = `test/${Date.now()}-anon-test.png`;
    await supabaseService.storage
      .from("portfolio-iuri")
      .upload(testFileName, imageBuffer, { contentType: "image/png" });

    // Tentar visualizar com anon key
    const { data: anonUrlData } = supabaseAnon.storage
      .from("portfolio-iuri")
      .getPublicUrl(testFileName);

    console.log(
      "✅ Anon key pode gerar URLs públicas:",
      !!anonUrlData.publicUrl
    );

    // Limpar arquivo de teste
    await supabaseService.storage.from("portfolio-iuri").remove([testFileName]);
  } catch (error) {
    console.log("❌ Erro:", error.message);
  }

  console.log("\n✅ Teste concluído");
}

testSupabase();
