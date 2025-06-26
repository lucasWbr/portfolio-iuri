"use client";

import { SignIn, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminLogin() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      setIsRedirecting(true);
      router.replace("/admin/dashboard");
    }
  }, [isLoaded, isSignedIn, router]);

  // Mostrar loading enquanto verifica autenticação ou redirecionando
  if (!isLoaded || isRedirecting) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full text-center">
          <div className="bg-white py-8 px-6 shadow rounded-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600 mb-2">
              {isRedirecting ? "Redirecionando..." : "Carregando..."}
            </p>
            <p className="text-sm text-gray-500">
              {isRedirecting
                ? "Você será redirecionado para o dashboard."
                : "Aguarde enquanto verificamos seu acesso."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Mostrar formulário de login apenas se não estiver logado
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Acesso Administrativo
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Faça login para acessar o painel de administração
          </p>
        </div>

        <div className="bg-white py-8 px-6 shadow rounded-lg">
          <SignIn
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "shadow-none border-none",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
