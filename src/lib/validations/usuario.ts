import { z } from "zod";

export const usuarioSchema = z.object({
  name: z
    .string()
    .min(1, "Nome é obrigatório")
    .max(100, "Nome deve ter no máximo 100 caracteres"),
  text: z.string().min(1, "Descrição é obrigatória"),
  behance: z.string().url("URL inválida").optional().or(z.literal("")),
  linkedin: z.string().url("URL inválida").optional().or(z.literal("")),
  facebook: z.string().url("URL inválida").optional().or(z.literal("")),
  instagram: z.string().url("URL inválida").optional().or(z.literal("")),
  colorHeader: z
    .string()
    .regex(
      /^#[0-9A-F]{6}$/i,
      "Cor deve estar no formato hexadecimal (#FFFFFF)"
    ),
  colorBackgroundIndex: z
    .string()
    .regex(
      /^#[0-9A-F]{6}$/i,
      "Cor deve estar no formato hexadecimal (#FFFFFF)"
    ),
  colorBackgroundWorks: z
    .string()
    .regex(
      /^#[0-9A-F]{6}$/i,
      "Cor deve estar no formato hexadecimal (#FFFFFF)"
    ),
  font: z.string().min(1, "Fonte é obrigatória"),
});

export const editUsuarioSchema = usuarioSchema.partial().extend({
  id: z.string().min(1, "ID é obrigatório"),
});

export type UsuarioFormData = z.infer<typeof usuarioSchema>;
export type EditUsuarioFormData = z.infer<typeof editUsuarioSchema>;
