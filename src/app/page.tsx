"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactButton from "@/components/ContactButton";
import { useLanguage } from "@/hooks/use-language";
import { useState, useEffect } from "react";
import { Trabalho } from "@/types";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const { isLoading: languageLoading } = useLanguage();
  const [trabalhos, setTrabalhos] = useState<Trabalho[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchTrabalhos() {
      try {
        // Buscar trabalhos com randomização
        const response = await fetch("/api/trabalhos?randomize=true");
        const data = await response.json();

        if (data.success) {
          setTrabalhos(data.data || []);

          // Extrair tags únicas dos trabalhos para compatibilidade com Header
          const allTags =
            data.data?.flatMap((trabalho: Trabalho) => trabalho.tags) || [];
          const uniqueTags = [...new Set(allTags)] as string[];
          setTags(uniqueTags);
        }
      } catch {
        // Erro ao buscar trabalhos
      } finally {
        setIsLoading(false);
      }
    }

    fetchTrabalhos();
  }, []);

  if (isLoading || languageLoading) {
    return (
      <div className="min-h-screen bg-index-custom flex flex-col">
        <Header showTags={true} />
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

  return (
    <div className="min-h-screen bg-index-custom flex flex-col">
      <Header showTags={true} tags={tags} />

      {/* Grid de trabalhos */}
      <main className="flex-1 w-[92%] mx-auto px-6 py-8">
        {trabalhos.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">Nenhum trabalho encontrado.</p>
            <p className="text-gray-400 mt-2">
              Os trabalhos aparecerão aqui quando forem adicionados.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trabalhos.map((trabalho) => (
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
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-300 bg-black/70">
                    <span className="text-white font-bold font-archivo-narrow text-xl md:text-2xl lg:text-3xl text-center px-2 select-none">
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
