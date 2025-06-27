import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuração de segurança para CVE-2025-48068
  allowedDevOrigins: ["localhost", "127.0.0.1"],

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },

  // Configuração para evitar problemas com Server Actions
  serverExternalPackages: ["@prisma/client"],

  // Desabilitar file watching durante o build para evitar problemas de permissão
  output: "standalone",
};

export default nextConfig;
