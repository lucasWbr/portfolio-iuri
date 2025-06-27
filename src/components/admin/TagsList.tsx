"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Edit, Trash2, Eye, EyeOff, Plus } from "lucide-react";
import { Tag } from "@/types";
// Substituímos as server actions por funções que usam fetch
import { toast } from "sonner";

// Funções que usam APIs REST
async function getTags() {
  const response = await fetch("/api/admin/tags");
  return await response.json();
}

async function createTag(data: any) {
  const response = await fetch("/api/admin/tags", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return await response.json();
}

async function updateTag(id: string, data: any) {
  const response = await fetch(`/api/admin/tags/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return await response.json();
}

async function deleteTag(id: string) {
  const response = await fetch(`/api/admin/tags/${id}`, {
    method: "DELETE",
  });
  return await response.json();
}

async function getTagUsageCount(tagName: string) {
  const response = await fetch(
    `/api/admin/tags/usage/${encodeURIComponent(tagName)}`
  );
  return await response.json();
}

export default function TagsList() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [usageCounts, setUsageCounts] = useState<Record<string, number>>({});

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isActive: true,
    showInMenu: true,
  });

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      // Buscar todas as tags (não apenas ativas, pois é admin)
      const result = await getTags();
      if (result.success) {
        setTags(result.data || []);

        // Buscar contagem de uso para cada tag
        const counts: Record<string, number> = {};
        for (const tag of result.data || []) {
          const usageResult = await getTagUsageCount(tag.name);
          if (usageResult.success) {
            counts[tag.name] = usageResult.data || 0;
          }
        }
        setUsageCounts(counts);
      } else {
        toast.error("Erro ao carregar tags");
      }
    } catch (error) {
      toast.error("Erro ao carregar tags");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      const result = await createTag(formData);
      if (result.success) {
        toast.success("Tag criada com sucesso!");
        setIsCreateDialogOpen(false);
        setFormData({
          name: "",
          description: "",
          isActive: true,
          showInMenu: true,
        });
        fetchTags();
      } else {
        toast.error(result.error || "Erro ao criar tag");
      }
    } catch (error) {
      toast.error("Erro ao criar tag");
    }
  };

  const handleEdit = async () => {
    if (!editingTag) return;

    try {
      const result = await updateTag(editingTag.id, formData);
      if (result.success) {
        toast.success("Tag atualizada com sucesso!");
        setEditingTag(null);
        setFormData({
          name: "",
          description: "",
          isActive: true,
          showInMenu: true,
        });
        fetchTags();
      } else {
        toast.error(result.error || "Erro ao atualizar tag");
      }
    } catch (error) {
      toast.error("Erro ao atualizar tag");
    }
  };

  const handleDelete = async (tag: Tag) => {
    try {
      const result = await deleteTag(tag.id);
      if (result.success) {
        toast.success("Tag deletada com sucesso!");
        fetchTags();
      } else {
        toast.error(result.error || "Erro ao deletar tag");
      }
    } catch (error) {
      toast.error("Erro ao deletar tag");
    }
  };

  const openEditDialog = (tag: Tag) => {
    setEditingTag(tag);
    setFormData({
      name: tag.name,
      description: tag.description || "",
      isActive: tag.isActive,
      showInMenu: tag.showInMenu,
    });
  };

  const closeEditDialog = () => {
    setEditingTag(null);
    setFormData({
      name: "",
      description: "",
      isActive: true,
      showInMenu: true,
    });
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header com botão de criar */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">Tags ({tags.length})</h2>
          <p className="text-sm text-gray-600">
            Gerencie as tags e suas descrições
          </p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nova Tag
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Nova Tag</DialogTitle>
              <DialogDescription>
                Adicione uma nova tag com descrição opcional
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nome da Tag</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Ex: ilustração, design..."
                />
              </div>

              <div>
                <Label htmlFor="description">Descrição (Opcional)</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Descrição que aparecerá abaixo do título da tag..."
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isActive: checked })
                  }
                />
                <Label htmlFor="isActive">Tag ativa</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="showInMenu"
                  checked={formData.showInMenu}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, showInMenu: checked })
                  }
                />
                <Label htmlFor="showInMenu">Mostrar no menu de navegação</Label>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button onClick={handleCreate} disabled={!formData.name.trim()}>
                Criar Tag
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Grid de tags */}
      {tags.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">Nenhuma tag encontrada.</p>
          <p className="text-gray-400 mt-2">
            As tags serão criadas automaticamente quando você adicionar
            trabalhos.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tags.map((tag) => (
            <Card key={tag.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg capitalize flex items-center gap-2">
                      {tag.name}
                      {!tag.isActive && (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      )}
                      {!tag.showInMenu && (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </CardTitle>
                    <div className="flex gap-2 mt-2">
                      <Badge variant={tag.isActive ? "default" : "secondary"}>
                        {tag.isActive ? "Ativa" : "Inativa"}
                      </Badge>
                      <Badge variant={tag.showInMenu ? "default" : "outline"}>
                        {tag.showInMenu ? "No Menu" : "Oculta"}
                      </Badge>
                      <Badge variant="outline">
                        {usageCounts[tag.name] || 0} uso(s)
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {tag.description && (
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {tag.description}
                  </p>
                )}

                <div className="flex gap-2">
                  <Dialog
                    open={editingTag?.id === tag.id}
                    onOpenChange={(open) => {
                      if (!open) closeEditDialog();
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(tag)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Editar Tag</DialogTitle>
                        <DialogDescription>
                          Modifique as informações da tag
                        </DialogDescription>
                      </DialogHeader>

                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="edit-name">Nome da Tag</Label>
                          <Input
                            id="edit-name"
                            value={formData.name}
                            onChange={(e) =>
                              setFormData({ ...formData, name: e.target.value })
                            }
                          />
                        </div>

                        <div>
                          <Label htmlFor="edit-description">Descrição</Label>
                          <Textarea
                            id="edit-description"
                            value={formData.description}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                description: e.target.value,
                              })
                            }
                            rows={3}
                          />
                        </div>

                        <div className="flex items-center space-x-2">
                          <Switch
                            id="edit-isActive"
                            checked={formData.isActive}
                            onCheckedChange={(checked) =>
                              setFormData({ ...formData, isActive: checked })
                            }
                          />
                          <Label htmlFor="edit-isActive">Tag ativa</Label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Switch
                            id="edit-showInMenu"
                            checked={formData.showInMenu}
                            onCheckedChange={(checked) =>
                              setFormData({ ...formData, showInMenu: checked })
                            }
                          />
                          <Label htmlFor="edit-showInMenu">
                            Mostrar no menu
                          </Label>
                        </div>
                      </div>

                      <DialogFooter>
                        <Button variant="outline" onClick={closeEditDialog}>
                          Cancelar
                        </Button>
                        <Button onClick={handleEdit}>Salvar Alterações</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="h-4 w-4 mr-1" />
                        Deletar
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Deletar Tag</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja deletar a tag "{tag.name}"?
                          {usageCounts[tag.name] > 0 && (
                            <span className="text-red-600 block mt-2">
                              Esta tag está sendo usada em{" "}
                              {usageCounts[tag.name]} trabalho(s).
                            </span>
                          )}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(tag)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Deletar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
