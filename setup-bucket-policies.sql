-- =====================================================
-- POLÍTICAS DE ACESSO PARA BUCKET: portfolio-iuri
-- Execute este código no SQL Editor do Supabase
-- =====================================================

-- 1. POLÍTICA: Permitir visualizar/baixar arquivos (PÚBLICO)
-- Qualquer pessoa pode ver os arquivos
CREATE POLICY "Permitir visualização pública de arquivos"
ON storage.objects
FOR SELECT
USING (bucket_id = 'portfolio-iuri');

-- 2. POLÍTICA: Permitir upload de arquivos (PÚBLICO/AUTENTICADO)
-- Permite upload para usuários autenticados ou público (conforme necessário)
CREATE POLICY "Permitir upload de arquivos"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'portfolio-iuri' 
  AND (
    auth.role() = 'authenticated' OR 
    auth.role() = 'anon'
  )
);

-- 3. POLÍTICA: Permitir atualização de arquivos (AUTENTICADO)
-- Apenas usuários autenticados podem sobrescrever arquivos
CREATE POLICY "Permitir atualização de arquivos"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'portfolio-iuri' 
  AND auth.role() = 'authenticated'
)
WITH CHECK (
  bucket_id = 'portfolio-iuri' 
  AND auth.role() = 'authenticated'
);

-- 4. POLÍTICA: Permitir remoção de arquivos (AUTENTICADO)
-- Apenas usuários autenticados podem deletar arquivos
CREATE POLICY "Permitir remoção de arquivos"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'portfolio-iuri' 
  AND auth.role() = 'authenticated'
);

-- =====================================================
-- ALTERNATIVA MAIS RESTRITIVA (OPCIONAL)
-- Se quiser permitir upload apenas para admins específicos
-- =====================================================

-- Remover a política de upload anterior (se quiser usar esta)
-- DROP POLICY IF EXISTS "Permitir upload de arquivos" ON storage.objects;

-- Política mais restritiva para upload (apenas usuários autenticados)
-- CREATE POLICY "Permitir upload apenas para autenticados"
-- ON storage.objects
-- FOR INSERT
-- WITH CHECK (
--   bucket_id = 'portfolio-iuri' 
--   AND auth.role() = 'authenticated'
-- );

-- =====================================================
-- VERIFICAR POLÍTICAS CRIADAS
-- =====================================================

-- Consulta para verificar se as políticas foram criadas
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage'
ORDER BY policyname; 