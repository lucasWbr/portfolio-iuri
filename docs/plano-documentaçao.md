O projeto se trata de um site portfolio de um artista: 1. Design:
I. Página Inicial: Header apresentando na esquerda uma logo e a Direita um link para a página "Bio", abaixo do header um menu navegação dinâmico com links para as tags dos trabalhos fornecidos. No corpo da página todos os trabalhos representados por quadrados com uma imagem.
II. Bio: Uma foto do artista em formato circular ao lado do seu nome e abaixo um texto descrito. Abaixo do texto, ícones em formato circular para as páginas do artista de behance, linkedin, facebook, instagram.
III. Página das Tags: A página das tags deve mostrar no mesmo formato que a página inicial os trabalhos do artista porém apenas aqueles corresponde a sua tag
IV. Página Trabalhos: A página Trabalhos deve apresentar o título, abaixo do título o trabalho que pode ser um vídeo do youtube, uma imagem ou múltiplas imagens, um espaço para texto opcional.
V. Dashboard Admin Login: Página para login ao painel do admin. Restringindo o dashboard aos usuários que tem a senha.
VI. Dashboard Admin: Um Header permitindo que o usuário volte ao menu principal, um sidebar com as opções "Adicionar trabalho" ao lado de ícone, "Bio" e por default uma tela que mostre as configurações da página com um menu select para selecionar a fonte da página, um menu select para selecionar a cor do header e um menu select para selecionar a cor de fundo da página inicial e um para selecionar a cor de fundo dos trabalhos. No item "Bio" o usuário deve poder fazer o upload de uma foto, um input para escrever o texto e inputs de texto para cada uma das redes sociais supramencionadas. No item "Adicionar trabalho" o usuário deve encontrar primeiramente um menu select para determinar o tipo de trabalho, se o trabalho for imagem, devem transicionar para a tela as opções título, upload de imagem(possivelmente multiplas) e texto(opcional), se for gif, devem transicionar para a tela as opções título, upload de gif e texto(opcional) e se for youtube, devem transicionar para a tela as opções título, link e texto(opcional). Todas os tipos de trabalho devem contar com o input de texto "Tag" podendo ser adicionado ao mesmo trabalho mais de um tipo. 2. Backend:
I. Supabase: Servirá como database, será criado um bucket para armazenamento de arquivos, como imagens e gifs.
II. Prisma: fará a ligação entre o supabase e o projeto.
III. Clerk: api para a autenticação do usuário(ADMIN).
IV. Database formato:
_. Table Trabalhos: Id (criada automaticamente), name(string), text(string), image[](endereçoBucket), Tags[](string), type(string);
_. Table Usuário: Id (criada automaticamente), name(string), text(string), behance(string),linkedin(string),facebook(string),instagram(string), colorHeader(string),colorBackgroundIndex(string), colorBackgroundWorks(string). 3. Frontend:
I. NextJS: devendo ser utilizado tanto para o backend quanto para o frontend.
II. TailwindCSS
III. Shadcn/UI: usado para o design de componentes.
