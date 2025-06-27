"use client";

import { useState, useEffect } from "react";

interface Config {
  name: string;
  text: string;
  textEn?: string | null;
  fotoBio?: string | null;
  email?: string | null;
  telefone?: string | null;
  behance?: string | null;
  linkedin?: string | null;
  facebook?: string | null;
  instagram?: string | null;
}

const defaultConfig: Config = {
  name: "Portfólio",
  text: "Designer e desenvolvedor criativo",
  textEn: null,
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
          textEn: data.data.textEn,
          fotoBio: data.data.fotoBio,
          email: data.data.email,
          telefone: data.data.telefone,
          behance: data.data.behance,
          linkedin: data.data.linkedin,
          facebook: data.data.facebook,
          instagram: data.data.instagram,
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

    // Listener para recarregar quando configurações são atualizadas
    const handleConfigUpdate = () => {
      loadConfig();
    };

    window.addEventListener("config-updated", handleConfigUpdate);

    return () => {
      window.removeEventListener("config-updated", handleConfigUpdate);
    };
  }, []);

  return {
    config,
    isLoading,
    reload: loadConfig,
  };
}
