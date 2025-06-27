"use client";

import Header from "@/components/Header";
import BackToHome from "@/components/BackToHome";
import Footer from "@/components/Footer";
import ContactButton from "@/components/ContactButton";
import { useLanguage } from "@/hooks/use-language";
import { useState, useEffect } from "react";
import { Trabalho } from "@/types";
// import Image from "next/image"; // Usando img regular por enquanto
import { notFound } from "next/navigation";
import { useParams } from "next/navigation";

export default function TrabalhoPage() {
  const params = useParams();
  const { language, isLoading: languageLoading } = useLanguage();
  const [trabalho, setTrabalho] = useState<Trabalho | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
      } catch (error) {
        console.error("Erro ao buscar trabalho:", error);
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
        <Header showTags={true} />
        <BackToHome />
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

  return (
    <div className="min-h-screen bg-index-custom flex flex-col">
      <Header />
      <BackToHome />

      <main className="flex-1 max-w-6xl mx-auto px-6 py-8 w-full">
        {/* Título centralizado */}
        <div className="mb-8">
          <div className="text-center mb-4">
            <h1 className="text-3xl md:text-4xl font-bold text-black uppercase">
              {trabalho.name}
            </h1>
          </div>

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
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-sm overflow-hidden p-4"
                >
                  <img
                    src={imageUrl}
                    alt={`${trabalho.name} - ${index + 1}`}
                    className="w-full h-auto object-contain max-w-full"
                    onError={(e) => {
                      console.error(
                        `Erro ao carregar imagem ${index + 1}:`,
                        imageUrl
                      );
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
              ))}
            </div>
          )}

          {/* GIFs */}
          {isVideo && trabalho.image && trabalho.image.length > 0 && (
            <div className="space-y-6">
              {trabalho.image.map((gifUrl, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-sm overflow-hidden flex justify-center p-4"
                >
                  <img
                    src={gifUrl}
                    alt={`${trabalho.name} - GIF ${index + 1}`}
                    className="max-w-full h-auto object-contain rounded"
                    onError={(e) => {
                      console.error(
                        `Erro ao carregar GIF ${index + 1}:`,
                        gifUrl
                      );
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
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
              <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
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
