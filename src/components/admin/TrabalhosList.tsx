"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Edit, Trash2, ExternalLink, Loader2 } from "lucide-react";
import { getTrabalhos, deleteTrabalho } from "@/lib/actions/trabalho";
import type { Trabalho } from "@/types";

export default function TrabalhosList() {
  const [trabalhos, setTrabalhos] = useState<Trabalho[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    trabalho: Trabalho | null;
  }>({ isOpen: false, trabalho: null });

  useEffect(() => {
    loadTrabalhos();
  }, []);

  async function loadTrabalhos() {
    setIsLoading(true);
    try {
      const result = await getTrabalhos();
      if (result.success) {
        setTrabalhos(result.data || []);
      } else {
        toast.error(result.error || "Erro ao carregar trabalhos");
      }
    } catch (error) {
      toast.error("Erro inesperado ao carregar trabalhos");
    } finally {
      setIsLoading(false);
    }
  }

  function openDeleteModal(trabalho: Trabalho) {
    setDeleteModal({ isOpen: true, trabalho });
  }

  function closeDeleteModal() {
    setDeleteModal({ isOpen: false, trabalho: null });
  }

  async function confirmDelete() {
    if (!deleteModal.trabalho) return;

    const id = deleteModal.trabalho.id;
    setDeletingId(id);

    try {
      const result = await deleteTrabalho(id);
      if (result.success) {
        toast.success("Trabalho deletado com sucesso!");
        setTrabalhos((prev) => prev.filter((t) => t.id !== id));
        closeDeleteModal();
      } else {
        toast.error(result.error || "Erro ao deletar trabalho");
      }
    } catch (error) {
      toast.error("Erro inesperado ao deletar trabalho");
    } finally {
      setDeletingId(null);
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (trabalhos.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-gray-500 mb-4">Nenhum trabalho encontrado</p>
          <Link href="/admin/dashboard/trabalhos/novo">
            <Button>Adicionar Primeiro Trabalho</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {trabalhos.map((trabalho) => (
        <Card key={trabalho.id} className="overflow-hidden">
          <div className="aspect-video relative bg-gray-100">
            {trabalho.image && trabalho.image.length > 0 ? (
              <Image
                src={trabalho.image[0]}
                alt={trabalho.name}
                fill
                className="object-cover"
              />
            ) : trabalho.type === "youtube" && trabalho.youtubeUrl ? (
              <div className="w-full h-full flex items-center justify-center bg-red-100">
                <ExternalLink className="h-8 w-8 text-red-600" />
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-gray-400">Sem imagem</span>
              </div>
            )}
          </div>

          <CardContent className="p-4">
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold text-lg truncate">
                  {trabalho.name}
                </h3>
                {trabalho.text && (
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {trabalho.text}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {trabalho.type}
                </Badge>
                {trabalho.tags.slice(0, 2).map((tag: string) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="text-xs capitalize"
                  >
                    {tag}
                  </Badge>
                ))}
                {trabalho.tags.length > 2 && (
                  <span className="text-xs text-gray-500">
                    +{trabalho.tags.length - 2} mais
                  </span>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <Link
                  href={`/admin/dashboard/trabalhos/editar/${trabalho.id}`}
                  className="flex-1"
                >
                  <Button variant="outline" size="sm" className="w-full">
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                </Link>

                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => openDeleteModal(trabalho)}
                  disabled={deletingId === trabalho.id}
                  className="flex-1"
                >
                  {deletingId === trabalho.id ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4 mr-2" />
                  )}
                  Deletar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Modal de Confirmação */}
      <Dialog open={deleteModal.isOpen} onOpenChange={closeDeleteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deletar Trabalho</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja deletar o trabalho{" "}
              <strong>"{deleteModal.trabalho?.name}"</strong>?
              <br />
              <span className="text-red-600 font-medium">
                Esta ação não pode ser desfeita e todos os arquivos associados
                serão removidos.
              </span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={closeDeleteModal}
              disabled={!!deletingId}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={!!deletingId}
            >
              {deletingId ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4 mr-2" />
              )}
              Deletar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
