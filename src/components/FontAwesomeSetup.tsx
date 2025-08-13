"use client";

import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";

// Configurar Font Awesome para evitar problemas com Next.js
config.autoAddCss = false; // Desativa a adição automática de CSS

export default function FontAwesomeSetup() {
  // Este componente não renderiza nada, apenas configura o Font Awesome
  return null;
}
