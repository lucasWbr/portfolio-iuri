"use client";

import { useRouter } from "next/navigation";
import AdminLayout from "@/components/admin/AdminLayout";
import TrabalhoForm from "@/components/admin/TrabalhoForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NovoTrabalho() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push("/admin/dashboard/trabalhos");
  };

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
            <h1 className="text-2xl font-bold text-gray-900">Novo Trabalho</h1>
            <p className="text-gray-600">
              Adicione um novo trabalho ao seu portfólio
            </p>
          </div>
        </div>

        <TrabalhoForm onSuccess={handleSuccess} />
      </div>
    </AdminLayout>
  );
}
