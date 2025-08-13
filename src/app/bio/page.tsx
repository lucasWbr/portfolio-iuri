"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackToHome from "@/components/BackToHome";
import ContactButton from "@/components/ContactButton";
import { useLanguage } from "@/hooks/use-language";
import { useConfig } from "@/hooks/use-config";
import { useState, useEffect } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLinkedinIn,
  faFacebookF,
  faInstagram,
  faBehance,
} from "@fortawesome/free-brands-svg-icons";
import Image from "next/image";
import { fetchTagsWithCache } from "@/lib/utils/tagCache";
import { useTags } from "@/hooks/useTags";

export default function Bio() {
  const { language, isLoading: languageLoading } = useLanguage();
  const { config, isLoading: configLoading } = useConfig();
  const { data: tags, isLoading: tagsLoading, error: tagsError } = useTags();

  const isLoading = languageLoading || configLoading || tagsLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-index-custom flex flex-col">
        <Header showTags={true} tags={tags?.map((tag) => tag.name) || []} />
        <BackToHome />
        <main className="flex-1 max-w-4xl mx-auto px-6 py-16 w-full">
          <div>
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

  if (!config || tagsError) {
    return (
      <div className="min-h-screen bg-index-custom flex flex-col">
        <Header showTags={true} tags={tags?.map((tag) => tag.name) || []} />
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
      <Header showTags={true} tags={tags?.map((tag) => tag.name) || []} />
      <BackToHome />
      <main className="flex-1 max-w-4xl mx-auto px-6 py-16 w-full">
        <div>
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
              <h1 className="text-3xl font-bold text-[#0041FF] mb-6">
                {config.name}
              </h1>
              <div className="prose prose-gray max-w-none">
                <p className="text-[#0041FF] leading-relaxed whitespace-pre-wrap font-oswald">
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
                    <FontAwesomeIcon
                      icon={faBehance}
                      size="2x"
                      style={{ width: "0.75em", height: "0.75em" }}
                      className="text-gray-700"
                    />
                  </Link>
                )}
                {config.linkedin && (
                  <Link
                    href={config.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors duration-200"
                  >
                    <FontAwesomeIcon
                      icon={faLinkedinIn}
                      size="2x"
                      style={{ width: "0.75em", height: "0.75em" }}
                      className="text-gray-700"
                    />
                  </Link>
                )}
                {config.facebook && (
                  <Link
                    href={config.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors duration-200"
                  >
                    <FontAwesomeIcon
                      icon={faFacebookF}
                      size="2x"
                      style={{ width: "0.75em", height: "0.75em" }}
                      className="text-gray-700"
                    />
                  </Link>
                )}
                {config.instagram && (
                  <Link
                    href={config.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors duration-200"
                  >
                    <FontAwesomeIcon
                      icon={faInstagram}
                      size="2x"
                      style={{ width: "0.75em", height: "0.75em" }}
                      className="text-gray-700"
                    />
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
