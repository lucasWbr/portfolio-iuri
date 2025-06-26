"use client";

import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SSOCallback() {
  const router = useRouter();

  useEffect(() => {
    // Fallback redirect em caso de erro
    const timer = setTimeout(() => {
      router.push("/admin/dashboard");
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <div className="bg-white py-8 px-6 shadow rounded-lg">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600 mb-2">Finalizando autenticação...</p>
          <p className="text-sm text-gray-500">
            Você será redirecionado em instantes.
          </p>
        </div>
      </div>

      <AuthenticateWithRedirectCallback />
    </div>
  );
}
