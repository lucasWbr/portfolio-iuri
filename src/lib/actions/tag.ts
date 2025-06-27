"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export interface CreateTagData {
  name: string;
  description?: string;
  isActive?: boolean;
  showInMenu?: boolean;
}

export interface UpdateTagData {
  name?: string;
  description?: string;
  isActive?: boolean;
  showInMenu?: boolean;
}

export async function createTag(data: CreateTagData) {
  try {
    // Verificar se tag já existe
    const existingTag = await prisma.tags.findUnique({
      where: { name: data.name },
    });

    if (existingTag) {
      return { success: false, error: "Tag já existe" };
    }

    const tag = await prisma.tags.create({
      data: {
        name: data.name,
        description: data.description || null,
        isActive: data.isActive ?? true,
        showInMenu: data.showInMenu ?? true,
      },
    });

    revalidatePath("/admin/dashboard/tags");
    revalidatePath("/");
    return { success: true, data: tag };
  } catch {
    return { success: false, error: "Erro ao criar tag" };
  }
}

export async function updateTag(id: string, data: UpdateTagData) {
  try {
    // Se está alterando o nome, verificar se já existe
    if (data.name) {
      const existingTag = await prisma.tags.findFirst({
        where: {
          name: data.name,
          NOT: { id: id },
        },
      });

      if (existingTag) {
        return { success: false, error: "Já existe uma tag com esse nome" };
      }
    }

    const tag = await prisma.tags.update({
      where: { id },
      data,
    });

    revalidatePath("/admin/dashboard/tags");
    revalidatePath("/");
    return { success: true, data: tag };
  } catch {
    return { success: false, error: "Erro ao atualizar tag" };
  }
}

export async function deleteTag(id: string) {
  try {
    // Verificar se a tag está sendo usada em algum trabalho
    const tagToDelete = await prisma.tags.findUnique({
      where: { id },
    });

    if (!tagToDelete) {
      return { success: false, error: "Tag não encontrada" };
    }

    const trabalhosComTag = await prisma.trabalhos.count({
      where: {
        tags: {
          has: tagToDelete.name,
        },
      },
    });

    if (trabalhosComTag > 0) {
      return {
        success: false,
        error: `Não é possível deletar. Esta tag está sendo usada em ${trabalhosComTag} trabalho(s)`,
      };
    }

    await prisma.tags.delete({
      where: { id },
    });

    revalidatePath("/admin/dashboard/tags");
    revalidatePath("/");
    return { success: true };
  } catch {
    return { success: false, error: "Erro ao deletar tag" };
  }
}

export async function getTags() {
  try {
    const tags = await prisma.tags.findMany({
      orderBy: { name: "asc" },
    });
    return { success: true, data: tags };
  } catch {
    return { success: false, error: "Erro ao buscar tags" };
  }
}

export async function getActiveTags() {
  try {
    const tags = await prisma.tags.findMany({
      where: {
        isActive: true,
        showInMenu: true,
      },
      orderBy: { name: "asc" },
    });
    return { success: true, data: tags };
  } catch {
    return { success: false, error: "Erro ao buscar tags ativas" };
  }
}

export async function getTagUsageCount(tagName: string) {
  try {
    const count = await prisma.trabalhos.count({
      where: {
        tags: {
          has: tagName,
        },
      },
    });
    return { success: true, data: count };
  } catch {
    return { success: false, error: "Erro ao contar uso da tag" };
  }
}
