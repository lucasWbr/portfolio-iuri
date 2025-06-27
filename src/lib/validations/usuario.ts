import { z } from "zod";

// Regex para validar telefone brasileiro
const telefoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;

export const usuarioSchema = z.object({
  name: z
    .string()
    .min(1, "Nome é obrigatório")
    .max(100, "Nome deve ter no máximo 100 caracteres"),
  text: z.string().min(1, "Descrição é obrigatória"),
  textEn: z.string().optional(),
  fotoBio: z.string().url("URL da foto inválida").optional().or(z.literal("")),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  telefone: z
    .string()
    .regex(telefoneRegex, "Telefone deve estar no formato (XX) XXXXX-XXXX")
    .optional()
    .or(z.literal("")),
  behance: z.string().url("URL inválida").optional().or(z.literal("")),
  linkedin: z.string().url("URL inválida").optional().or(z.literal("")),
  facebook: z.string().url("URL inválida").optional().or(z.literal("")),
  instagram: z.string().url("URL inválida").optional().or(z.literal("")),
});

export const editUsuarioSchema = usuarioSchema.partial().extend({
  id: z.string().min(1, "ID é obrigatório"),
});

export type UsuarioFormData = z.infer<typeof usuarioSchema>;
export type EditUsuarioFormData = z.infer<typeof editUsuarioSchema>;
