import AdminLayout from "@/components/admin/AdminLayout";
import TagsList from "@/components/admin/TagsList";

export default function AdminTags() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gerenciar Tags</h1>
          <p className="text-gray-600">
            Adicione descrições às tags e controle sua visibilidade no menu de
            navegação
          </p>
        </div>

        <TagsList />
      </div>
    </AdminLayout>
  );
}
