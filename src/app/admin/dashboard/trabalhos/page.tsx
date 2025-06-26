import Link from "next/link";
import AdminLayout from "@/components/admin/AdminLayout";
import TrabalhosList from "@/components/admin/TrabalhosList";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function AdminTrabalhos() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Gerenciar Trabalhos
            </h1>
            <p className="text-gray-600">
              Adicione, edite ou remova trabalhos do seu portfólio
            </p>
          </div>

          <Link href="/admin/dashboard/trabalhos/novo">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Trabalho
            </Button>
          </Link>
        </div>

        <TrabalhosList />
      </div>
    </AdminLayout>
  );
}
