"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMessage,
  faEnvelope,
  faPhone,
  faArrowUpRightFromSquare,
} from "@fortawesome/free-solid-svg-icons";
import {
  faLinkedinIn,
  faFacebookF,
  faInstagram,
  faBehance,
} from "@fortawesome/free-brands-svg-icons";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useConfig } from "@/hooks/use-config";
import { useLanguage } from "@/hooks/use-language";

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
        <FontAwesomeIcon icon={faMessage} className="h-6 w-6" />
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
                  <FontAwesomeIcon
                    icon={faEnvelope}
                    className="h-5 w-5 text-gray-600"
                  />
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
                  <FontAwesomeIcon
                    icon={faPhone}
                    className="h-5 w-5 text-gray-600"
                  />
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
                    <FontAwesomeIcon
                      icon={faArrowUpRightFromSquare}
                      className="h-3 w-3"
                    />
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
                      <FontAwesomeIcon
                        icon={faBehance}
                        size="2x"
                        style={{ width: "0.75em", height: "0.75em" }}
                        className="text-gray-700"
                      />
                    </a>
                  )}

                  {config.linkedin && (
                    <a
                      href={config.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                    >
                      <FontAwesomeIcon
                        icon={faLinkedinIn}
                        size="2x"
                        style={{ width: "0.75em", height: "0.75em" }}
                        className="text-gray-700"
                      />
                    </a>
                  )}

                  {config.instagram && (
                    <a
                      href={config.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                    >
                      <FontAwesomeIcon
                        icon={faInstagram}
                        size="2x"
                        style={{ width: "0.75em", height: "0.75em" }}
                        className="text-gray-700"
                      />
                    </a>
                  )}

                  {config.facebook && (
                    <a
                      href={config.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                    >
                      <FontAwesomeIcon
                        icon={faFacebookF}
                        size="2x"
                        style={{ width: "0.75em", height: "0.75em" }}
                        className="text-gray-700"
                      />
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
