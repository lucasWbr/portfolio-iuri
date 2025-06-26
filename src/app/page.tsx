import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { prisma } from "@/lib/prisma";
import { Trabalho } from "@/types";
import Link from "next/link";
import Image from "next/image";

// Buscar todos os trabalhos e tags únicas
async function getTrabalhos(): Promise<{
  trabalhos: Trabalho[];
  tags: string[];
}> {
  try {
    const trabalhos = (await prisma.trabalhos.findMany({
      orderBy: { createdAt: "desc" },
    })) as Trabalho[];

    // Extrair tags únicas
    const allTags = trabalhos.flatMap((trabalho: Trabalho) => trabalho.tags);
    const uniqueTags = [...new Set(allTags)];

    return { trabalhos, tags: uniqueTags };
  } catch (error) {
    console.error("Erro ao buscar trabalhos:", error);
    return { trabalhos: [], tags: [] };
  }
}

export default async function Home() {
  const { trabalhos, tags } = await getTrabalhos();

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
            {tags.map((tag) => (
              <Link
                key={tag}
                href={`/tag/${encodeURIComponent(tag)}`}
                className="whitespace-nowrap text-gray-600 hover:text-gray-900 transition-colors duration-200 border-b-2 border-transparent hover:border-gray-900 pb-2"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Grid de trabalhos */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {trabalhos.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">Nenhum trabalho encontrado.</p>
            <p className="text-gray-400 mt-2">
              Os trabalhos aparecerão aqui quando forem adicionados.
            </p>
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
                            className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
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
      </main>

      <Footer />
    </div>
  );
}
