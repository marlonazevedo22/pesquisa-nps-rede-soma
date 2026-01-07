# Rede Soma Av. Sete NPS Survey

Uma aplicação web fullstack para coletar feedback de clientes da Rede Soma Av. Sete usando Next.js, Tailwind CSS, TypeScript e Supabase.

## Funcionalidades

- **Home**: Tela de boas-vindas com pergunta NPS (0-10) e botões intuitivos.
- **Questionário**: 5 perguntas de satisfação com ratings emoji (1-5), formatação incremental de telefone e campos opcionais para nome e telefone.
- **Obrigado**: Página final com ícones maiores e links para Google e Instagram.
- **Dashboard Premium (/admin/dashboard)**:
  - Tema escuro premium com tooltips informativos.
  - Cards de métricas: Total Acessos, Total Respostas, NPS Geral, Médias das Perguntas.
  - Gráficos: Respostas por dia (barras) e Distribuição NPS agrupada (0-3: Ruim, 4-7: Bom, 8-10: Excelente) com legenda e labels de porcentagem.
  - Tabela completa de respostas com exportação visual.
  - Tooltips interativos em todos os cards e gráficos.
  - Acesso restrito via autenticação Supabase.

## Stack

- Next.js 16.1.1 (App Router)
- React 19
- Tailwind CSS
- TypeScript
- Supabase (banco de dados)
- Recharts (gráficos)
- react-tooltip (tooltips interativos)
- react-icons (ícones)

## Configuração

1. Instale as dependências: `npm install`
2. Configure o Supabase:
   - Crie um projeto no Supabase.
   - Execute o script em `schema.sql` para criar as tabelas.
   - Adicione as variáveis de ambiente em `.env.local`:
     ```
     NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```
3. Adicione o logo em `public/logo.png`.
4. Execute o servidor de desenvolvimento: `npm run dev`

## Esquema do Banco

- `acessos`: Registra acessos únicos (IP-based).
- `respostas`: Armazena NPS, ratings Q1-Q5, nome, telefone e duração.

## Desenvolvimento

- Tracking de visitantes únicos via localStorage e IP.
- Formatação de telefone incremental (XX) XXXXX-XXXX.
- Ratings com emojis para melhor UX.
- Dashboard responsivo com animações e tooltips escuros.
- Build otimizado com Next.js.

## Deploy no Vercel

1. **Conecte o repositório GitHub** no [Vercel](https://vercel.com).
2. **Configure variáveis de ambiente** no dashboard do Vercel:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - (opcional) `ADMIN_PASSWORD` (caso use proteção adicional)
3. **Deploy automático**: O Vercel fará o build e deploy automaticamente.
4. **Acesso ao Admin**: Use `?password=sua_senha` na URL ou header `Authorization: Bearer sua_senha` para /admin.

**Nota**: O middleware protege /admin com senha simples. Para produção, considere autenticação mais robusta.
