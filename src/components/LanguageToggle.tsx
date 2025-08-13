"use client";

import { useLanguage } from "@/hooks/use-language";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";

export default function LanguageToggle({
  className = "",
}: {
  className?: string;
}) {
  const { language, isLoading, toggleLanguage } = useLanguage();

  if (isLoading) {
    return <div className="w-16 h-9 bg-blue-400 rounded-md animate-pulse" />;
  }

  // Exibir o idioma atual
  const currentLanguageText = language === "pt" ? "Português" : "English";
  const currentLanguageCode = language === "pt" ? "PT" : "EN";

  // Tooltip traduzido
  const tooltipText =
    language === "pt"
      ? `Idioma atual: ${currentLanguageText}. Clique para alternar para English.`
      : `Current language: ${currentLanguageText}. Click to switch to Português.`;

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLanguage}
      className={`flex items-center gap-2 transition-all duration-200 ${className}`}
      title={tooltipText}
    >
      <FontAwesomeIcon icon={faGlobe} className="h-4 w-4" />
      <span className="text-sm font-medium">{currentLanguageCode}</span>
    </Button>
  );
}
