"use client";

import { useState, useEffect, useRef } from "react";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usuarioSchema, type UsuarioFormData } from "@/lib/validations/usuario";
import { updateUsuario, getUsuario } from "@/lib/actions/usuario";
import { Loader2, AlertTriangle, X, Trash2 } from "lucide-react";
import FileUploadStaging, {
  type FileUploadStagingRef,
} from "./FileUploadStaging";

// Função para formatar telefone brasileiro
const formatTelefone = (value: string): string => {
  // Remove tudo que não é número
  const numbers = value.replace(/\D/g, "");

  // Limita a 11 dígitos
  const limitedNumbers = numbers.slice(0, 11);

  // Aplica formatação
  if (limitedNumbers.length <= 2) return limitedNumbers;
  if (limitedNumbers.length <= 6)
    return `(${limitedNumbers.slice(0, 2)}) ${limitedNumbers.slice(2)}`;
  if (limitedNumbers.length <= 10)
    return `(${limitedNumbers.slice(0, 2)}) ${limitedNumbers.slice(
      2,
      6
    )}-${limitedNumbers.slice(6)}`;
  return `(${limitedNumbers.slice(0, 2)}) ${limitedNumbers.slice(
    2,
    7
  )}-${limitedNumbers.slice(7)}`;
};

export default function ConfigForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [initialValues, setInitialValues] = useState<UsuarioFormData | null>(
    null
  );
  const [removePhotoModal, setRemovePhotoModal] = useState(false);

  // Ref para o upload de foto da bio
  const photoUploadRef = useRef<FileUploadStagingRef>(null);

  const defaultValues = {
    name: "",
    text: "",
    textEn: "",
    fotoBio: "",
    email: "",
    telefone: "",
    behance: "",
    linkedin: "",
    facebook: "",
    instagram: "",
  };

  const form = useForm<UsuarioFormData>({
    resolver: zodResolver(usuarioSchema),
    defaultValues,
  });

  // Carregar dados existentes
  useEffect(() => {
    async function loadData() {
      const result = await getUsuario();
      if (result.success && result.data) {
        // Converter null para string vazia para compatibilidade com o formulário
        const formData = {
          name: result.data.name,
          text: result.data.text,
          textEn: result.data.textEn || "",
          fotoBio: result.data.fotoBio || "",
          email: result.data.email || "",
          telefone: result.data.telefone || "",
          behance: result.data.behance || "",
          linkedin: result.data.linkedin || "",
          facebook: result.data.facebook || "",
          instagram: result.data.instagram || "",
        };
        form.reset(formData);
        setInitialValues(formData);
      }
    }
    loadData();
  }, [form]);

  async function onSubmit(data: UsuarioFormData) {
    setIsLoading(true);
    try {
      // Fazer upload da foto pendente primeiro, se houver
      let uploadedPhotoUrl = "";
      if (photoUploadRef.current?.hasPendingFiles) {
        try {
          const uploadedUrls =
            await photoUploadRef.current.uploadPendingFiles();
          uploadedPhotoUrl = uploadedUrls[0] || "";
        } catch (uploadError) {
          toast.error("Erro ao enviar foto. Tente novamente.");
          return;
        }
      }

      // Preparar dados finais
      const finalData = {
        ...data,
        fotoBio: uploadedPhotoUrl || data.fotoBio,
      };

      const result = await updateUsuario(finalData);

      if (result.success) {
        toast.success("Configurações salvas com sucesso!");
        // Atualizar valores iniciais
        setInitialValues(finalData);
        // Notificar outras abas/componentes sobre a mudança
        window.dispatchEvent(new Event("config-updated"));
        // Forçar recarregamento das configurações
        window.location.reload();
      } else {
        toast.error(result.error || "Erro ao salvar configurações");
      }
    } catch (error) {
      toast.error("Erro inesperado ao salvar configurações");
    } finally {
      setIsLoading(false);
    }
  }

  const handleCancel = () => {
    if (initialValues) {
      form.reset(initialValues);
      photoUploadRef.current?.clearPendingFiles();
      toast.info("Alterações canceladas");
    }
  };

  const handleRemovePhoto = () => {
    form.setValue("fotoBio", "");
    setRemovePhotoModal(false);
    toast.success("Foto removida");
  };

  const hasPendingChanges = () => {
    if (!initialValues) return false;

    const currentValues = form.getValues();
    const hasFormChanges =
      JSON.stringify(currentValues) !== JSON.stringify(initialValues);
    const hasPendingFiles = photoUploadRef.current?.hasPendingFiles;

    return hasFormChanges || hasPendingFiles;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações do Site</CardTitle>
        <CardDescription>
          Configure a aparência e informações básicas do seu portfólio
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Informações Básicas */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Informações Básicas</h3>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Artista</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Seu nome" />
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
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <textarea
                        {...field}
                        className="w-full min-h-[100px] px-3 py-2 border border-gray-200 rounded-md resize-vertical"
                        placeholder="Conte sobre você e seu trabalho..."
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
                      <textarea
                        {...field}
                        className="w-full min-h-[100px] px-3 py-2 border border-gray-200 rounded-md resize-vertical"
                        placeholder="Tell about yourself and your work..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fotoBio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Foto da Bio (Opcional)</FormLabel>
                    <div className="space-y-3">
                      {field.value && (
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-green-600">
                            Foto atual salva
                          </span>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setRemovePhotoModal(true)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Remover
                          </Button>
                        </div>
                      )}
                      <FormControl>
                        <FileUploadStaging
                          ref={photoUploadRef}
                          value={field.value ? [field.value] : []}
                          onChange={(urls: string[]) =>
                            field.onChange(urls[0] || "")
                          }
                          maxFiles={1}
                          acceptedTypes={[
                            "image/jpeg",
                            "image/png",
                            "image/webp",
                          ]}
                          folder="bio"
                          disabled={isLoading}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Informações de Contato */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Informações de Contato</h3>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="seu@email.com"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="telefone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="(11) 99999-9999"
                        onChange={(e) => {
                          const formatted = formatTelefone(e.target.value);
                          field.onChange(formatted);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Redes Sociais */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Redes Sociais</h3>

              {["behance", "linkedin", "facebook", "instagram"].map(
                (social) => (
                  <FormField
                    key={social}
                    control={form.control}
                    name={social as any}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="capitalize">{social}</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="url"
                            placeholder={`https://${social}.com/seuperfil`}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )
              )}
            </div>

            {/* Botões de ação */}
            <div className="flex gap-4">
              {hasPendingChanges() && (
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
                disabled={isLoading}
                className={hasPendingChanges() ? "flex-1" : "w-full"}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? "Salvando..." : "Salvar Configurações"}
              </Button>
            </div>

            {/* Indicador de mudanças pendentes */}
            {hasPendingChanges() && (
              <div className="flex items-center gap-2 text-sm text-yellow-600 bg-yellow-50 p-3 rounded-lg">
                <AlertTriangle className="h-4 w-4" />
                <span>
                  Você tem alterações não salvas
                  {photoUploadRef.current?.hasPendingFiles &&
                    " e arquivos pendentes"}
                </span>
              </div>
            )}
          </form>
        </Form>

        {/* Modal de Confirmação para Remover Foto */}
        <Dialog open={removePhotoModal} onOpenChange={setRemovePhotoModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Remover Foto da Bio</DialogTitle>
              <DialogDescription>
                Tem certeza que deseja remover a foto da bio?
                <br />
                <span className="text-red-600 font-medium">
                  Esta ação não pode ser desfeita e a foto será removida
                  permanentemente do storage.
                </span>
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setRemovePhotoModal(false)}
              >
                Cancelar
              </Button>
              <Button variant="destructive" onClick={handleRemovePhoto}>
                <Trash2 className="h-4 w-4 mr-2" />
                Remover Foto
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
