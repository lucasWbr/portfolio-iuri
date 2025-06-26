"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import AdminLayout from "@/components/admin/AdminLayout";
import TrabalhoForm from "@/components/admin/TrabalhoForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { getTrabalho } from "@/lib/actions/trabalho";
import { toast } from "sonner";
import type { Trabalho } from "@/types";

export default function EditarTrabalho() {
  const router = useRouter();
  const params = useParams();
  const [trabalho, setTrabalho] = useState<Trabalho | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const trabalhoId = params.id as string;

  useEffect(() => {
    async function loadTrabalho() {
      if (!trabalhoId) return;

      setIsLoading(true);
      try {
        const result = await getTrabalho(trabalhoId);
        if (result.success && result.data) {
          setTrabalho(result.data);
        } else {
          toast.error("Trabalho não encontrado");
          router.push("/admin/dashboard/trabalhos");
        }
      } catch (error) {
        toast.error("Erro ao carregar trabalho");
        router.push("/admin/dashboard/trabalhos");
      } finally {
        setIsLoading(false);
      }
    }

    loadTrabalho();
  }, [trabalhoId, router]);

  const handleSuccess = () => {
    router.push("/admin/dashboard/trabalhos");
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  if (!trabalho) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-gray-500">Trabalho não encontrado</p>
          <Link href="/admin/dashboard/trabalhos">
            <Button className="mt-4">Voltar para Trabalhos</Button>
          </Link>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/dashboard/trabalhos">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Editar Trabalho
            </h1>
            <p className="text-gray-600">
              Atualize as informações do trabalho "{trabalho.name}"
            </p>
          </div>
        </div>

        <TrabalhoForm trabalho={trabalho} onSuccess={handleSuccess} />
      </div>
    </AdminLayout>
  );
}
