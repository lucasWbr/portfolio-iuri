"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackToHome from "@/components/BackToHome";
import ContactButton from "@/components/ContactButton";
import { useLanguage } from "@/hooks/use-language";
import { useConfig } from "@/hooks/use-config";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Linkedin, Facebook, Instagram } from "lucide-react";
import Image from "next/image";

// Componente customizado do ícone Behance (já que não existe no Lucide)
const BehanceIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M6.938 4.503c.702 0 1.34.06 1.92.188.577.13 1.07.33 1.485.61.41.28.733.65.96 1.12.225.47.34 1.05.34 1.73 0 .74-.17 1.36-.507 1.86-.338.5-.837.9-1.502 1.22.906.26 1.576.72 2.022 1.37.448.66.673 1.42.673 2.28 0 .76-.13 1.41-.41 1.96-.28.55-.67 1-.17 1.39-.5.39-1.1.67-1.78.84-.68.17-1.42.25-2.23.25H0V4.51h6.938v-.007zM3.495 8.887h2.262c.31 0 .618-.03.926-.09.31-.06.58-.17.83-.35.25-.18.44-.42.58-.72.14-.3.21-.68.21-1.14 0-.56-.17-1.02-.5-1.37-.33-.35-.87-.53-1.61-.53H3.495v4.2zm0 7.725h2.851c.48 0 .91-.05 1.29-.16.38-.1.7-.28.96-.52.26-.24.45-.55.58-.93.13-.38.19-.84.19-1.38 0-.58-.14-1.05-.42-1.42-.28-.37-.68-.65-1.18-.84-.5-.19-1.04-.29-1.61-.29H3.495v5.54zM15.668 7.156h7.706v2.017h-7.706V7.156zm.372 8.818c.3.33.735.49 1.304.49.42 0 .78-.1 1.08-.3.3-.2.5-.44.61-.73h2.24c-.42 1.19-1.01 2.02-1.78 2.48-.77.46-1.68.69-2.73.69-.69 0-1.31-.1-1.86-.31-.55-.21-1.03-.51-1.42-.9-.4-.39-.71-.85-.92-1.4-.21-.55-.32-1.15-.32-1.8 0-.66.11-1.26.34-1.81.23-.55.55-1.01.96-1.4.41-.39.88-.69 1.42-.89.54-.2 1.11-.31 1.72-.31.65 0 1.22.13 1.72.38.5.25.92.58 1.26 1.01.34.43.58.93.74 1.51.16.58.23 1.18.21 1.82h-6.39c0 .67.18 1.27.48 1.6zm.36-4.23c-.25.24-.41.59-.49.99h4.09c-.06-.4-.2-.75-.42-.99-.22-.24-.54-.36-.95-.36-.41 0-.73.12-.98.36-.25.24-.41.59-.49.99z" />
  </svg>
);

export default function Bio() {
  const { language, isLoading: languageLoading } = useLanguage();
  const { config, isLoading: configLoading } = useConfig();
  const [tags, setTags] = useState<string[]>([]);

  const isLoading = languageLoading || configLoading;

  // Buscar apenas tags ativas para mostrar no header
  useEffect(() => {
    async function fetchActiveTags() {
      try {
        const response = await fetch("/api/tags");
        const data = await response.json();
        if (data.success) {
          // Extrair apenas os nomes das tags ativas
          const activeTagNames = data.data?.map((tag: any) => tag.name) || [];
          setTags(activeTagNames);
        }
      } catch (error) {
        // Fallback para buscar das trabalhos se API de tags falhar
        try {
          const response = await fetch("/api/trabalhos");
          const trabalhoData = await response.json();
          if (trabalhoData.success) {
            const allTags =
              trabalhoData.data?.flatMap((trabalho: any) => trabalho.tags) ||
              [];
            const uniqueTags = [...new Set(allTags)] as string[];
            setTags(uniqueTags);
          }
        } catch (fallbackError) {
          // Erro ao buscar tags
        }
      }
    }
    fetchActiveTags();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-index-custom flex flex-col">
        <Header showTags={true} tags={tags} />
        <BackToHome />
        <main className="flex-1 max-w-4xl mx-auto px-6 py-16 w-full">
          <div className="bg-white rounded-lg shadow-sm p-8 md:p-12">
            <div className="flex flex-col md:flex-row gap-8 items-start animate-pulse">
              <div className="flex-shrink-0">
                <div className="w-48 h-48 bg-gray-200 rounded-full"></div>
              </div>
              <div className="flex-1">
                <div className="h-8 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!config) {
    return (
      <div className="min-h-screen bg-index-custom flex flex-col">
        <Header showTags={true} tags={tags} />
        <BackToHome />
        <main className="flex-1 max-w-4xl mx-auto px-6 py-16 w-full">
          <div className="text-center">
            <p className="text-gray-500 text-lg">
              Informações do artista não encontradas.
            </p>
            <p className="text-gray-400 mt-2">
              Configure o perfil no painel administrativo.
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Escolher texto baseado no idioma
  const displayText =
    language === "en" && config.textEn ? config.textEn : config.text;

  return (
    <div className="min-h-screen bg-index-custom flex flex-col">
      <Header showTags={true} tags={tags} />
      <BackToHome />

      <main className="flex-1 max-w-4xl mx-auto px-6 py-16 w-full">
        <div className="bg-white rounded-lg shadow-sm p-8 md:p-12">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Foto do artista */}
            <div className="flex-shrink-0">
              <div className="w-48 h-48 bg-gray-200 rounded-full overflow-hidden">
                {config.fotoBio ? (
                  <Image
                    src={config.fotoBio}
                    alt={`Foto de ${config.name}`}
                    width={192}
                    height={192}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <span className="text-4xl font-bold">{config.name[0]}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Informações do artista */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-6">
                {config.name}
              </h1>

              <div className="prose prose-gray max-w-none">
                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap font-oswald">
                  {displayText}
                </p>
              </div>

              {/* Redes sociais */}
              <div className="flex gap-4 mt-8">
                {config.behance && (
                  <Link
                    href={config.behance}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors duration-200"
                  >
                    <BehanceIcon className="w-6 h-6 text-gray-600" />
                  </Link>
                )}

                {config.linkedin && (
                  <Link
                    href={config.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors duration-200"
                  >
                    <Linkedin className="w-6 h-6 text-gray-600" />
                  </Link>
                )}

                {config.facebook && (
                  <Link
                    href={config.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors duration-200"
                  >
                    <Facebook className="w-6 h-6 text-gray-600" />
                  </Link>
                )}

                {config.instagram && (
                  <Link
                    href={config.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors duration-200"
                  >
                    <Instagram className="w-6 h-6 text-gray-600" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <ContactButton />
    </div>
  );
}
