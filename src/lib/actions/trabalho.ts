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

export async function updateTrabalho(id: string, data: TrabalhoFormData) {
  try {
    // Validar dados
    const validatedData = trabalhoSchema.parse(data);

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
    await prisma.trabalhos.delete({
      where: { id },
    });

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
