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
  } catch (error) {
    console.error("Erro ao buscar trabalhos:", error);
    return { success: false, error: "Erro ao buscar trabalhos" };
  }
}

export async function getTrabalho(id: string) {
  try {
    const trabalho = await prisma.trabalhos.findUnique({
      where: { id },
    });
    return { success: true, data: trabalho };
  } catch (error) {
    console.error("Erro ao buscar trabalho:", error);
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

    revalidatePath("/");
    revalidatePath("/admin/dashboard/trabalhos");

    return { success: true, data: trabalho };
  } catch (error) {
    console.error("Erro ao criar trabalho:", error);
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
          const deleteResult = await deleteMultipleFilesFromStorage(
            removedFiles
          );
          if (deleteResult.success) {
            console.log(
              `${deleteResult.deletedCount} arquivo(s) removido(s) do storage`
            );
          } else {
            console.warn(
              "Alguns arquivos não puderam ser removidos do storage:",
              deleteResult.errors
            );
          }
        } catch (cleanupError) {
          console.warn("Erro na limpeza de arquivos:", cleanupError);
        }
      }
    }

    const trabalho = await prisma.trabalhos.update({
      where: { id },
      data: validatedData,
    });

    revalidatePath("/");
    revalidatePath("/admin/dashboard/trabalhos");
    revalidatePath(`/trabalho/${id}`);

    return { success: true, data: trabalho };
  } catch (error) {
    console.error("Erro ao atualizar trabalho:", error);
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
        const deleteResult = await deleteMultipleFilesFromStorage(
          trabalho.image
        );
        if (deleteResult.success) {
          console.log(
            `${deleteResult.deletedCount} arquivo(s) removido(s) do storage`
          );
        } else {
          console.warn(
            "Alguns arquivos não puderam ser removidos do storage:",
            deleteResult.errors
          );
        }
      } catch (cleanupError) {
        console.warn("Erro na limpeza de arquivos:", cleanupError);
      }
    }

    revalidatePath("/");
    revalidatePath("/admin/dashboard/trabalhos");

    return { success: true };
  } catch (error) {
    console.error("Erro ao deletar trabalho:", error);
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
  } catch (error) {
    console.error("Erro ao buscar tags:", error);
    return { success: false, error: "Erro ao buscar tags" };
  }
}
