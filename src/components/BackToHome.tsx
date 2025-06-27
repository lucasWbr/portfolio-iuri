"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";

export default function BackToHome() {
  const { language } = useLanguage();

  return (
    <div className="bg-blue-50 border-b border-blue-100 px-6 py-3">
      <div className="max-w-7xl mx-auto">
        <Link
          href="/"
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors duration-200 text-sm font-medium group"
        >
          <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
          {language === "en" ? "Back" : "Voltar"}
        </Link>
      </div>
    </div>
  );
}
