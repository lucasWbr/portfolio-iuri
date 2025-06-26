import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Cliente com Service Role (apenas para uso no servidor)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Configuração para storage de arquivos (usando Service Role)
export const uploadFile = async (
  file: File,
  bucket: string,
  fileName: string
) => {
  const { data, error } = await supabaseAdmin.storage
    .from(bucket)
    .upload(fileName, file);

  if (error) {
    throw error;
  }

  return data;
};

export const getFileUrl = (bucket: string, fileName: string) => {
  const { data } = supabaseAdmin.storage.from(bucket).getPublicUrl(fileName);

  return data.publicUrl;
};

export const deleteFile = async (bucket: string, fileName: string) => {
  const { data, error } = await supabaseAdmin.storage
    .from(bucket)
    .remove([fileName]);

  if (error) {
    throw error;
  }

  return data;
};
