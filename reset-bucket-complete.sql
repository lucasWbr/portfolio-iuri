-- =====================================================
-- RESET COMPLETO: LIMPAR E RECRIAR BUCKET
-- Use este script se o bucket já existir ou der erro
-- =====================================================

-- PRIMEIRO: Remover políticas existentes (se houver)
DROP POLICY IF EXISTS "Permitir visualização pública de arquivos" ON storage.objects;
DROP POLICY IF EXISTS "Permitir upload de arquivos" ON storage.objects;
DROP POLICY IF EXISTS "Permitir atualização de arquivos" ON storage.objects;
DROP POLICY IF EXISTS "Permitir remoção de arquivos" ON storage.objects;
DROP POLICY IF EXISTS "Acesso público total ao portfolio-iuri" ON storage.objects;

-- SEGUNDO: Remover todos os arquivos do bucket (se existir)
DELETE FROM storage.objects WHERE bucket_id = 'portfolio-iuri';

-- TERCEIRO: Remover o bucket (se existir)
DELETE FROM storage.buckets WHERE id = 'portfolio-iuri';

-- QUARTO: Recriar o bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'portfolio-iuri',
  'portfolio-iuri', 
  true,                    -- público
  10485760,               -- 10MB (em bytes)
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']  -- tipos permitidos
);

-- QUINTO: Recriar as políticas

-- 1. Permitir visualização pública
CREATE POLICY "Permitir visualização pública de arquivos"
ON storage.objects
FOR SELECT
USING (bucket_id = 'portfolio-iuri');

-- 2. Permitir upload público (para desenvolvimento)
CREATE POLICY "Permitir upload de arquivos"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'portfolio-iuri');

-- 3. Permitir atualização
CREATE POLICY "Permitir atualização de arquivos"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'portfolio-iuri')
WITH CHECK (bucket_id = 'portfolio-iuri');

-- 4. Permitir remoção
CREATE POLICY "Permitir remoção de arquivos"
ON storage.objects
FOR DELETE
USING (bucket_id = 'portfolio-iuri');

-- =====================================================
-- VERIFICAR RESULTADO FINAL
-- =====================================================

-- Verificar bucket
SELECT 
  id, 
  name, 
  public, 
  file_size_limit, 
  allowed_mime_types,
  created_at
FROM storage.buckets 
WHERE id = 'portfolio-iuri';

-- Verificar políticas
SELECT 
  policyname,
  cmd
FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage'
AND (policyname LIKE '%portfolio-iuri%' OR qual LIKE '%portfolio-iuri%')
ORDER BY policyname;

-- =====================================================
-- SUCESSO! Agora execute: node test-supabase.js
-- ===================================================== 