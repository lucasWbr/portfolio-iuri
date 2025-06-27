"use client";

import { useConfig } from "@/hooks/use-config";
import { useLanguage } from "@/hooks/use-language";
import Link from "next/link";
import Image from "next/image";
import { Instagram, Linkedin, Facebook } from "lucide-react";

// Componente customizado do ícone Behance
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
import { useState, useEffect } from "react";

export default function Footer() {
  const { config } = useConfig();
  const { language, translateTag } = useLanguage();
  const [tags, setTags] = useState<string[]>([]);

  // Buscar tags para o footer
  useEffect(() => {
    async function fetchTags() {
      try {
        const response = await fetch("/api/trabalhos");
        const data = await response.json();
        if (data.success) {
          const allTags =
            data.data?.flatMap((trabalho: any) => trabalho.tags) || [];
          const uniqueTags = [...new Set(allTags)] as string[];
          setTags(uniqueTags);
        }
      } catch (error) {
        console.error("Erro ao buscar tags:", error);
      }
    }
    fetchTags();
  }, []);

  if (!config) return null;

  // Função para capitalizar o nome do artista
  const capitalizeWords = (str: string) => {
    return str.replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const copyrightText =
    language === "en"
      ? "Unauthorized replication of the contents of this site, text and images are strictly prohibited"
      : "Uso não autorizado dos conteúdos deste site é proibido";

  return (
    <footer
      className="bg-blue-600 text-white mt-16"
      style={{ backgroundColor: "#0041ff" }}
    >
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Primeira linha: Logo à esquerda, Redes sociais à direita */}
        <div className="flex justify-between items-center mb-6">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/icone-site.png"
              alt="Logo"
              width={50}
              height={50}
              className="filter brightness-0 invert"
            />
          </Link>

          {/* Redes sociais */}
          <div className="flex items-center gap-4">
            {config.behance && (
              <a
                href={config.behance}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-200 hover:text-white transition-all duration-200 hover:drop-shadow-[0_2px_8px_rgba(255,255,255,0.8)]"
              >
                <BehanceIcon className="h-5 w-5" />
              </a>
            )}

            {config.linkedin && (
              <a
                href={config.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-200 hover:text-white transition-all duration-200 hover:drop-shadow-[0_2px_8px_rgba(255,255,255,0.8)]"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            )}

            {config.instagram && (
              <a
                href={config.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-200 hover:text-white transition-all duration-200 hover:drop-shadow-[0_2px_8px_rgba(255,255,255,0.8)]"
              >
                <Instagram className="h-5 w-5" />
              </a>
            )}

            {config.facebook && (
              <a
                href={config.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-200 hover:text-white transition-all duration-200 hover:drop-shadow-[0_2px_8px_rgba(255,255,255,0.8)]"
              >
                <Facebook className="h-5 w-5" />
              </a>
            )}
          </div>
        </div>

        {/* Segunda linha: Tags e Bio à esquerda */}
        <div className="mb-6">
          <div className="flex flex-wrap items-center gap-4">
            {/* Tags */}
            {tags.slice(0, 6).map((tag) => (
              <Link
                key={tag}
                href={`/tag/${encodeURIComponent(tag)}`}
                className="text-blue-200 hover:text-white transition-all duration-200 hover:drop-shadow-[0_2px_8px_rgba(255,255,255,0.8)] text-sm capitalize font-bold"
              >
                {translateTag(tag)}
              </Link>
            ))}

            {/* Bio */}
            <Link
              href="/bio"
              className="text-blue-200 hover:text-white transition-all duration-200 hover:drop-shadow-[0_2px_8px_rgba(255,255,255,0.8)] text-sm font-bold"
            >
              Bio
            </Link>
          </div>
        </div>

        {/* Linha separadora */}
        <div className="border-t border-white/30 mb-6"></div>

        {/* Copyright centralizado */}
        <div className="text-center">
          <p className="text-blue-200 text-xs">
            © {new Date().getFullYear()} Iuri Lang Meira • {copyrightText}
          </p>
        </div>
      </div>
    </footer>
  );
}
