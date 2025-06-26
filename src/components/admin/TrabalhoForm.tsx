"use client";

import { useState, useEffect } from "react";
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
import {
  createTrabalho,
  updateTrabalho,
  getAllTags,
} from "@/lib/actions/trabalho";
import { Loader2, X, Plus } from "lucide-react";
import FileUpload from "./FileUpload";
import type { Trabalho } from "@/types";

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

  const isEditing = !!trabalho;

  const form = useForm<TrabalhoFormData>({
    resolver: zodResolver(trabalhoSchema),
    defaultValues: {
      name: trabalho?.name || "",
      text: trabalho?.text || "",
      type: (trabalho?.type as "imagem" | "gif" | "youtube") || "imagem",
      tags: trabalho?.tags || [],
      image: trabalho?.image || [],
      youtubeUrl: trabalho?.youtubeUrl || "",
    },
  });

  const watchType = form.watch("type");
  const watchTags = form.watch("tags");

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

  async function onSubmit(data: TrabalhoFormData) {
    setIsLoading(true);
    try {
      let result;
      if (isEditing) {
        result = await updateTrabalho(trabalho.id, data);
      } else {
        result = await createTrabalho(data);
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
      }
    } catch (error) {
      toast.error(
        `Erro inesperado ao ${isEditing ? "atualizar" : "criar"} trabalho`
      );
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
                    <Badge key={tag} variant="default" className="gap-1">
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
                          className="cursor-pointer hover:bg-gray-100"
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
                      <FileUpload
                        value={field.value}
                        onChange={field.onChange}
                        maxFiles={watchType === "gif" ? 3 : 10}
                        acceptedTypes={
                          watchType === "gif"
                            ? ["image/gif"]
                            : ["image/jpeg", "image/png", "image/webp"]
                        }
                        folder={watchType}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {watchType === "youtube" && (
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
            )}

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? "Atualizar Trabalho" : "Criar Trabalho"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
