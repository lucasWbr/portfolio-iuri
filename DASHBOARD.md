# Dashboard Administrativo - Portfólio

Este documento descreve como usar o dashboard administrativo do sistema de portfólio.

## 🚀 Acesso ao Dashboard

1. **Login**: Acesse `/admin/login` para fazer login
2. **Dashboard**: Após o login, você será redirecionado para `/admin/dashboard`

## 📱 Navegação

O dashboard possui um menu lateral com as seguintes seções:

- **Configurações**: Configurações gerais do site (cores, fontes, informações pessoais)
- **Bio**: Gerenciar informações pessoais e redes sociais
- **Trabalhos**: Listar e gerenciar trabalhos do portfólio
- **Novo Trabalho**: Adicionar novos trabalhos

## ⚙️ Configurações

### Informações Básicas

- **Nome do Artista**: Seu nome que aparecerá no site
- **Descrição**: Texto sobre você e seu trabalho

### Redes Sociais

Configure os links para suas redes sociais:

- Behance
- LinkedIn
- Facebook
- Instagram

### Aparência

- **Fonte**: Escolha entre 6 fontes disponíveis
- **Cores**: Configure as cores do:
  - Header
  - Fundo da página inicial
  - Fundo da seção de trabalhos

## 🎨 Gerenciamento de Trabalhos

### Criando um Novo Trabalho

1. Clique em "Novo Trabalho" no menu ou botão na lista de trabalhos
2. Preencha as informações:
   - **Nome**: Título do trabalho
   - **Descrição**: (Opcional) Descrição detalhada
   - **Tipo**: Escolha entre Imagem, GIF ou YouTube
   - **Tags**: Adicione tags para categorização

### Tipos de Trabalho

#### 📸 Imagem

- Upload de múltiplas imagens (até 10)
- Formatos aceitos: JPEG, PNG, WebP
- Tamanho máximo: 10MB por arquivo

#### 🎞️ GIF

- Upload de GIFs (até 3)
- Formato aceito: GIF
- Tamanho máximo: 10MB por arquivo

#### 📺 YouTube

- Insira a URL do vídeo do YouTube
- Formato: `https://www.youtube.com/watch?v=...`

### Upload de Arquivos

O sistema de upload possui duas formas:

1. **Drag & Drop**: Arraste arquivos para a área de upload
2. **Seleção Manual**: Clique em "clique para selecionar"

**Recursos do Upload:**

- Preview em tempo real
- Validação de tipo e tamanho
- Feedback visual durante o upload
- Remoção individual de arquivos

### Tags

- **Adicionar**: Digite uma nova tag e pressione Enter ou clique no botão "+"
- **Tags Existentes**: Clique nas tags disponíveis para adicioná-las
- **Remover**: Clique no "X" ao lado da tag selecionada

### Editando Trabalhos

1. Na lista de trabalhos, clique em "Editar" no trabalho desejado
2. Modifique as informações necessárias
3. Clique em "Atualizar Trabalho"

### Deletando Trabalhos

1. Na lista de trabalhos, clique em "Deletar"
2. Confirme a ação na caixa de diálogo

⚠️ **Atenção**: A exclusão é permanente e não pode ser desfeita.

## 🔄 Sincronização

Todas as alterações são aplicadas automaticamente ao site público:

- **Configurações**: Alteram cores, fontes e layout imediatamente
- **Bio**: Atualiza a página `/bio`
- **Trabalhos**: Aparecem na página inicial e em `/trabalho/[id]`

## 📱 Responsividade

O dashboard é totalmente responsivo:

- **Desktop**: Sidebar fixa
- **Mobile**: Sidebar colapsível com overlay
- **Navegação**: Adaptada para touch

## 🔒 Segurança

- Autenticação via Clerk
- Rotas protegidas por middleware
- Validação de dados com Zod
- Upload seguro para Supabase Storage

## 🚨 Problemas Comuns

### Upload não funciona

- Verifique se o arquivo está dentro do limite de tamanho (10MB)
- Confirme se o formato é suportado
- Verifique sua conexão com a internet

### Erro ao salvar

- Verifique se todos os campos obrigatórios estão preenchidos
- Para trabalhos de YouTube, confirme se a URL está correta
- Para trabalhos com imagens, certifique-se de que pelo menos uma imagem foi enviada

### Layout não atualiza

- As mudanças de configuração podem levar alguns segundos para serem aplicadas
- Atualize a página se necessário

## 💡 Dicas

1. **Tags**: Use tags consistentes para facilitar a organização
2. **Imagens**: Use imagens de alta qualidade para melhor apresentação
3. **Descrições**: Adicione descrições para melhorar o SEO
4. **Cores**: Teste as combinações de cores em diferentes dispositivos

## 🔧 Suporte Técnico

Em caso de problemas, verifique:

1. Console do navegador para erros JavaScript
2. Conectividade com a internet
3. Status do Supabase Storage
4. Logs do Clerk para problemas de autenticação

---

**Versão do Dashboard**: 1.0.0
**Última Atualização**: Janeiro 2025
