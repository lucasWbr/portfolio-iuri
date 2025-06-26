"use client";

import { useConfig } from "@/hooks/use-config";
import Link from "next/link";
import { Instagram, Linkedin, Facebook, ExternalLink } from "lucide-react";

export default function Footer() {
  const { config } = useConfig();

  if (!config) return null;

  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-16">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Informações principais */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {config.name}
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {config.text}
            </p>
          </div>

          {/* Links de navegação */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Navegação</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
                >
                  Trabalhos
                </Link>
              </li>
              <li>
                <Link
                  href="/bio"
                  className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
                >
                  Biografia
                </Link>
              </li>
            </ul>
          </div>

          {/* Redes sociais */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Contato</h3>
            <div className="flex flex-col space-y-3">
              {config.behance && (
                <a
                  href={config.behance}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors text-sm"
                >
                  <ExternalLink className="h-4 w-4" />
                  Behance
                </a>
              )}

              {config.linkedin && (
                <a
                  href={config.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors text-sm"
                >
                  <Linkedin className="h-4 w-4" />
                  LinkedIn
                </a>
              )}

              {config.instagram && (
                <a
                  href={config.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors text-sm"
                >
                  <Instagram className="h-4 w-4" />
                  Instagram
                </a>
              )}

              {config.facebook && (
                <a
                  href={config.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors text-sm"
                >
                  <Facebook className="h-4 w-4" />
                  Facebook
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Linha separadora e copyright */}
        <div className="border-t border-gray-200 mt-8 pt-8">
          <div className="text-center">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} {config.name}. Todos os direitos
              reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
