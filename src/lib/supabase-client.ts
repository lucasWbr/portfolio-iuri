import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Cliente com chave anônima (seguro para uso no client-side)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Validações de arquivo (pode ser usado no client)
export function validateFile(
  file: File,
  options: {
    maxSize?: number; // em MB
    allowedTypes?: string[];
  }
): { valid: boolean; error?: string } {
  const {
    maxSize = 10,
    allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"],
  } = options;

  // Verificar tamanho
  if (file.size > maxSize * 1024 * 1024) {
    return {
      valid: false,
      error: `Arquivo muito grande. Tamanho máximo: ${maxSize}MB`,
    };
  }

  // Verificar tipo
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Tipo de arquivo não permitido. Tipos aceitos: ${allowedTypes.join(
        ", "
      )}`,
    };
  }

  return { valid: true };
}
