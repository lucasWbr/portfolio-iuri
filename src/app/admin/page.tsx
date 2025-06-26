"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminRoot() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded) {
      if (isSignedIn) {
        // Usuário logado → Dashboard
        router.replace("/admin/dashboard");
      } else {
        // Usuário não logado → Login
        router.replace("/admin/login");
      }
    }
  }, [isLoaded, isSignedIn, router]);

  // Loading state enquanto verifica autenticação
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
        <p className="text-gray-600">Verificando acesso...</p>
      </div>
    </div>
  );
}
