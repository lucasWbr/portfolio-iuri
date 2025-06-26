import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { prisma } from "@/lib/prisma";
import { Trabalho } from "@/types";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";

interface TagPageProps {
  params: {
    tag: string;
  };
}

// Buscar trabalhos por tag
async function getTrabalhosByTag(
  tag: string
): Promise<{ trabalhos: Trabalho[]; allTags: string[] }> {
  try {
    const decodedTag = decodeURIComponent(tag);

    // Buscar trabalhos que contenham a tag
    const trabalhos = (await prisma.trabalhos.findMany({
      where: {
        tags: {
          has: decodedTag,
        },
      },
      orderBy: { createdAt: "desc" },
    })) as Trabalho[];

    // Buscar todas as tags para o menu de navegação
    const allTrabalhos = await prisma.trabalhos.findMany({
      select: { tags: true },
    });

    const allTags = [
      ...new Set(allTrabalhos.flatMap((t: any) => t.tags as string[])),
    ];

    return { trabalhos, allTags };
  } catch (error) {
    console.error("Erro ao buscar trabalhos por tag:", error);
    return { trabalhos: [], allTags: [] };
  }
}

export default async function TagPage({ params }: TagPageProps) {
  const decodedTag = decodeURIComponent(params.tag);
  const { trabalhos, allTags } = await getTrabalhosByTag(params.tag);

  // Se a tag não existe ou não há trabalhos, retornar 404
  if (!allTags.includes(decodedTag)) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-index-custom">
      <Header />

      {/* Menu de navegação com tags */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-6 overflow-x-auto">
            <Link
              href="/"
              className="whitespace-nowrap text-gray-600 hover:text-gray-900 transition-colors duration-200 border-b-2 border-transparent hover:border-gray-900 pb-2"
            >
              Todos
            </Link>
            {allTags.map((tag) => (
              <Link
                key={tag}
                href={`/tag/${encodeURIComponent(tag)}`}
                className={`whitespace-nowrap transition-colors duration-200 border-b-2 pb-2 ${
                  tag === decodedTag
                    ? "text-gray-900 border-gray-900"
                    : "text-gray-600 hover:text-gray-900 border-transparent hover:border-gray-900"
                }`}
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Título da página */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
          Trabalhos em: <span className="text-gray-600">{decodedTag}</span>
        </h1>

        {/* Grid de trabalhos */}
        {trabalhos.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">
              Nenhum trabalho encontrado para esta tag.
            </p>
            <Link
              href="/"
              className="text-blue-600 hover:text-blue-800 mt-4 inline-block"
            >
              Ver todos os trabalhos
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {trabalhos.map((trabalho) => (
              <Link
                key={trabalho.id}
                href={`/trabalho/${trabalho.id}`}
                className="group block"
              >
                <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
                  {/* Imagem do trabalho */}
                  <div className="aspect-square bg-gray-100 relative">
                    {trabalho.image.length > 0 ? (
                      <Image
                        src={trabalho.image[0]}
                        alt={trabalho.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <span>Sem imagem</span>
                      </div>
                    )}
                  </div>

                  {/* Informações do trabalho */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 group-hover:text-gray-700 transition-colors duration-200">
                      {trabalho.name}
                    </h3>
                    {trabalho.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {trabalho.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className={`text-xs px-2 py-1 rounded ${
                              tag === decodedTag
                                ? "bg-blue-100 text-blue-600"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {tag}
                          </span>
                        ))}
                        {trabalho.tags.length > 2 && (
                          <span className="text-xs text-gray-400">
                            +{trabalho.tags.length - 2}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
