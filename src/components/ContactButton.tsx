"use client";

import { useState } from "react";
import { MessageCircle, Mail, Phone, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useConfig } from "@/hooks/use-config";
import { useLanguage } from "@/hooks/use-language";

// Componente customizado do ícone Behance
const BehanceIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M6.938 4.503c.702 0 1.34.06 1.92.188.577.13 1.07.33 1.485.61.41.28.733.65.96 1.12.225.47.34 1.05.34 1.73 0 .74-.17 1.36-.507 1.86-.338.5-.837.9-1.502 1.22.906.26 1.576.72 2.022 1.37.448.66.673 1.42.673 2.28 0 .76-.13 1.41-.41 1.96-.28.55-.67 1-.17 1.39-.5.39-1.1.67-1.78.84-.68.17-1.42.25-2.23.25H0V4.51h6.938v-.007zM3.495 8.887h2.262c.31 0 .618-.03.926-.09.31-.06.58-.17.83-.35.25-.18.44-.42.58-.72.14-.3.21-.68.21-1.14 0-.56-.17-1.02-.5-1.37-.33-.35-.87-.53-1.61-.53H3.495v4.2zm0 7.725h2.851c.48 0 .91-.05 1.29-.16.38-.1.7-.28.96-.52.26-.24.45-.55.58-.93.13-.38.19-.84.19-1.38 0-.58-.14-1.05-.42-1.42-.28-.37-.68-.65-1.18-.84-.5-.19-1.04-.29-1.61-.29H3.495v5.54zM15.668 7.156h7.706v2.017h-7.706V7.156zm.372 8.818c.3.33.735.49 1.304.49.42 0 .78-.1 1.08-.3.3-.2.5-.44.61-.73h2.24c-.42 1.19-1.01 2.02-1.78 2.48-.77.46-1.68.69-2.73.69-.69 0-1.31-.1-1.86-.31-.55-.21-1.03-.51-1.42-.9-.4-.39-.71-.85-.92-1.4-.21-.55-.32-1.15-.32-1.8 0-.66.11-1.26.34-1.81.23-.55.55-1.01.96-1.4.41-.39.88-.69 1.42-.89.54-.2 1.11-.31 1.72-.31.65 0 1.22.13 1.72.38.5.25.92.58 1.26 1.01.34.43.58.93.74 1.51.16.58.23 1.18.21 1.82h-6.39c0 .67.18 1.27.48 1.6zm.36-4.23c-.25.24-.41.59-.49.99h4.09c-.06-.4-.2-.75-.42-.99-.22-.24-.54-.36-.95-.36-.41 0-.73.12-.98.36-.25.24-.41.59-.49.99z" />
  </svg>
);

// Ícones das redes sociais
const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

export default function ContactButton() {
  const [isOpen, setIsOpen] = useState(false);
  const { config } = useConfig();
  const { language } = useLanguage();

  // Formatar telefone para WhatsApp (apenas números)
  const formatPhoneForWhatsApp = (phone: string): string => {
    return phone.replace(/\D/g, "");
  };

  // Verificar se há informações de contato
  const hasContactInfo =
    config.email ||
    config.telefone ||
    config.behance ||
    config.linkedin ||
    config.facebook ||
    config.instagram;

  if (!hasContactInfo) return null;

  const buttonText = language === "en" ? "Contact us" : "Entre em contato";

  return (
    <>
      {/* Botão flutuante */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-32 right-6 z-[60] bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105 flex items-center gap-2 group"
        style={{ backgroundColor: "#0041ff" }}
      >
        <MessageCircle className="h-6 w-6" />
        <span className="hidden group-hover:block whitespace-nowrap font-medium pr-1">
          {buttonText}
        </span>
      </button>

      {/* Modal de contato */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md z-[70]">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold">
              {language === "en"
                ? "Contact Information"
                : "Informações de Contato"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Email */}
            {config.email && (
              <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0">
                  <Mail className="h-5 w-5 text-gray-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">Email</p>
                  <a
                    href={`mailto:${config.email}`}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    {config.email}
                  </a>
                </div>
              </div>
            )}

            {/* WhatsApp */}
            {config.telefone && (
              <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0">
                  <Phone className="h-5 w-5 text-gray-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">WhatsApp</p>
                  <a
                    href={`https://wa.me/55${formatPhoneForWhatsApp(
                      config.telefone
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 hover:text-green-800 font-medium flex items-center gap-1"
                  >
                    {config.telefone}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            )}

            {/* Redes Sociais */}
            {(config.behance ||
              config.linkedin ||
              config.facebook ||
              config.instagram) && (
              <div>
                <p className="text-sm text-gray-600 mb-3">
                  {language === "en" ? "Social Networks" : "Redes Sociais"}
                </p>
                <div className="flex gap-3 justify-center">
                  {config.behance && (
                    <a
                      href={config.behance}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                    >
                      <BehanceIcon className="h-5 w-5 text-gray-700" />
                    </a>
                  )}

                  {config.linkedin && (
                    <a
                      href={config.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                    >
                      <LinkedinIcon className="h-5 w-5 text-gray-700" />
                    </a>
                  )}

                  {config.instagram && (
                    <a
                      href={config.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                    >
                      <InstagramIcon className="h-5 w-5 text-gray-700" />
                    </a>
                  )}

                  {config.facebook && (
                    <a
                      href={config.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                    >
                      <FacebookIcon className="h-5 w-5 text-gray-700" />
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Botão fechar */}
          <div className="flex justify-center pt-4">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="w-full"
            >
              {language === "en" ? "Close" : "Fechar"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
