"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  trabalhoSchema,
  type TrabalhoFormData,
} from "@/lib/validations/trabalho";
import { z } from "zod";
import {
  createTrabalho,
  updateTrabalho,
  getAllTags,
} from "@/lib/actions/trabalho";
import { Loader2, X, Plus, Download, AlertTriangle } from "lucide-react";
import FileUploadStaging, {
  type FileUploadStagingRef,
} from "./FileUploadStaging";
import type { Trabalho } from "@/types";
import { fetchYouTubeThumbnail, isValidYouTubeUrl } from "@/lib/youtube-utils";

interface TrabalhoFormProps {
  trabalho?: Trabalho;
  onSuccess?: () => void;
}

const tiposTrabalho = [
  { value: "imagem", label: "Imagem" },
  { value: "gif", label: "GIF" },
  { value: "youtube", label: "YouTube" },
];

export default function TrabalhoForm({
  trabalho,
  onSuccess,
}: TrabalhoFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [isLoadingThumbnail, setIsLoadingThumbnail] = useState(false);
  const [initialValues, setInitialValues] = useState<TrabalhoFormData | null>(
    null
  );
  const [pendingFilesCount, setPendingFilesCount] = useState(0);

  // Refs para os componentes de upload
  const imageUploadRef = useRef<FileUploadStagingRef>(null);
  const youtubeUploadRef = useRef<FileUploadStagingRef>(null);

  const isEditing = !!trabalho;

  const defaultValues = {
    name: trabalho?.name || "",
    text: trabalho?.text || "",
    textEn: trabalho?.textEn || "",
    type: (trabalho?.type as "imagem" | "gif" | "youtube") || "imagem",
    tags: trabalho?.tags || [],
    image: trabalho?.image || [],
    youtubeUrl: trabalho?.youtubeUrl || "",
  };

  // Usar schema base sem validação de imagens para permitir arquivos pendentes
  const baseSchema = z.object({
    name: z.string().min(1, "Nome é obrigatório"),
    text: z.string().optional(),
    textEn: z.string().optional(),
    type: z.enum(["imagem", "gif", "youtube"]),
    tags: z.array(z.string()).min(1, "Pelo menos uma tag é obrigatória"),
    image: z.array(z.string()).optional(),
    youtubeUrl: z.string().optional(),
  });

  const form = useForm<TrabalhoFormData>({
    resolver: zodResolver(baseSchema),
    defaultValues,
  });

  // Salvar valores iniciais para permitir reversão
  useEffect(() => {
    if (!initialValues) {
      setInitialValues(defaultValues);
    }
  }, [defaultValues, initialValues]);

  // Monitorar mudanças em arquivos pendentes para atualizar a UI
  useEffect(() => {
    const interval = setInterval(() => {
      const hasPendingImages =
        imageUploadRef.current?.hasPendingFiles ||
        false ||
        youtubeUploadRef.current?.hasPendingFiles ||
        false;

      const newCount = hasPendingImages ? 1 : 0;
      if (newCount !== pendingFilesCount) {
        setPendingFilesCount(newCount);
      }
    }, 100); // Verificar a cada 100ms

    return () => clearInterval(interval);
  }, [pendingFilesCount]);

  const watchType = form.watch("type");
  const watchTags = form.watch("tags");
  const watchImages = form.watch("image");
  const watchYoutubeUrl = form.watch("youtubeUrl");

  // Carregar tags disponíveis
  useEffect(() => {
    async function loadTags() {
      const result = await getAllTags();
      if (result.success) {
        setAvailableTags(result.data || []);
      }
    }
    loadTags();
  }, []);

  // Validação customizada que considera arquivos pendentes
  const validateFormData = (data: any) => {
    const existingImages = data.image || [];
    const hasPendingImages =
      (data.type === "youtube" && youtubeUploadRef.current?.hasPendingFiles) ||
      ((data.type === "imagem" || data.type === "gif") &&
        imageUploadRef.current?.hasPendingFiles);

    const totalImages = existingImages.length + (hasPendingImages ? 1 : 0);

    // Validações específicas por tipo
    if (data.type === "youtube") {
      if (!data.youtubeUrl) {
        throw new Error("URL do YouTube é obrigatória");
      }
      if (totalImages === 0) {
        throw new Error(
          "Pelo menos uma imagem (thumbnail) é obrigatória para vídeos do YouTube"
        );
      }
    } else if (
      (data.type === "imagem" || data.type === "gif") &&
      totalImages === 0
    ) {
      throw new Error(`Pelo menos uma ${data.type} é obrigatória`);
    }

    return true;
  };

  async function onSubmit(data: TrabalhoFormData) {
    setIsLoading(true);
    try {
      // Validar com arquivos pendentes considerados
      validateFormData(data);

      // Fazer upload dos arquivos pendentes primeiro
      let uploadedUrls: string[] = [];

      if (
        data.type === "youtube" &&
        youtubeUploadRef.current?.hasPendingFiles
      ) {
        uploadedUrls = await youtubeUploadRef.current.uploadPendingFiles();
      } else if (
        (data.type === "imagem" || data.type === "gif") &&
        imageUploadRef.current?.hasPendingFiles
      ) {
        uploadedUrls = await imageUploadRef.current.uploadPendingFiles();
      }

      // Combinar URLs existentes com novas
      const finalData = {
        ...data,
        image: [...(data.image || []), ...uploadedUrls],
      };

      let result;
      if (isEditing) {
        // Passar dados antigos para a server action fazer a limpeza
        result = await updateTrabalho(trabalho.id, finalData, trabalho.image);
      } else {
        result = await createTrabalho(finalData);
      }

      if (result.success) {
        toast.success(
          `Trabalho ${isEditing ? "atualizado" : "criado"} com sucesso!`
        );
        if (onSuccess) {
          onSuccess();
        }
      } else {
        toast.error(
          result.error ||
            `Erro ao ${isEditing ? "atualizar" : "criar"} trabalho`
        );
        // Em caso de erro, limpar arquivos pendentes que foram enviados
        if (uploadedUrls.length > 0) {
          // TODO: Implementar limpeza de arquivos órfãos
        }
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : `Erro inesperado ao ${isEditing ? "atualizar" : "criar"} trabalho`;
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  const addTag = () => {
    if (newTag.trim() && !watchTags.includes(newTag.trim())) {
      const updatedTags = [...watchTags, newTag.trim()];
      form.setValue("tags", updatedTags);
      setNewTag("");

      // Adicionar à lista de tags disponíveis se não existir
      if (!availableTags.includes(newTag.trim())) {
        setAvailableTags((prev) => [...prev, newTag.trim()].sort());
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    const updatedTags = watchTags.filter((tag) => tag !== tagToRemove);
    form.setValue("tags", updatedTags);
  };

  const addExistingTag = (tag: string) => {
    if (!watchTags.includes(tag)) {
      const updatedTags = [...watchTags, tag];
      form.setValue("tags", updatedTags);
    }
  };

  const handleYouTubeThumbnail = async () => {
    const youtubeUrl = form.getValues("youtubeUrl");
    if (!youtubeUrl || !isValidYouTubeUrl(youtubeUrl)) {
      toast.error("Por favor, insira uma URL válida do YouTube primeiro");
      return;
    }

    setIsLoadingThumbnail(true);
    try {
      const thumbnailUrl = await fetchYouTubeThumbnail(youtubeUrl);
      if (thumbnailUrl) {
        const currentImages = form.getValues("image") || [];
        // Adiciona a thumbnail no início da lista
        form.setValue("image", [thumbnailUrl, ...currentImages]);
        toast.success("Thumbnail do YouTube carregada com sucesso!");
      } else {
        toast.error("Não foi possível carregar a thumbnail do YouTube");
      }
    } catch (error) {
      toast.error("Erro ao carregar thumbnail do YouTube");
    } finally {
      setIsLoadingThumbnail(false);
    }
  };

  const handleCancel = () => {
    if (initialValues) {
      // Reverter formulário para valores iniciais
      form.reset(initialValues);

      // Limpar arquivos pendentes
      imageUploadRef.current?.clearPendingFiles();
      youtubeUploadRef.current?.clearPendingFiles();

      toast.info("Alterações canceladas");
    }
  };

  const hasPendingChanges = () => {
    if (!initialValues) return false;

    const currentValues = form.getValues();
    const hasFormChanges =
      JSON.stringify(currentValues) !== JSON.stringify(initialValues);
    const hasPendingFiles =
      imageUploadRef.current?.hasPendingFiles ||
      youtubeUploadRef.current?.hasPendingFiles;

    return hasFormChanges || hasPendingFiles;
  };

  const canSubmit = useMemo(() => {
    const data = {
      type: watchType,
      image: watchImages,
      youtubeUrl: watchYoutubeUrl,
      // Outros campos não afetam a validação de imagem
    };

    try {
      validateFormData(data);
      return true;
    } catch {
      return false;
    }
  }, [watchType, watchImages, watchYoutubeUrl, pendingFilesCount]);

  // Mensagem de erro customizada para o tipo
  const getTypeValidationMessage = () => {
    const data = {
      type: watchType,
      image: watchImages,
      youtubeUrl: watchYoutubeUrl,
    };

    try {
      validateFormData(data);
      return null; // Sem erro
    } catch (error) {
      return error instanceof Error ? error.message : "Dados incompletos";
    }
  };

  const typeValidationMessage = useMemo(() => {
    return getTypeValidationMessage();
  }, [watchType, watchImages, watchYoutubeUrl, pendingFilesCount]);

  // Atualizar erros do formulário com base na validação customizada
  useEffect(() => {
    const message = getTypeValidationMessage();
    if (message) {
      form.setError("type", { message });
    } else {
      form.clearErrors("type");
    }
  }, [watchType, watchImages, watchYoutubeUrl, pendingFilesCount, form]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? "Editar Trabalho" : "Novo Trabalho"}</CardTitle>
        <CardDescription>
          {isEditing
            ? "Atualize as informações do trabalho"
            : "Adicione um novo trabalho ao seu portfólio"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Informações Básicas */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Trabalho</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Digite o nome do trabalho"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="text"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição (Opcional)</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Descreva o trabalho..."
                        className="min-h-[100px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="textEn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição em Inglês (Opcional)</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Describe the work in English..."
                        className="min-h-[100px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {tiposTrabalho.map((tipo) => (
                          <SelectItem key={tipo.value} value={tipo.value}>
                            {tipo.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Tags */}
            <div className="space-y-4">
              <FormLabel>Tags</FormLabel>

              {/* Tags selecionadas */}
              {watchTags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {watchTags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="default"
                      className="gap-1 capitalize"
                    >
                      {tag}
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-3 w-3 p-0 hover:bg-transparent"
                        onClick={() => removeTag(tag)}
                      >
                        <X className="h-2 w-2" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}

              {/* Adicionar nova tag */}
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Digite uma nova tag"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                />
                <Button type="button" onClick={addTag} variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* Tags disponíveis */}
              {availableTags.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Tags disponíveis:</p>
                  <div className="flex flex-wrap gap-2">
                    {availableTags
                      .filter((tag) => !watchTags.includes(tag))
                      .map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="cursor-pointer hover:bg-gray-100 capitalize"
                          onClick={() => addExistingTag(tag)}
                        >
                          {tag}
                        </Badge>
                      ))}
                  </div>
                </div>
              )}
            </div>

            {/* Conteúdo baseado no tipo */}
            {(watchType === "imagem" || watchType === "gif") && (
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {watchType === "gif" ? "GIFs" : "Imagens"}
                    </FormLabel>
                    <FormControl>
                      <FileUploadStaging
                        ref={imageUploadRef}
                        value={field.value}
                        onChange={field.onChange}
                        maxFiles={watchType === "gif" ? 3 : 30}
                        acceptedTypes={
                          watchType === "gif"
                            ? ["image/gif"]
                            : ["image/jpeg", "image/png", "image/webp"]
                        }
                        folder={watchType}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {watchType === "youtube" && (
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="youtubeUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL do YouTube</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="url"
                          placeholder="https://www.youtube.com/watch?v=..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Thumbnail para YouTube */}
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Imagem de Apresentação</FormLabel>
                      <div className="space-y-3">
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={handleYouTubeThumbnail}
                            disabled={isLoadingThumbnail}
                            className="flex-1"
                          >
                            {isLoadingThumbnail ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                              <Download className="mr-2 h-4 w-4" />
                            )}
                            {isLoadingThumbnail
                              ? "Carregando..."
                              : "Buscar Thumbnail Automática"}
                          </Button>
                        </div>
                        <div className="text-sm text-gray-600">
                          ou faça upload manual de uma imagem personalizada:
                        </div>
                        <FormControl>
                          <FileUploadStaging
                            ref={youtubeUploadRef}
                            value={field.value}
                            onChange={field.onChange}
                            maxFiles={1}
                            acceptedTypes={[
                              "image/jpeg",
                              "image/png",
                              "image/webp",
                            ]}
                            folder="youtube-thumbnails"
                            disabled={isLoading}
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* Botões de ação */}
            <div className="flex gap-4">
              {isEditing && hasPendingChanges() && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isLoading}
                  className="flex-1"
                >
                  Cancelar Alterações
                </Button>
              )}

              <Button
                type="submit"
                disabled={isLoading || !canSubmit}
                className={
                  isEditing && hasPendingChanges() ? "flex-1" : "w-full"
                }
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading
                  ? "Salvando..."
                  : isEditing
                  ? "Atualizar Trabalho"
                  : "Criar Trabalho"}
              </Button>
            </div>

            {/* Indicadores de status */}
            {hasPendingChanges() && (
              <div className="flex items-center gap-2 text-sm text-yellow-600 bg-yellow-50 p-3 rounded-lg">
                <AlertTriangle className="h-4 w-4" />
                <span>
                  Você tem alterações não salvas
                  {(imageUploadRef.current?.hasPendingFiles ||
                    youtubeUploadRef.current?.hasPendingFiles) &&
                    " e arquivos pendentes"}
                </span>
              </div>
            )}

            {/* Indicador de arquivos pendentes prontos para envio */}
            {(imageUploadRef.current?.hasPendingFiles ||
              youtubeUploadRef.current?.hasPendingFiles) && (
              <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 p-3 rounded-lg">
                <AlertTriangle className="h-4 w-4" />
                <span>
                  Arquivos pendentes serão enviados ao salvar o trabalho
                  {!canSubmit &&
                    " - complete os campos obrigatórios para continuar"}
                </span>
              </div>
            )}

            {/* Aviso se não há imagens suficientes */}
            {!canSubmit &&
              !(
                imageUploadRef.current?.hasPendingFiles ||
                youtubeUploadRef.current?.hasPendingFiles
              ) && (
                <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                  <AlertTriangle className="h-4 w-4" />
                  <span>
                    {watchType === "youtube"
                      ? "Adicione pelo menos uma imagem (thumbnail) e URL do YouTube"
                      : `Adicione pelo menos uma ${watchType} para continuar`}
                  </span>
                </div>
              )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
