import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function migrateTags() {
  console.log("🚀 Iniciando migração de tags...");

  try {
    // 1. Buscar todos os trabalhos
    const trabalhos = await prisma.trabalhos.findMany({
      select: { tags: true },
    });

    // 2. Extrair todas as tags únicas
    const allTags = trabalhos.flatMap((trabalho) => trabalho.tags);
    const uniqueTags = [...new Set(allTags)];

    console.log(`📊 Encontradas ${uniqueTags.length} tags únicas para migrar`);

    // 3. Verificar quais tags já existem na tabela
    const existingTags = await prisma.tags.findMany({
      select: { name: true },
    });
    const existingTagNames = existingTags.map((tag) => tag.name);

    // 4. Filtrar apenas tags que ainda não existem
    const tagsToCreate = uniqueTags.filter(
      (tagName) => !existingTagNames.includes(tagName)
    );

    console.log(`➕ ${tagsToCreate.length} novas tags para criar`);

    // 5. Criar as tags na nova tabela
    if (tagsToCreate.length > 0) {
      await prisma.tags.createMany({
        data: tagsToCreate.map((tagName) => ({
          name: tagName,
          description: null,
          isActive: true,
          showInMenu: true,
        })),
      });

      console.log(`✅ ${tagsToCreate.length} tags criadas com sucesso!`);
    } else {
      console.log("ℹ️ Nenhuma tag nova para criar");
    }

    // 6. Verificar resultado final
    const totalTagsAfter = await prisma.tags.count();
    console.log(`📈 Total de tags na tabela: ${totalTagsAfter}`);

    console.log("🎉 Migração de tags concluída com sucesso!");
  } catch (error) {
    console.error("❌ Erro durante a migração:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Executar migração se script for chamado diretamente
if (require.main === module) {
  migrateTags()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

export default migrateTags;
