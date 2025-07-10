import { z } from "zod";

const baseTrabalhoSchema = z.object({
  name: z
    .string()
    .min(1, "Nome é obrigatório")
    .max(100, "Nome deve ter no máximo 100 caracteres"),
  text: z.string().optional(),
  textEn: z.string().optional(),
  type: z.enum(["imagem", "gif", "youtube"], {
    required_error: "Tipo é obrigatório",
  }),
  tags: z.array(z.string()).min(1, "Pelo menos uma tag é obrigatória"),
  image: z.array(z.string()).optional(),
  youtubeUrl: z
    .union([z.string().url("URL inválida"), z.literal("")])
    .optional(),
  favorite: z.boolean().optional(),
  frontPageHide: z.boolean().optional(),
});

export const trabalhoSchema = baseTrabalhoSchema.refine(
  (data) => {
    // Se for youtube, URL é obrigatória
    if (data.type === "youtube" && !data.youtubeUrl) {
      return false;
    }
    // Se for youtube, pelo menos uma imagem (thumbnail) é obrigatória
    if (data.type === "youtube" && (!data.image || data.image.length === 0)) {
      return false;
    }
    // Se for imagem ou gif, pelo menos uma imagem é obrigatória
    if (
      (data.type === "imagem" || data.type === "gif") &&
      (!data.image || data.image.length === 0)
    ) {
      return false;
    }
    return true;
  },
  {
    message: "Dados incompletos para o tipo selecionado",
    path: ["type"],
  }
);

export const editTrabalhoSchema = baseTrabalhoSchema.partial().extend({
  id: z.string().min(1, "ID é obrigatório"),
});

export type TrabalhoFormData = z.infer<typeof trabalhoSchema>;
export type EditTrabalhoFormData = z.infer<typeof editTrabalhoSchema>;
