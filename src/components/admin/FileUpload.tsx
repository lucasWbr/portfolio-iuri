"use client";

import { useState, useRef, useCallback } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import { validateFile } from "@/lib/supabase-client";
import Image from "next/image";

interface FileUploadProps {
  value?: string[];
  onChange: (urls: string[]) => void;
  maxFiles?: number;
  acceptedTypes?: string[];
  maxSizeMB?: number;
  folder?: string;
}

export default function FileUpload({
  value = [],
  onChange,
  maxFiles = 5,
  acceptedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"],
  maxSizeMB = 10,
  folder = "trabalhos",
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    async (files: FileList) => {
      if (value.length + files.length > maxFiles) {
        toast.error(`Máximo de ${maxFiles} arquivos permitidos`);
        return;
      }

      setIsUploading(true);
      const uploadPromises: Promise<any>[] = [];

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

        // Usar API route para upload
        const formData = new FormData();
        formData.append("file", file);
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

        if (successfulUploads.length > 0) {
          onChange([...value, ...successfulUploads]);
          toast.success(
            `${successfulUploads.length} arquivo(s) enviado(s) com sucesso!`
          );
        }

        if (failedUploads.length > 0) {
          failedUploads.forEach((result) => {
            toast.error(`Erro no upload: ${result.error}`);
          });
        }
      } catch (error) {
        toast.error("Erro inesperado no upload");
      } finally {
        setIsUploading(false);
      }
    },
    [value, onChange, maxFiles, maxSizeMB, acceptedTypes, folder]
  );

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFiles(e.dataTransfer.files);
      }
    },
    [handleFiles]
  );

  const removeFile = (indexToRemove: number) => {
    const newFiles = value.filter((_, index) => index !== indexToRemove);
    onChange(newFiles);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      {/* Upload area */}
      <Card
        className={`transition-colors ${
          dragActive
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
                {isUploading ? "Enviando arquivos..." : "Arraste arquivos aqui"}
              </p>
              <p className="text-sm text-gray-500">
                ou{" "}
                <Button
                  type="button"
                  variant="link"
                  className="p-0 h-auto text-blue-600"
                  onClick={openFileDialog}
                  disabled={isUploading}
                >
                  clique para selecionar
                </Button>
              </p>
              <p className="text-xs text-gray-400">
                Máximo {maxFiles} arquivos • {maxSizeMB}MB cada •{" "}
                {acceptedTypes.join(", ")}
              </p>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={acceptedTypes.join(",")}
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
            className="hidden"
          />
        </CardContent>
      </Card>

      {/* Preview dos arquivos */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {value.map((url, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <Image
                  src={url}
                  alt={`Upload ${index + 1}`}
                  width={200}
                  height={200}
                  className="w-full h-full object-cover"
                  placeholder="empty"
                  unoptimized={url.endsWith(".gif")}
                />
              </div>

              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeFile(index)}
                disabled={isUploading}
              >
                <X className="h-3 w-3" />
              </Button>
              {isUploading && (
                <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
