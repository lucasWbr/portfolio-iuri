"use client";

import { useConfig } from "@/hooks/use-config";
import { useEffect } from "react";

export default function DynamicStyles() {
  const { config, isLoading } = useConfig();

  useEffect(() => {
    if (isLoading) return;

    // Aplicar cores dinâmicas via CSS custom properties
    const root = document.documentElement;

    root.style.setProperty("--color-header", config.colorHeader);
    root.style.setProperty("--color-bg-index", config.colorBackgroundIndex);
    root.style.setProperty("--color-bg-works", config.colorBackgroundWorks);

    // Aplicar fonte dinâmica
    const fontLink = document.getElementById("google-font");
    if (fontLink) {
      fontLink.remove();
    }

    if (config.font && config.font !== "Inter") {
      const link = document.createElement("link");
      link.id = "google-font";
      link.rel = "stylesheet";
      link.href = `https://fonts.googleapis.com/css2?family=${config.font.replace(
        " ",
        "+"
      )}:wght@400;500;600;700&display=swap`;
      document.head.appendChild(link);

      // Aplicar fonte diretamente no body
      document.body.style.fontFamily = `"${config.font}", sans-serif`;
    } else {
      // Voltar para a fonte padrão do sistema
      document.body.style.fontFamily = "";
    }
  }, [config, isLoading]);

  return null; // Este componente apenas aplica estilos
}
