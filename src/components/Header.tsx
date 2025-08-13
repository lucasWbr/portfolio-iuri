"use client";

import Link from "next/link";
import LanguageToggle from "./LanguageToggle";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import { useLanguage } from "@/hooks/use-language";
import "@fontsource/archivo-narrow/400.css";
import "@fontsource/archivo-narrow/700.css";
import { fetchTagsWithCache } from "@/lib/utils/tagCache";

interface HeaderProps {
  showTags?: boolean;
  tags?: string[];
  currentTag?: string;
  currentPage?: string;
}

export default function Header(props: HeaderProps) {
  const safeTags = props.tags ?? [];
  const [allTags, setAllTags] = useState<string[]>(safeTags);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { language, translateTag } = useLanguage();

  useEffect(() => {
    if (!props.showTags) return;
    if (safeTags.length > 0) {
      setAllTags(safeTags);
    } else {
      fetchTagsWithCache().then((tagList) => {
        setAllTags(tagList);
      });
    }
  }, [props.showTags, safeTags.join(",")]);

  const displayTags = props.showTags ? allTags : [];

  return (
    <header className="w-full bg-index-custom px-6 py-4">
      <div className="max-w-7xl mx-auto">
        {/* Desktop Layout */}
        <div className="hidden lg:flex justify-between items-center">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center transition-all duration-200"
          >
            <Image
              src="/icone-sitevazado.gif"
              alt="Logo"
              width={128}
              height={128}
              placeholder="empty"
              unoptimized={true}
            />
          </Link>

          {/* Centro - Tags e Bio */}
          <div className="flex items-center gap-8 font-archivo-narrow text-[#0041FF] uppercase tracking-custom">
            {/* Tags */}
            {props.showTags && (
              <nav className="flex items-center gap-6">
                {displayTags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/tag/${encodeURIComponent(tag)}`}
                    className={`whitespace-nowrap font-archivo-narrow transition-all duration-200 text-[#0041FF] uppercase tracking-custom ${
                      tag === props.currentTag
                        ? "font-bold font-archivo-narrow"
                        : "font-normal"
                    } hover:font-bold hover:font-archivo-narrow`}
                  >
                    {translateTag(tag)}
                  </Link>
                ))}
              </nav>
            )}

            {/* Bio */}
            <Link
              href="/bio"
              className={`transition-all duration-200 font-archivo-narrow text-[#0041FF] uppercase tracking-custom ${
                props.currentPage === "bio"
                  ? "font-bold font-archivo-narrow"
                  : "font-normal"
              } hover:font-bold hover:font-archivo-narrow`}
            >
              Bio
            </Link>
          </div>

          {/* LanguageToggle */}
          <LanguageToggle className="text-[#0041FF] bg-transparent border-none shadow-none" />
        </div>

        {/* Mobile Layout */}
        <div className="flex lg:hidden justify-between items-center">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center transition-all duration-200"
          >
            <Image
              src="/icone-sitevazado.gif"
              alt="Logo"
              width={96}
              height={96}
              placeholder="empty"
              unoptimized={true}
            />
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-[#0041ff] hover:text-blue-900 transition-colors duration-200"
          >
            {isMobileMenuOpen ? (
              <FontAwesomeIcon icon={faXmark} className="h-6 w-6" />
            ) : (
              <FontAwesomeIcon icon={faBars} className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="mt-4 pb-4 border-t border-blue-600 lg:hidden">
            <div className="flex flex-col space-y-4 pt-4">
              {/* Bio */}
              <Link
                href="/bio"
                className={`transition-all duration-200 font-archivo-narrow text-[#0041FF] uppercase tracking-custom ${
                  props.currentPage === "bio"
                    ? "font-bold font-archivo-narrow"
                    : "font-normal"
                } hover:font-bold hover:font-archivo-narrow`}
              >
                Bio
              </Link>
              {/* Tags */}
              {props.showTags && displayTags.length > 0 && (
                <div className="flex flex-col gap-2">
                  {displayTags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/tag/${encodeURIComponent(tag)}`}
                      className={`transition-all duration-200 font-archivo-narrow text-[#0041FF] uppercase tracking-custom ${
                        tag === props.currentTag
                          ? "font-bold font-archivo-narrow"
                          : "font-normal"
                      } hover:font-bold hover:font-archivo-narrow`}
                    >
                      {translateTag(tag)}
                    </Link>
                  ))}
                </div>
              )}
              {/* Language Toggle */}
              <div className="pt-2">
                <LanguageToggle className="text-[#0041FF] bg-transparent border-none shadow-none" />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
