"use client";

import { useState, useEffect } from "react";
import { Usuario } from "@/types";

interface Config {
  name: string;
  text: string;
  behance?: string;
  linkedin?: string;
  facebook?: string;
  instagram?: string;
  colorHeader: string;
  colorBackgroundIndex: string;
  colorBackgroundWorks: string;
  font: string;
}

const defaultConfig: Config = {
  name: "Portfólio",
  text: "Designer e desenvolvedor criativo",
  colorHeader: "#ffffff",
  colorBackgroundIndex: "#f8f9fa",
  colorBackgroundWorks: "#ffffff",
  font: "Inter",
};

export function useConfig() {
  const [config, setConfig] = useState<Config>(defaultConfig);
  const [isLoading, setIsLoading] = useState(true);

  const loadConfig = async () => {
    try {
      const response = await fetch("/api/config", {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
        },
      });
      const data = await response.json();

      if (data.success && data.data) {
        setConfig({
          name: data.data.name || defaultConfig.name,
          text: data.data.text || defaultConfig.text,
          behance: data.data.behance,
          linkedin: data.data.linkedin,
          facebook: data.data.facebook,
          instagram: data.data.instagram,
          colorHeader: data.data.colorHeader || defaultConfig.colorHeader,
          colorBackgroundIndex:
            data.data.colorBackgroundIndex ||
            defaultConfig.colorBackgroundIndex,
          colorBackgroundWorks:
            data.data.colorBackgroundWorks ||
            defaultConfig.colorBackgroundWorks,
          font: data.data.font || defaultConfig.font,
        });
      }
    } catch (error) {
      console.error("Erro ao carregar configurações:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadConfig();

    // Adicionar listener para mudanças no localStorage (cross-tab communication)
    const handleStorageChange = () => {
      loadConfig();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("config-updated", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("config-updated", handleStorageChange);
    };
  }, []);

  return { config, isLoading, refetch: loadConfig };
}
