"use client";

import React, {
  useState,
  useRef,
  useCallback,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Upload, X, Loader2, AlertCircle } from "lucide-react";
import { validateFile } from "@/lib/supabase-client";
import Image from "next/image";

interface PendingFile {
  file: File;
  preview: string;
  id: string;
}

interface FileUploadStagingProps {
  value?: string[];
  onChange: (urls: string[]) => void;
  maxFiles?: number;
  acceptedTypes?: string[];
  maxSizeMB?: number;
  folder?: string;
  disabled?: boolean;
}

export interface FileUploadStagingRef {
  uploadPendingFiles: () => Promise<string[]>;
  hasPendingFiles: boolean;
  clearPendingFiles: () => void;
}

const FileUploadStaging = forwardRef<
  FileUploadStagingRef,
  FileUploadStagingProps
>(
  (
    {
      value = [],
      onChange,
      maxFiles = 5,
      acceptedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"],
      maxSizeMB = 10,
      folder = "trabalhos",
      disabled = false,
    },
    ref
  ) => {
    const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [removeModal, setRemoveModal] = useState<{
      isOpen: boolean;
      type: "existing" | "pending";
      index: number;
      fileName?: string;
    }>({ isOpen: false, type: "existing", index: -1 });
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Upload dos arquivos pendentes (chamado externamente)
    const uploadPendingFiles = useCallback(async (): Promise<string[]> => {
      if (pendingFiles.length === 0) return [];

      setIsUploading(true);
      const uploadPromises: Promise<any>[] = [];

      for (const pendingFile of pendingFiles) {
        const formData = new FormData();
        formData.append("file", pendingFile.file);
        formData.append("folder", folder);

        uploadPromises.push(
          fetch("/api/upload", {
            method: "POST",
            body: formData,
          }).then((res) => res.json())
        );
      }

      try {
        const results = await Promise.all(uploadPromises);
        const successfulUploads = results
          .filter((result) => result.success)
          .map((result) => result.data!.publicUrl);

        const failedUploads = results.filter((result) => !result.success);

        if (failedUploads.length > 0) {
          failedUploads.forEach((result) => {
            toast.error(`Erro no upload: ${result.error}`);
          });
          throw new Error("Alguns uploads falharam");
        }

        // Limpar arquivos pendentes após upload bem-sucedido
        setPendingFiles([]);

        return successfulUploads;
      } catch (error) {
        throw error;
      } finally {
        setIsUploading(false);
      }
    }, [pendingFiles, folder]);

    // Limpar arquivos pendentes
    const clearPendingFiles = useCallback(() => {
      pendingFiles.forEach((file) => URL.revokeObjectURL(file.preview));
      setPendingFiles([]);
    }, [pendingFiles]);

    // Expor funções para o componente pai
    useImperativeHandle(
      ref,
      () => ({
        uploadPendingFiles,
        hasPendingFiles: pendingFiles.length > 0,
        clearPendingFiles,
      }),
      [uploadPendingFiles, pendingFiles.length, clearPendingFiles]
    );

    const handleFiles = useCallback(
      (files: FileList) => {
        if (disabled) return;

        const totalFiles = value.length + pendingFiles.length + files.length;
        if (totalFiles > maxFiles) {
          toast.error(`Máximo de ${maxFiles} arquivos permitidos`);
          return;
        }

        const newPendingFiles: PendingFile[] = [];

        for (let i = 0; i < files.length; i++) {
          const file = files[i];

          // Validar arquivo
          const validation = validateFile(file, {
            maxSize: maxSizeMB,
            allowedTypes: acceptedTypes,
          });

          if (!validation.valid) {
            toast.error(`${file.name}: ${validation.error}`);
            continue;
          }

          // Criar preview
          const preview = URL.createObjectURL(file);
          const id = `${Date.now()}-${Math.random().toString(36).substring(2)}`;

          newPendingFiles.push({ file, preview, id });
        }

        if (newPendingFiles.length > 0) {
          setPendingFiles((prev) => [...prev, ...newPendingFiles]);
          toast.success(
            `${newPendingFiles.length} arquivo(s) preparado(s) para upload`
          );
        }
      },
      [
        value.length,
        pendingFiles.length,
        maxFiles,
        maxSizeMB,
        acceptedTypes,
        disabled,
      ]
    );

    const handleDrag = useCallback(
      (e: React.DragEvent) => {
        if (disabled) return;

        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
          setDragActive(true);
        } else if (e.type === "dragleave") {
          setDragActive(false);
        }
      },
      [disabled]
    );

    const handleDrop = useCallback(
      (e: React.DragEvent) => {
        if (disabled) return;

        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
          handleFiles(e.dataTransfer.files);
        }
      },
      [handleFiles, disabled]
    );

    const openRemoveModal = (
      type: "existing" | "pending",
      index: number,
      fileName?: string
    ) => {
      setRemoveModal({ isOpen: true, type, index, fileName });
    };

    const closeRemoveModal = () => {
      setRemoveModal({ isOpen: false, type: "existing", index: -1 });
    };

    const confirmRemove = () => {
      if (removeModal.type === "existing") {
        // Remover arquivo existente (já salvo)
        const newFiles = value.filter(
          (_, index) => index !== removeModal.index
        );
        onChange(newFiles);
      } else {
        // Remover arquivo pendente
        setPendingFiles((prev) => {
          const removed = prev[removeModal.index];
          URL.revokeObjectURL(removed.preview); // Limpar memory
          return prev.filter((_, index) => index !== removeModal.index);
        });
      }
      closeRemoveModal();
    };

    const openFileDialog = () => {
      if (!disabled) {
        fileInputRef.current?.click();
      }
    };

    // Cleanup de URLs ao desmontar
    useEffect(() => {
      return () => {
        pendingFiles.forEach((file) => URL.revokeObjectURL(file.preview));
      };
    }, [pendingFiles]);

    return (
      <div className="space-y-4">
        {/* Upload area */}
        <Card
          className={`transition-colors ${
            disabled
              ? "opacity-50 cursor-not-allowed border-gray-200"
              : dragActive
              ? "border-blue-500 bg-blue-50"
              : "border-dashed border-gray-300 hover:border-gray-400"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <CardContent className="p-6">
            <div className="text-center">
              <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
                {isUploading ? (
                  <Loader2 className="h-12 w-12 animate-spin" />
                ) : (
                  <Upload className="h-12 w-12" />
                )}
              </div>

              <div className="space-y-2">
                <p className="text-lg font-medium">
                  {disabled
                    ? "Upload desabilitado"
                    : isUploading
                    ? "Enviando arquivos..."
                    : "Arraste arquivos aqui"}
                </p>
                <p className="text-sm text-gray-500">
                  ou{" "}
                  <Button
                    type="button"
                    variant="link"
                    className="p-0 h-auto text-blue-600"
                    onClick={openFileDialog}
                    disabled={disabled || isUploading}
                  >
                    clique para selecionar
                  </Button>
                </p>
                <p className="text-xs text-gray-400">
                  Máximo {maxFiles} arquivos • {maxSizeMB}MB cada •{" "}
                  {acceptedTypes.join(", ")}
                </p>
                {pendingFiles.length > 0 && (
                  <p className="text-xs text-blue-600 flex items-center justify-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {pendingFiles.length} arquivo(s) pendente(s) - serão
                    enviados ao salvar
                  </p>
                )}
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept={acceptedTypes.join(",")}
              onChange={(e) => e.target.files && handleFiles(e.target.files)}
              className="hidden"
              disabled={disabled}
            />
          </CardContent>
        </Card>

        {/* Preview dos arquivos existentes e pendentes */}
        {(value.length > 0 || pendingFiles.length > 0) && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Arquivos já salvos */}
            {value.map((url, index) => (
              <div key={`existing-${index}`} className="relative group">
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <Image
                    src={url}
                    alt={`Upload ${index + 1}`}
                    width={200}
                    height={200}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -top-1 -left-1 bg-green-500 text-white text-xs px-1 rounded">
                  Salvo
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() =>
                    openRemoveModal("existing", index, `Arquivo ${index + 1}`)
                  }
                  disabled={disabled}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}

            {/* Arquivos pendentes */}
            {pendingFiles.map((pendingFile, index) => (
              <div key={pendingFile.id} className="relative group">
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <Image
                    src={pendingFile.preview}
                    alt={pendingFile.file.name}
                    width={200}
                    height={200}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -top-1 -left-1 bg-yellow-500 text-white text-xs px-1 rounded">
                  Pendente
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() =>
                    openRemoveModal("pending", index, pendingFile.file.name)
                  }
                  disabled={disabled}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Modal de Confirmação para Remoção */}
        <Dialog open={removeModal.isOpen} onOpenChange={closeRemoveModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Remover Arquivo</DialogTitle>
              <DialogDescription>
                Tem certeza que deseja remover{" "}
                <strong>&quot;{removeModal.fileName}&quot;</strong>?
                <br />
                {removeModal.type === "existing" ? (
                  <span className="text-red-600 font-medium">
                    Este arquivo será removido permanentemente do storage.
                  </span>
                ) : (
                  <span className="text-yellow-600 font-medium">
                    Este arquivo não será enviado.
                  </span>
                )}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={closeRemoveModal}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={confirmRemove}>
                <X className="h-4 w-4 mr-2" />
                Remover
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
);

FileUploadStaging.displayName = "FileUploadStaging";

export default FileUploadStaging;
