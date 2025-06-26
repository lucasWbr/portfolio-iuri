"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { usuarioSchema, type UsuarioFormData } from "@/lib/validations/usuario";

export async function getUsuario() {
  try {
    const usuario = await prisma.usuario.findFirst();
    return { success: true, data: usuario };
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    return { success: false, error: "Erro ao buscar dados do usuário" };
  }
}

export async function updateUsuario(data: UsuarioFormData) {
  try {
    // Validar dados
    const validatedData = usuarioSchema.parse(data);

    // Buscar usuário existente
    const existingUser = await prisma.usuario.findFirst();

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

    revalidatePath("/");
    revalidatePath("/bio");
    revalidatePath("/admin/dashboard");

    return { success: true, data: usuario };
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro ao salvar dados",
    };
  }
}
