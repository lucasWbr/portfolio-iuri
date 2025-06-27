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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usuarioSchema, type UsuarioFormData } from "@/lib/validations/usuario";
import { updateUsuario, getUsuario } from "@/lib/actions/usuario";
import { Loader2 } from "lucide-react";
import FileUpload from "./FileUpload";

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

  const form = useForm<UsuarioFormData>({
    resolver: zodResolver(usuarioSchema),
    defaultValues: {
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
    },
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
      }
    }
    loadData();
  }, [form]);

  async function onSubmit(data: UsuarioFormData) {
    setIsLoading(true);
    try {
      const result = await updateUsuario(data);

      if (result.success) {
        toast.success("Configurações salvas com sucesso!");
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
                    <FormControl>
                      <FileUpload
                        value={field.value ? [field.value] : []}
                        onChange={(urls) => field.onChange(urls[0] || "")}
                        maxFiles={1}
                        acceptedTypes={[
                          "image/jpeg",
                          "image/png",
                          "image/webp",
                        ]}
                        folder="bio"
                      />
                    </FormControl>
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

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Salvar Configurações
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
