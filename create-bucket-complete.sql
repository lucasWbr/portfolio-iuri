-- =====================================================
-- SCRIPT COMPLETO: CRIAR BUCKET + POLÍTICAS
-- Execute este código no SQL Editor do Supabase
-- =====================================================

-- PRIMEIRO: Criar o bucket portfolio-iuri
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'portfolio-iuri',
  'portfolio-iuri', 
  true,                    -- público
  10485760,               -- 10MB (em bytes)
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']  -- tipos permitidos
);

-- SEGUNDO: Aplicar as políticas de acesso

-- 1. Permitir visualização pública
CREATE POLICY "Permitir visualização pública de arquivos"
ON storage.objects
FOR SELECT
USING (bucket_id = 'portfolio-iuri');

-- 2. Permitir upload (público para desenvolvimento)
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
-- VERIFICAR SE TUDO FOI CRIADO
-- =====================================================

-- Verificar se o bucket foi criado
SELECT 
  id, 
  name, 
  public, 
  file_size_limit, 
  allowed_mime_types,
  created_at
FROM storage.buckets 
WHERE id = 'portfolio-iuri';

-- Verificar as políticas criadas
SELECT 
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage'
AND (policyname LIKE '%portfolio-iuri%' OR qual LIKE '%portfolio-iuri%')
ORDER BY policyname; 