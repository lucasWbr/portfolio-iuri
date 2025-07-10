"use client";

import Header from "@/components/Header";
import BackToHome from "@/components/BackToHome";
import Footer from "@/components/Footer";
import ContactButton from "@/components/ContactButton";
import { useLanguage } from "@/hooks/use-language";
import { useState, useEffect } from "react";
import { Trabalho } from "@/types";
import Image from "next/image";
// import Image from "next/image"; // Usando img regular por enquanto
import { notFound } from "next/navigation";
import { useParams } from "next/navigation";
import { useTags } from "@/hooks/useTags";

export default function TrabalhoPage() {
  const params = useParams();
  const { language, isLoading: languageLoading } = useLanguage();
  const [trabalho, setTrabalho] = useState<Trabalho | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { data: tags, isLoading: tagsLoading, error: tagsError } = useTags();

  useEffect(() => {
    async function fetchTrabalho() {
      if (!params.id) return;

      try {
        const response = await fetch(`/api/trabalho/${params.id}`);
        const data = await response.json();

        if (data.success) {
          setTrabalho(data.data);
        } else {
          setTrabalho(null);
        }
      } catch {
        setTrabalho(null);
      } finally {
        setIsLoading(false);
      }
    }

    fetchTrabalho();
  }, [params.id]);

  if (isLoading || languageLoading) {
    return (
      <div className="min-h-screen bg-index-custom flex flex-col">
        <Header showTags={true} tags={tags?.map((tag) => tag.name) || []} />
        <main className="flex-1 max-w-6xl mx-auto px-6 py-8 w-full">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4 w-3/4 mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded mb-8 w-1/2"></div>
            <div className="bg-gray-200 rounded h-96 mb-4"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!trabalho) {
    notFound();
  }

  // Escolher texto baseado no idioma
  const displayText =
    language === "en" && trabalho.textEn ? trabalho.textEn : trabalho.text;

  const isYouTube = trabalho.type === "youtube";
  const isVideo =
    trabalho.type === "gif" ||
    trabalho.type === "video" ||
    trabalho.type === "vídeo";
  const isImage = trabalho.type === "image" || trabalho.type === "imagem";

  // Verificar se tem a tag "revista da cerveja"
  const isRevistaDaCerveja = trabalho.tags.some(
    (tag) => tag.toLowerCase() === "revista da cerveja"
  );

  return (
    <div className="min-h-screen bg-index-custom flex flex-col">
      <Header showTags={true} tags={tags?.map((tag) => tag.name) || []} />
      <div className="relative flex items-center w-full max-w-6xl mx-auto px-6 pt-8 pb-2 mb-4">
        <div className="absolute left-0">
          <BackToHome />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold font-archivo-narrow text-[#0041FF] uppercase mx-auto inline-block text-center">
          {trabalho.name}
        </h1>
      </div>

      <main className="flex-1 max-w-6xl mx-auto px-6 py-8 w-full">
        {/* Título centralizado */}
        <div className="mb-8">
          {/* Tags à esquerda */}
          {trabalho.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {trabalho.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-sm capitalize"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Conteúdo principal */}
        <div className="space-y-6 mb-8">
          {/* YouTube Video */}
          {isYouTube && trabalho.youtubeUrl && (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="aspect-video">
                <iframe
                  src={trabalho.youtubeUrl.replace("watch?v=", "embed/")}
                  title={trabalho.name}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>
            </div>
          )}

          {/* Imagens */}
          {isImage && trabalho.image && trabalho.image.length > 0 && (
            <div className="space-y-6">
              {trabalho.image.map((imageUrl, index) => (
                <Image
                  key={index}
                  src={imageUrl}
                  alt={`${trabalho.name} - ${index + 1}`}
                  width={900}
                  height={700}
                  className="w-full h-auto object-contain max-w-full"
                  placeholder="empty"
                  unoptimized={imageUrl.endsWith(".gif")}
                />
              ))}

              {/* Layout especial para Revista da Cerveja - miniaturas em linha */}
              {isRevistaDaCerveja && trabalho.image.length > 1 && (
                <div className="flex flex-wrap gap-4 justify-center">
                  {trabalho.image.map((imageUrl, index) => (
                    <div key={`thumb-${index}`} className="flex-shrink-0">
                      <Image
                        src={imageUrl}
                        alt={`${trabalho.name} - Miniatura ${index + 1}`}
                        width={128}
                        height={160}
                        className="w-32 h-40 object-cover rounded shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
                        placeholder="empty"
                        unoptimized={imageUrl.endsWith(".gif")}
                        onClick={() => {
                          // Scroll para a imagem grande correspondente
                          const targetElement = document.querySelector(
                            `img[src=\"${imageUrl}\"]`
                          );
                          if (targetElement) {
                            targetElement.scrollIntoView({
                              behavior: "smooth",
                              block: "center",
                            });
                          }
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* GIFs */}
          {isVideo && trabalho.image && trabalho.image.length > 0 && (
            <div className="space-y-6">
              {trabalho.image.map((gifUrl, index) => (
                <Image
                  key={index}
                  src={gifUrl}
                  alt={`${trabalho.name} - GIF ${index + 1}`}
                  width={900}
                  height={700}
                  className="max-w-full h-auto object-contain rounded"
                  placeholder="empty"
                  unoptimized={true}
                />
              ))}
            </div>
          )}
        </div>

        {/* Texto descritivo (opcional) */}
        {displayText && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="prose prose-gray max-w-none">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {language === "en" ? "About this work" : "Sobre este trabalho"}
              </h2>
              <p className="text-lg font-archivo-narrow text-[#0041FF] tracking-custom mt-4 max-w-3xl mx-auto">
                {displayText}
              </p>
            </div>
          </div>
        )}
      </main>

      <Footer />
      <ContactButton />
    </div>
  );
}
