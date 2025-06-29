"use client";

import Link from "next/link";
import LanguageToggle from "./LanguageToggle";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import { useLanguage } from "@/hooks/use-language";
import "@fontsource/archivo-narrow/400.css";
import "@fontsource/archivo-narrow/700.css";

interface HeaderProps {
  showTags?: boolean;
  tags?: string[];
  currentTag?: string;
  currentPage?: string;
}

export default function Header({
  showTags = true,
  tags = [],
  currentTag,
  currentPage,
}: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [allTags, setAllTags] = useState<string[]>([]);
  const { language, translateTag } = useLanguage();

  // Buscar tags se não foram fornecidas
  useEffect(() => {
    if (showTags && tags.length === 0) {
      async function fetchTags() {
        try {
          const response = await fetch("/api/tags");
          const data = await response.json();
          if (data.success) {
            // Extrair apenas os nomes das tags ativas
            const tagNames =
              data.data?.map((tag: { name: string }) => tag.name) || [];
            setAllTags(tagNames);
          }
        } catch (error) {
          // Fallback para buscar das trabalhos se API de tags falhar
          try {
            const response = await fetch("/api/trabalhos");
            const trabalhoData = await response.json();
            if (trabalhoData.success) {
              const extractedTags =
                trabalhoData.data?.flatMap(
                  (trabalho: { tags: string[] }) => trabalho.tags
                ) || [];
              const uniqueTags = [...new Set(extractedTags)] as string[];
              setAllTags(uniqueTags);
            }
          } catch (fallbackError) {
            // Silenciar erros em produção
          }
        }
      }
      fetchTags();
    } else {
      setAllTags(tags);
    }
  }, [showTags, tags]);

  const displayTags = showTags ? allTags : [];

  return (
    <header className="w-full bg-index-custom px-6 py-4">
      <div className="max-w-7xl mx-auto">
        {/* Desktop Layout */}
        <div className="hidden md:flex justify-between items-center">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center transition-all duration-200 hover:drop-shadow-[0_2px_8px_rgba(0,65,255,0.2)]"
          >
            <Image
              src="/icone-sitevazado.gif"
              alt="Logo"
              width={100}
              height={100}
            />
          </Link>

          {/* Centro - Tags e Bio */}
          <div className="flex items-center gap-8 font-archivo-narrow text-[#0041FF] uppercase tracking-custom">
            {/* Tags */}
            {showTags && (
              <nav className="flex items-center gap-6">
                {displayTags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/tag/${encodeURIComponent(tag)}`}
                    className={`whitespace-nowrap font-archivo-narrow capitalize transition-all duration-200 hover:drop-shadow-[0_2px_8px_rgba(0,65,255,0.2)] text-[#0041FF] uppercase tracking-custom ${
                      tag === currentTag
                        ? "font-bold font-archivo-narrow"
                        : "font-normal"
                    }`}
                  >
                    {translateTag(tag)}
                  </Link>
                ))}
              </nav>
            )}

            {/* Bio */}
            <Link
              href="/bio"
              className={`transition-all duration-200 font-archivo-narrow hover:drop-shadow-[0_2px_8px_rgba(0,65,255,0.2)] text-[#0041FF] uppercase tracking-custom ${
                currentPage === "bio"
                  ? "font-bold font-archivo-narrow"
                  : "font-normal"
              }`}
            >
              Bio
            </Link>
          </div>

          {/* LanguageToggle */}
          <LanguageToggle className="text-[#0041FF] bg-transparent border-none shadow-none" />
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden flex justify-between items-center">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center transition-all duration-200 hover:drop-shadow-[0_2px_8px_rgba(0,65,255,0.2)]"
          >
            <Image
              src="/icone-sitevazado.gif"
              alt="Logo"
              width={40}
              height={40}
            />
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-[#0041ff] hover:text-blue-900 transition-colors duration-200"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-blue-600">
            <div className="flex flex-col space-y-4 pt-4">
              {/* Bio */}
              <Link
                href="/bio"
                className={`transition-all duration-200 font-archivo-narrow hover:drop-shadow-[0_2px_8px_rgba(0,65,255,0.2)] text-[#0041FF] uppercase tracking-custom ${
                  currentPage === "bio"
                    ? "font-bold font-archivo-narrow"
                    : "font-normal"
                }`}
              >
                Bio
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
