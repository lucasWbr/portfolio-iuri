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
import { fetchTagsWithCache } from "@/lib/utils/tagCache";
import { useTags } from "@/hooks/useTags";
import { useTrabalhos } from "@/hooks/useTrabalhos";

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
  const { isLoading: languageLoading, translateTag } = useLanguage();
  const params = useParams();
  const {
    data: trabalhos,
    isLoading: trabalhosLoading,
    error: trabalhosError,
  } = useTrabalhos({ all: true });
  const { data: tags, isLoading: tagsLoading, error: tagsError } = useTags();

  const decodedTag =
    typeof params.tag === "string" ? decodeURIComponent(params.tag) : "";
  const displayTagName = translateTag(decodedTag);

  const isLoading = trabalhosLoading || tagsLoading || languageLoading;

  // Filtrar trabalhos por tag
  const trabalhosFiltrados =
    trabalhos?.filter((trabalho) => trabalho.tags.includes(decodedTag)) || [];

  // Encontrar info da tag
  const tagInfo = tags?.find((tag) => tag.name === decodedTag) || null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-index-custom flex flex-col">
        <Header showTags={true} />
        <main className="flex-1 w-full mx-auto py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-5 px-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="relative aspect-square w-full min-h-[260px] md:min-h-[340px] lg:min-h-[420px] bg-gray-200 animate-pulse"
              />
            ))}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (trabalhosError || tagsError) {
    return (
      <div className="min-h-screen bg-index-custom flex flex-col">
        <Header showTags={true} />
        <main className="flex-1 w-full mx-auto py-8">
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">Erro ao carregar dados.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!tagInfo && trabalhosFiltrados.length === 0) {
    return (
      <div className="min-h-screen bg-index-custom flex flex-col">
        <Header showTags={true} tags={tags?.map((tag) => tag.name) || []} />
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
        tags={tags?.map((tag) => tag.name) || []}
        currentTag={decodedTag}
      />
      <main className="flex-1 w-full mx-auto py-8">
        <div className="flex flex-col items-center mb-12">
          <div className="relative flex items-center w-full max-w-7xl mx-auto px-6 pt-8 pb-2 mb-4">
            <div className="absolute left-0">
              <BackToHome />
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-archivo-narrow text-[#0041FF] capitalize mx-auto text-center">
              {displayTagName}
            </h1>
          </div>
          {/* Descrição da tag */}
          {tagInfo?.description && (
            <p className="text-lg font-archivo-narrow text-[#0041FF] tracking-custom mt-4 max-w-3xl mx-auto">
              {tagInfo.description}
            </p>
          )}
        </div>

        {/* Grid de trabalhos */}
        {trabalhosFiltrados.length === 0 ? (
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-5 px-6">
            {trabalhosFiltrados.map((trabalho) => (
              <Link
                key={trabalho.id}
                href={`/trabalho/${trabalho.id}`}
                className="group block focus:outline-none"
                tabIndex={0}
              >
                <div className="relative aspect-square w-full min-h-[260px] md:min-h-[340px] lg:min-h-[420px]">
                  <Image
                    src={trabalho.image[0]}
                    alt={trabalho.name}
                    fill
                    className="object-cover transition-transform duration-200"
                  />
                  <div
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-300"
                    style={{ backgroundColor: "#0041ff" }}
                  >
                    <span className="text-white font-bold font-archivo-narrow text-xl md:text-2xl lg:text-3xl text-center px-2 select-none group-hover:scale-110 transition-transform duration-300">
                      {trabalho.name}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
      <ContactButton />
    </div>
  );
}
