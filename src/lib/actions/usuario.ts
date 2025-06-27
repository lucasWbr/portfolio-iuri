"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { usuarioSchema, type UsuarioFormData } from "@/lib/validations/usuario";

export async function getUsuario() {
  try {
    const usuario = await prisma.usuario.findFirst();
    return { success: true, data: usuario };
  } catch {
    return { success: false, error: "Erro ao buscar dados do usuário" };
  }
}

export async function updateUsuario(data: UsuarioFormData) {
  try {
    // Validar dados
    const validatedData = usuarioSchema.parse(data);

    // Buscar usuário existente
    const existingUser = await prisma.usuario.findFirst();

    // Capturar foto antiga para possível limpeza
    const oldFotoBio = existingUser?.fotoBio;

    let usuario;
    if (existingUser) {
      // Atualizar usuário existente
      usuario = await prisma.usuario.update({
        where: { id: existingUser.id },
        data: validatedData,
      });
    } else {
      // Criar novo usuário
      usuario = await prisma.usuario.create({
        data: validatedData,
      });
    }

    // Limpeza automática: remover foto antiga se foi alterada
    if (oldFotoBio && oldFotoBio !== validatedData.fotoBio) {
      try {
        const { safeDeleteFile } = await import("@/lib/supabase-cleanup");
        await safeDeleteFile(oldFotoBio);
      } catch {
        // Não falha a operação principal se a limpeza falhar
      }
    }

    // Limpeza geral de arquivos órfãos (máximo 30 minutos)
    try {
      const { cleanupOrphanedFiles } = await import("@/lib/supabase-cleanup");
      await cleanupOrphanedFiles(30);
    } catch {
      // Limpeza falhou silenciosamente
    }

    revalidatePath("/");
    revalidatePath("/bio");
    revalidatePath("/admin/dashboard");

    return { success: true, data: usuario };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro ao salvar dados",
    };
  }
}
