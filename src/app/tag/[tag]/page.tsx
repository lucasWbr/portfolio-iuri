"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackToHome from "@/components/BackToHome";
import ContactButton from "@/components/ContactButton";
import { useLanguage } from "@/hooks/use-language";
import { useState, useEffect } from "react";
import { Trabalho, Tag } from "@/types";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";

// Função para embaralhar array (Fisher-Yates shuffle)
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function TagPage() {
  const { language, isLoading: languageLoading, translateTag } = useLanguage();
  const params = useParams();
  const [trabalhos, setTrabalhos] = useState<Trabalho[]>([]);
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [tagInfo, setTagInfo] = useState<Tag | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [tagExists, setTagExists] = useState(true);

  const decodedTag =
    typeof params.tag === "string" ? decodeURIComponent(params.tag) : "";

  // Traduzir o nome da tag para exibição
  const displayTagName = translateTag(decodedTag);

  useEffect(() => {
    async function fetchTrabalhosByTag() {
      try {
        const response = await fetch(
          `/api/tag/${encodeURIComponent(decodedTag)}`
        );
        const data = await response.json();

        if (data.success) {
          // Aplicar randomização aos trabalhos
          const trabalhosList = (data.trabalhos || []) as Trabalho[];
          const randomizedTrabalhos = shuffleArray(trabalhosList);
          setTrabalhos(randomizedTrabalhos);
          setAllTags(data.allTags || []);
          setTagInfo(data.tagInfo || null);

          // Verificar se a tag existe (se há tagInfo ou trabalhos)
          if (
            !data.tagInfo &&
            (!data.trabalhos || data.trabalhos.length === 0)
          ) {
            setTagExists(false);
          }
        } else {
          setTagExists(false);
        }
      } catch (error) {
        setTagExists(false);
      } finally {
        setIsLoading(false);
      }
    }

    if (decodedTag) {
      fetchTrabalhosByTag();
    }
  }, [decodedTag]);

  if (isLoading || languageLoading) {
    return (
      <div className="min-h-screen bg-index-custom flex flex-col">
        <Header showTags={true} />
        <BackToHome />
        <main className="flex-1 max-w-7xl mx-auto px-6 py-8 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white shadow-sm overflow-hidden animate-pulse"
              >
                <div className="w-full aspect-square bg-gray-200"></div>
                <div className="p-4">
                  <div className="h-6 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!tagExists) {
    return (
      <div className="min-h-screen bg-index-custom flex flex-col">
        <Header showTags={true} />
        <BackToHome />
        <main className="flex-1 max-w-7xl mx-auto px-6 py-16 w-full">
          <div className="text-center">
            <p className="text-gray-500 text-lg">Tag não encontrada.</p>
            <Link
              href="/"
              className="text-blue-600 hover:text-blue-800 mt-4 inline-block"
            >
              Voltar aos trabalhos
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-index-custom flex flex-col">
      <Header
        showTags={true}
        tags={allTags.map((tag) => tag.name)}
        currentTag={decodedTag}
      />
      <BackToHome />

      {/* Título da página e descrição */}
      <div className="flex-1 max-w-7xl mx-auto px-6 py-8 w-full">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black capitalize">
            {displayTagName}
          </h1>

          {/* Descrição da tag */}
          {tagInfo?.description && (
            <p className="text-lg text-gray-600 mt-4 max-w-3xl mx-auto font-oswald">
              {tagInfo.description}
            </p>
          )}
        </div>

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trabalhos.map((trabalho) => (
              <Link
                key={trabalho.id}
                href={`/trabalho/${trabalho.id}`}
                className="group block"
              >
                <div className="bg-white shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
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

                  {/* Título centralizado e tags */}
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 group-hover:text-gray-700 transition-colors duration-200 text-center uppercase mb-2">
                      {trabalho.name}
                    </h3>

                    {/* Tags em linha abaixo do título */}
                    {trabalho.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 justify-end">
                        {trabalho.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className={`text-xs px-1.5 py-0.5 rounded capitalize ${
                              tag === decodedTag
                                ? "bg-blue-100 text-blue-600"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {tag}
                          </span>
                        ))}
                        {trabalho.tags.length > 2 && (
                          <span className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
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
      <ContactButton />
    </div>
  );
}
