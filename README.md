# Portfolio Artista

Um sistema completo de portfolio para artistas, desenvolvido com Next.js, TypeScript, Prisma, Supabase e Clerk.

## 🎨 Funcionalidades

### Frontend

- **Página Inicial**: Grid responsivo de trabalhos com navegação por tags
- **Bio**: Página dedicada com foto, descrição e links para redes sociais
- **Trabalhos**: Visualização detalhada de cada trabalho (imagens, vídeos, YouTube)
- **Filtro por Tags**: Navegação dinâmica através de categorias
- **Design Responsivo**: Interface moderna com Tailwind CSS e Shadcn/UI

### Backend & Administração

- **Dashboard Administrativo**: Painel protegido por autenticação
- **Gerenciamento de Trabalhos**: CRUD completo para portfólio
- **Upload de Arquivos**: Integração com Supabase Storage
- **Configurações Personalizáveis**: Cores, fontes e informações do perfil

## 🛠 Tecnologias

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Shadcn/UI
- **Backend**: Next.js API Routes, Prisma ORM
- **Banco de Dados**: Supabase (PostgreSQL)
- **Autenticação**: Clerk
- **Storage**: Supabase Storage
- **Ícones**: Lucide React

## 📋 Estrutura do Banco de Dados

### Tabela `trabalhos`

- `id`: Identificador único
- `name`: Nome do trabalho
- `text`: Descrição opcional
- `image`: Array de URLs das imagens/vídeos
- `tags`: Array de tags para categorização
- `type`: Tipo do trabalho (image, gif, youtube)

### Tabela `usuario`

- `id`: Identificador único
- `name`: Nome do artista
- `text`: Biografia
- `behance`, `linkedin`, `facebook`, `instagram`: Links das redes sociais
- `colorHeader`, `colorBackgroundIndex`, `colorBackgroundWorks`: Configurações de cores
- `font`: Fonte selecionada

## 🚀 Configuração

### 1. Instalação

```bash
npm install
```

### 2. Configuração do Ambiente

Copie `.env.example` para `.env` e configure:

```env
# Database
DATABASE_URL="sua_url_do_supabase"

# Supabase
NEXT_PUBLIC_SUPABASE_URL=sua_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima_supabase
SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=sua_chave_publica_clerk
CLERK_SECRET_KEY=sua_chave_secreta_clerk

# Clerk URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/admin/login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/admin/login
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/admin/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/admin/dashboard
```

### 3. Configuração do Banco

```bash
# Gerar cliente Prisma
npx prisma generate

# Executar migrações
npx prisma migrate dev
```

### 4. Desenvolvimento

```bash
npm run dev
```

## 📁 Estrutura do Projeto

```
src/
├── app/                    # App Router (Next.js 13+)
│   ├── page.tsx           # Página inicial
│   ├── bio/               # Página da biografia
│   ├── trabalho/[id]/     # Detalhes do trabalho
│   ├── tag/[tag]/         # Filtro por tag
│   └── admin/             # Painel administrativo
├── components/            # Componentes reutilizáveis
├── lib/                   # Configurações e utilitários
│   ├── prisma.ts         # Cliente Prisma
│   ├── supabase.ts       # Cliente Supabase
│   └── utils.ts          # Utilitários
└── types/                 # Definições TypeScript
```

## 🎯 Rotas

- `/` - Página inicial com todos os trabalhos
- `/bio` - Biografia do artista
- `/trabalho/[id]` - Visualização de trabalho específico
- `/tag/[tag]` - Trabalhos filtrados por tag
- `/admin/login` - Login administrativo
- `/admin/dashboard` - Painel administrativo

## 🔧 Configuração dos Serviços

### Supabase

1. Crie um projeto no [Supabase](https://supabase.com)
2. Configure o banco de dados com as tabelas do schema Prisma
3. Crie um bucket para storage de arquivos
4. Configure as chaves de API no `.env`

### Clerk

1. Crie uma conta no [Clerk](https://clerk.com)
2. Configure um novo aplicativo
3. Configure as URLs de redirecionamento
4. Adicione as chaves no `.env`

## 📱 Responsividade

O projeto foi desenvolvido mobile-first com breakpoints:

- `sm`: 640px+
- `md`: 768px+
- `lg`: 1024px+
- `xl`: 1280px+

## 🎨 Personalização

### Cores e Tema

- Configurável através do painel administrativo
- Suporte a cores personalizadas para header e backgrounds
- Integração com Tailwind CSS para consistência

### Fontes

- Suporte a múltiplas fontes via Google Fonts
- Seleção através do painel administrativo

## 📄 Licença

Este projeto está sob licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---

Desenvolvido com ❤️ para artistas que querem showcasing seus trabalhos de forma profissional.
