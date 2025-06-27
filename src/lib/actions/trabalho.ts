"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import {
  trabalhoSchema,
  type TrabalhoFormData,
} from "@/lib/validations/trabalho";

export async function getTrabalhos() {
  try {
    const trabalhos = await prisma.trabalhos.findMany({
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: trabalhos };
  } catch {
    return { success: false, error: "Erro ao buscar trabalhos" };
  }
}

export async function getTrabalho(id: string) {
  try {
    const trabalho = await prisma.trabalhos.findUnique({
      where: { id },
    });
    return { success: true, data: trabalho };
  } catch {
    return { success: false, error: "Erro ao buscar trabalho" };
  }
}

export async function createTrabalho(data: TrabalhoFormData) {
  try {
    // Validar dados
    const validatedData = trabalhoSchema.parse(data);

    const trabalho = await prisma.trabalhos.create({
      data: validatedData,
    });

    // Limpeza automática de arquivos órfãos (máximo 30 minutos)
    try {
      const { cleanupOrphanedFiles } = await import("@/lib/supabase-cleanup");
      await cleanupOrphanedFiles(30);
    } catch {
      // Limpeza falhou silenciosamente
    }

    revalidatePath("/");
    revalidatePath("/admin/dashboard/trabalhos");

    return { success: true, data: trabalho };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro ao criar trabalho",
    };
  }
}

export async function updateTrabalho(
  id: string,
  data: TrabalhoFormData,
  oldImages?: string[]
) {
  try {
    // Validar dados
    const validatedData = trabalhoSchema.parse(data);

    // Se oldImages foi passado, identificar arquivos removidos
    if (oldImages && oldImages.length > 0) {
      const newImages = data.image || [];
      const removedFiles = oldImages.filter((url) => !newImages.includes(url));

      if (removedFiles.length > 0) {
        try {
          const { deleteMultipleFilesFromStorage } = await import(
            "@/lib/supabase-cleanup"
          );
          await deleteMultipleFilesFromStorage(removedFiles);
          // Arquivos removidos do storage
        } catch {
          // Limpeza falhou silenciosamente
        }
      }
    }

    const trabalho = await prisma.trabalhos.update({
      where: { id },
      data: validatedData,
    });

    // Limpeza automática de arquivos órfãos (máximo 30 minutos)
    try {
      const { cleanupOrphanedFiles } = await import("@/lib/supabase-cleanup");
      await cleanupOrphanedFiles(30);
    } catch {
      // Limpeza falhou silenciosamente
    }

    revalidatePath("/");
    revalidatePath("/admin/dashboard/trabalhos");
    revalidatePath(`/trabalho/${id}`);

    return { success: true, data: trabalho };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Erro ao atualizar trabalho",
    };
  }
}

export async function deleteTrabalho(id: string) {
  try {
    // Buscar o trabalho antes de deletar para obter as imagens
    const trabalho = await prisma.trabalhos.findUnique({
      where: { id },
      select: { image: true },
    });

    if (!trabalho) {
      return { success: false, error: "Trabalho não encontrado" };
    }

    // Deletar do banco de dados
    await prisma.trabalhos.delete({
      where: { id },
    });

    // Deletar arquivos do storage se existirem
    if (trabalho.image && trabalho.image.length > 0) {
      try {
        const { deleteMultipleFilesFromStorage } = await import(
          "@/lib/supabase-cleanup"
        );
        await deleteMultipleFilesFromStorage(trabalho.image);
        // Arquivos removidos do storage
      } catch {
        // Limpeza falhou silenciosamente
      }
    }

    // Limpeza automática adicional após deletar trabalho
    try {
      const { cleanupOrphanedFiles } = await import("@/lib/supabase-cleanup");
      await cleanupOrphanedFiles(5); // Mais agressivo para deleção
    } catch {
      // Limpeza falhou silenciosamente
    }

    revalidatePath("/");
    revalidatePath("/admin/dashboard/trabalhos");

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Erro ao deletar trabalho",
    };
  }
}

export async function getAllTags() {
  try {
    const trabalhos = await prisma.trabalhos.findMany({
      select: { tags: true },
    });

    const allTags = trabalhos.flatMap((trabalho) => trabalho.tags);
    const uniqueTags = [...new Set(allTags)].sort();

    return { success: true, data: uniqueTags };
  } catch {
    return { success: false, error: "Erro ao buscar tags" };
  }
}
