import AdminLayout from "@/components/admin/AdminLayout";
import ConfigForm from "@/components/admin/ConfigForm";

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Configurações Gerais
          </h1>
          <p className="text-gray-600">
            Configure suas informações pessoais, redes sociais e aparência do
            site
          </p>
        </div>

        <ConfigForm />
      </div>
    </AdminLayout>
  );
}
