import { createClient } from "@supabase/supabase-js";

// Este arquivo deve ser usado apenas no servidor
if (typeof window !== "undefined") {
  throw new Error("supabase-cleanup.ts deve ser usado apenas no servidor");
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseServiceKey) {
  throw new Error("SUPABASE_SERVICE_ROLE_KEY é obrigatória");
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

/**
 * Extrai o caminho do arquivo de uma URL pública do Supabase
 */
export function extractFilePathFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split("/");

    // Formato: /storage/v1/object/public/bucket-name/path/to/file
    const bucketIndex = pathParts.findIndex((part) => part === "public") + 1;
    if (bucketIndex <= 0 || bucketIndex >= pathParts.length) {
      return null;
    }

    // Remove bucket name e reconstrói o caminho
    const filePath = pathParts.slice(bucketIndex + 1).join("/");
    return filePath || null;
  } catch (error) {
    console.error("Erro ao extrair caminho do arquivo:", error);
    return null;
  }
}

/**
 * Deleta um arquivo específico do Supabase Storage
 */
export async function deleteFileFromStorage(
  fileUrl: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const filePath = extractFilePathFromUrl(fileUrl);
    if (!filePath) {
      return { success: false, error: "Caminho do arquivo inválido" };
    }

    const { error } = await supabaseAdmin.storage
      .from("portfolio-iuri")
      .remove([filePath]);

    if (error) {
      console.error("Erro ao deletar arquivo:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Erro inesperado ao deletar arquivo:", error);
    return { success: false, error: "Erro inesperado" };
  }
}

/**
 * Deleta múltiplos arquivos do Supabase Storage
 */
export async function deleteMultipleFilesFromStorage(
  fileUrls: string[]
): Promise<{
  success: boolean;
  deletedCount: number;
  errors: string[];
}> {
  const filePaths: string[] = [];
  const errors: string[] = [];

  // Extrair caminhos válidos
  for (const url of fileUrls) {
    const path = extractFilePathFromUrl(url);
    if (path) {
      filePaths.push(path);
    } else {
      errors.push(`URL inválida: ${url}`);
    }
  }

  if (filePaths.length === 0) {
    return { success: false, deletedCount: 0, errors };
  }

  try {
    const { error } = await supabaseAdmin.storage
      .from("portfolio-iuri")
      .remove(filePaths);

    if (error) {
      console.error("Erro ao deletar arquivos:", error);
      errors.push(error.message);
      return { success: false, deletedCount: 0, errors };
    }

    return { success: true, deletedCount: filePaths.length, errors };
  } catch (error) {
    console.error("Erro inesperado ao deletar arquivos:", error);
    errors.push("Erro inesperado");
    return { success: false, deletedCount: 0, errors };
  }
}

/**
 * Identifica arquivos que não estão sendo referenciados no banco de dados
 */
export async function findOrphanedFiles(): Promise<{
  success: boolean;
  orphanedFiles: string[];
  error?: string;
}> {
  try {
    // Lista todos os arquivos no storage
    const { data: files, error: storageError } = await supabaseAdmin.storage
      .from("portfolio-iuri")
      .list("", {
        limit: 1000,
        sortBy: { column: "created_at", order: "desc" },
      });

    if (storageError) {
      return { success: false, orphanedFiles: [], error: storageError.message };
    }

    // Lista todos os arquivos recursivamente
    const allFiles: string[] = [];
    const listFilesRecursively = async (path: string = "") => {
      const { data: folderFiles } = await supabaseAdmin.storage
        .from("portfolio-iuri")
        .list(path, { limit: 1000 });

      if (folderFiles) {
        for (const file of folderFiles) {
          const fullPath = path ? `${path}/${file.name}` : file.name;
          if (file.metadata && file.metadata.size > 0) {
            // É um arquivo
            allFiles.push(fullPath);
          } else {
            // É uma pasta, busca recursivamente
            await listFilesRecursively(fullPath);
          }
        }
      }
    };

    await listFilesRecursively();

    // Busca todas as URLs de imagens no banco de dados
    const { prisma } = await import("./prisma");
    const trabalhos = await prisma.trabalhos.findMany({
      select: { image: true },
    });

    const usedFiles = new Set<string>();
    trabalhos.forEach((trabalho) => {
      trabalho.image.forEach((url) => {
        const path = extractFilePathFromUrl(url);
        if (path) {
          usedFiles.add(path);
        }
      });
    });

    // Identifica arquivos órfãos
    const orphanedFiles = allFiles.filter((file) => !usedFiles.has(file));

    return { success: true, orphanedFiles };
  } catch (error) {
    console.error("Erro ao buscar arquivos órfãos:", error);
    return { success: false, orphanedFiles: [], error: "Erro inesperado" };
  }
}
