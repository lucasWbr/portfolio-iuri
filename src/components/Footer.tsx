"use client";

import { useConfig } from "@/hooks/use-config";
import { useLanguage } from "@/hooks/use-language";
import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLinkedinIn,
  faFacebookF,
  faInstagram,
  faBehance,
} from "@fortawesome/free-brands-svg-icons";
import "@fontsource/archivo-narrow/400.css";
import { useTags } from "@/hooks/useTags";

export default function Footer() {
  const { config } = useConfig();
  const { language, translateTag } = useLanguage();
  const { data: tags, isLoading: tagsLoading, error: tagsError } = useTags();

  if (!config || tagsLoading || tagsError) return null;

  const copyrightText =
    language === "en"
      ? "Unauthorized replication of the contents of this site, text and images are strictly prohibited"
      : "Uso não autorizado dos conteúdos deste site é proibido";

  return (
    <footer
      className="bg-blue-600 text-white mt-16 font-archivo-narrow"
      style={{ backgroundColor: "#0041ff" }}
    >
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Primeira linha: Logo à esquerda, Redes sociais à direita */}
        <div className="flex justify-between items-center mb-6">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/icone-site.png"
              alt="Logo"
              width={72}
              height={72}
              className="filter brightness-0 invert"
            />
          </Link>

          {/* Redes sociais */}
          <div className="flex items-center gap-6">
            {config.behance && (
              <a
                href={config.behance}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-200 hover:text-white transition-all duration-200 text-sm font-bold font-archivo-narrow uppercase p-1"
              >
                <FontAwesomeIcon
                  icon={faBehance}
                  size="2x"
                  style={{ width: "0.75em", height: "0.75em" }}
                />
              </a>
            )}

            {config.linkedin && (
              <a
                href={config.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-200 hover:text-white transition-all duration-200 text-sm font-bold font-archivo-narrow uppercase p-1"
              >
                <FontAwesomeIcon
                  icon={faLinkedinIn}
                  size="2x"
                  style={{ width: "0.75em", height: "0.75em" }}
                />
              </a>
            )}

            {config.instagram && (
              <a
                href={config.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-200 hover:text-white transition-all duration-200 text-sm font-bold font-archivo-narrow uppercase p-1"
              >
                <FontAwesomeIcon
                  icon={faInstagram}
                  size="2x"
                  style={{ width: "0.75em", height: "0.75em" }}
                />
              </a>
            )}

            {config.facebook && (
              <a
                href={config.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-200 hover:text-white transition-all duration-200 text-sm font-bold font-archivo-narrow uppercase p-1"
              >
                <FontAwesomeIcon
                  icon={faFacebookF}
                  size="2x"
                  style={{ width: "0.75em", height: "0.75em" }}
                />
              </a>
            )}
          </div>
        </div>

        {/* Segunda linha: Tags e Bio à esquerda */}
        <div className="mb-6">
          <div className="flex flex-wrap items-center gap-4">
            {/* Tags */}
            {tags?.slice(0, 6).map((tag) => (
              <Link
                key={tag.name}
                href={`/tag/${encodeURIComponent(tag.name)}`}
                className="text-blue-200 hover:text-white transition-all duration-200 text-sm font-bold font-archivo-narrow uppercase hover:font-bold hover:font-archivo-narrow"
              >
                {translateTag(tag.name)}
              </Link>
            ))}
            {/* Bio */}
            <Link
              href="/bio"
              className="text-blue-200 hover:text-white transition-all duration-200 text-sm font-bold font-archivo-narrow uppercase hover:font-bold hover:font-archivo-narrow"
            >
              Bio
            </Link>
          </div>
        </div>

        {/* Linha separadora */}
        <div className="border-t border-white/30 mb-6"></div>

        {/* Copyright centralizado */}
        <div className="text-center">
          <p className="text-blue-200 text-xs font-archivo-narrow">
            © {new Date().getFullYear()} Iuri Lang Meira • {copyrightText}
          </p>
        </div>
      </div>
    </footer>
  );
}
