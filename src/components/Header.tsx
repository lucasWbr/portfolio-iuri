"use client";

import Link from "next/link";
import LanguageToggle from "./LanguageToggle";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import { useLanguage } from "@/hooks/use-language";

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
  const { language, translateTag, isLoading: languageLoading } = useLanguage();

  // Buscar tags se não foram fornecidas
  useEffect(() => {
    if (showTags && tags.length === 0) {
      async function fetchTags() {
        try {
          const response = await fetch("/api/tags");
          const data = await response.json();
          if (data.success) {
            // Extrair apenas os nomes das tags ativas
            const tagNames = data.data?.map((tag: any) => tag.name) || [];
            setAllTags(tagNames);
          }
        } catch (error) {
          // Fallback para buscar das trabalhos se API de tags falhar
          try {
            const response = await fetch("/api/trabalhos");
            const trabalhoData = await response.json();
            if (trabalhoData.success) {
              const extractedTags =
                trabalhoData.data?.flatMap((trabalho: any) => trabalho.tags) ||
                [];
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
    <header className="w-full header-custom border-b border-blue-600 px-6 py-4">
      <div className="max-w-7xl mx-auto">
        {/* Desktop Layout */}
        <div className="hidden md:flex justify-between items-center">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center transition-all duration-200 hover:drop-shadow-[0_2px_8px_rgba(255,255,255,0.8)]"
          >
            <Image
              src="/icone-site.png"
              alt="Logo"
              width={50}
              height={50}
              className="filter brightness-0 invert"
            />
          </Link>

          {/* Centro - Tags e Bio */}
          <div className="flex items-center gap-8">
            {/* Tags */}
            {showTags && (
              <nav className="flex items-center gap-6">
                {displayTags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/tag/${encodeURIComponent(tag)}`}
                    className={`whitespace-nowrap font-bold capitalize transition-all duration-200 hover:drop-shadow-[0_2px_8px_rgba(255,255,255,0.8)] ${
                      tag === currentTag
                        ? "text-white"
                        : "text-blue-200 hover:text-white"
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
              className={`transition-all duration-200 font-bold hover:drop-shadow-[0_2px_8px_rgba(255,255,255,0.8)] ${
                currentPage === "bio"
                  ? "text-white"
                  : "text-blue-200 hover:text-white"
              }`}
            >
              Bio
            </Link>
          </div>

          {/* LanguageToggle */}
          <LanguageToggle />
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden flex justify-between items-center">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center transition-all duration-200 hover:drop-shadow-[0_2px_8px_rgba(255,255,255,0.8)]"
          >
            <Image
              src="/icone-site.png"
              alt="Logo"
              width={40}
              height={40}
              className="filter brightness-0 invert"
            />
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-white hover:text-blue-200 transition-colors duration-200"
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
                className={`transition-all duration-200 font-bold hover:drop-shadow-[0_2px_8px_rgba(255,255,255,0.8)] ${
                  currentPage === "bio"
                    ? "text-white"
                    : "text-blue-200 hover:text-white"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Bio
              </Link>

              {/* Tags */}
              {showTags && (
                <>
                  <div className="text-blue-300 text-sm font-medium">
                    {language === "en" ? "Categories:" : "Categorias:"}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {displayTags.map((tag) => (
                      <Link
                        key={tag}
                        href={`/tag/${encodeURIComponent(tag)}`}
                        className={`text-sm font-bold capitalize transition-all duration-200 hover:drop-shadow-[0_2px_8px_rgba(255,255,255,0.8)] ${
                          tag === currentTag
                            ? "text-white"
                            : "text-blue-200 hover:text-white"
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {translateTag(tag)}
                      </Link>
                    ))}
                  </div>
                </>
              )}

              {/* Language Toggle */}
              <div className="pt-2">
                <LanguageToggle />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
