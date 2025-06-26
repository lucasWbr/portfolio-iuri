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

const fonts = [
  { value: "Inter", label: "Inter" },
  { value: "Roboto", label: "Roboto" },
  { value: "Open Sans", label: "Open Sans" },
  { value: "Lato", label: "Lato" },
  { value: "Montserrat", label: "Montserrat" },
  { value: "Poppins", label: "Poppins" },
];

export default function ConfigForm() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<UsuarioFormData>({
    resolver: zodResolver(usuarioSchema),
    defaultValues: {
      name: "",
      text: "",
      behance: "",
      linkedin: "",
      facebook: "",
      instagram: "",
      colorHeader: "#ffffff",
      colorBackgroundIndex: "#f8f9fa",
      colorBackgroundWorks: "#ffffff",
      font: "Inter",
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
          behance: result.data.behance || "",
          linkedin: result.data.linkedin || "",
          facebook: result.data.facebook || "",
          instagram: result.data.instagram || "",
          colorHeader: result.data.colorHeader,
          colorBackgroundIndex: result.data.colorBackgroundIndex,
          colorBackgroundWorks: result.data.colorBackgroundWorks,
          font: result.data.font,
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

            {/* Aparência */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Aparência</h3>

              <FormField
                control={form.control}
                name="font"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fonte</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma fonte" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {fonts.map((font) => (
                          <SelectItem key={font.value} value={font.value}>
                            {font.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="colorHeader"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cor do Header</FormLabel>
                      <FormControl>
                        <div className="flex gap-2">
                          <Input
                            {...field}
                            type="color"
                            className="w-16 h-10 p-1 border"
                          />
                          <Input
                            {...field}
                            placeholder="#ffffff"
                            className="flex-1"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="colorBackgroundIndex"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fundo da Página Inicial</FormLabel>
                      <FormControl>
                        <div className="flex gap-2">
                          <Input
                            {...field}
                            type="color"
                            className="w-16 h-10 p-1 border"
                          />
                          <Input
                            {...field}
                            placeholder="#f8f9fa"
                            className="flex-1"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="colorBackgroundWorks"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fundo dos Trabalhos</FormLabel>
                      <FormControl>
                        <div className="flex gap-2">
                          <Input
                            {...field}
                            type="color"
                            className="w-16 h-10 p-1 border"
                          />
                          <Input
                            {...field}
                            placeholder="#ffffff"
                            className="flex-1"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
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
