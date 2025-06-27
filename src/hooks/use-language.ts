"use client";

import { useState, useEffect } from "react";

type Language = "pt" | "en";

// Mapeamento de tradução das tags
const tagTranslations: Record<string, string> = {
  // Arte e Design
  arte: "art",
  design: "design",
  ilustração: "illustration",
  pintura: "painting",
  desenho: "drawing",
  aquarela: "watercolor",
  óleo: "oil painting",
  acrílica: "acrylic",
  grafite: "graphite",
  nanquim: "ink",

  // Digital
  digital: "digital",
  photoshop: "photoshop",
  illustrator: "illustrator",
  procreate: "procreate",
  "3d": "3d",
  animation: "animation",
  animação: "animation",
  motion: "motion",
  gif: "gif",

  // Fotografia
  fotografia: "photography",
  retrato: "portrait",
  paisagem: "landscape",
  street: "street",
  macro: "macro",
  pb: "bw",
  "preto e branco": "black and white",

  // Estilo
  minimalista: "minimalist",
  abstrato: "abstract",
  realismo: "realism",
  surrealismo: "surrealism",
  impressionismo: "impressionism",
  contemporâneo: "contemporary",
  clássico: "classic",
  moderno: "modern",

  // Projeto
  projeto: "project",
  comissão: "commission",
  estudo: "study",
  esboço: "sketch",
  conceito: "concept",
  final: "final",
  "work in progress": "work in progress",
  wip: "wip",

  // Categorias Específicas do Usuário
  infantil: "kids",
  "trabalho pessoal": "personal work",
  "identidade visual": "visual identity",

  // Materiais e Técnicas
  lápis: "pencil",
  carvão: "charcoal",
  pastel: "pastel",
  caneta: "pen",
  marcador: "marker",
  tinta: "paint",
  papel: "paper",
  tela: "canvas",

  // Temas
  natureza: "nature",
  pessoas: "people",
  animais: "animals",
  cidade: "city",
  arquitetura: "architecture",
  fantasia: "fantasy",
  ficção: "fiction",
  realidade: "reality",
};

// Função para detectar se o usuário é brasileiro baseado no idioma do navegador
function detectIsBrazilian(): boolean {
  if (typeof window === "undefined") return true; // Default para português no servidor

  const languages = navigator.languages || [navigator.language];

  // Verifica se algum dos idiomas preferidos é português brasileiro
  return languages.some(
    (lang) =>
      lang.toLowerCase().startsWith("pt-br") ||
      lang.toLowerCase().startsWith("pt")
  );
}

// Função para detectar idioma inicial
function detectInitialLanguage(): Language {
  if (typeof window === "undefined") return "pt";

  // Verifica localStorage primeiro
  const stored = localStorage.getItem("preferred-language") as Language;
  if (stored && (stored === "pt" || stored === "en")) {
    return stored;
  }

  // Se não há preferência salva, detecta baseado no navegador
  return detectIsBrazilian() ? "pt" : "en";
}

export function useLanguage() {
  const [language, setLanguage] = useState<Language>("pt");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const detected = detectInitialLanguage();
    setLanguage(detected);
    setIsLoading(false);
  }, []);

  const toggleLanguage = () => {
    const newLanguage: Language = language === "pt" ? "en" : "pt";

    if (typeof window !== "undefined") {
      localStorage.setItem("preferred-language", newLanguage);
      // Recarregar a página para aplicar a nova linguagem
      window.location.reload();
    }
  };

  const setLanguagePreference = (lang: Language) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("preferred-language", lang);
      // Recarregar a página para aplicar a nova linguagem
      window.location.reload();
    }
  };

  // Função para traduzir uma tag
  const translateTag = (tag: string): string => {
    if (language === "pt") {
      return tag; // Em português, retorna a tag original
    }

    // Em inglês, procura tradução ou retorna original
    const lowerTag = tag.toLowerCase();
    return tagTranslations[lowerTag] || tag;
  };

  // Função para traduzir array de tags
  const translateTags = (tags: string[]): string[] => {
    return tags.map(translateTag);
  };

  return {
    language,
    isLoading,
    isPortuguese: language === "pt",
    isEnglish: language === "en",
    toggleLanguage,
    setLanguagePreference,
    translateTag,
    translateTags,
  };
}
