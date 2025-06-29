"use client";

import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useLanguage } from "@/hooks/use-language";

export default function BackToHome() {
  const { language } = useLanguage();

  return (
    <div className="flex items-center w-full max-w-7xl mx-auto px-6 pt-8 pb-2">
      <Link href="/" className="flex items-center group">
        <ArrowLeftIcon className="h-7 w-7 text-[#0041ff] group-hover:-translate-x-1 transition-transform duration-200" />
        <span className="sr-only">Voltar</span>
      </Link>
    </div>
  );
}
