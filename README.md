# Todos
- [x] Definir páginas principais com filtros de url
- [/] Definir estrutura ideal de componentes react
- [x] Definir hooks com querys com cache
- [x] Definir rotas e serviço de login
- [x] Definir middleware de autenticação com cookie sessions
- [x] Definir proteção de rotas do front e tratamentos de erros de estado do servidor
- [x] Terminar rotas de CRUD de tarefas

# Descrição geral
## Objetivo do projeto
O projeto tem como objetivo oferecer uma interface simplificada mas moderna para cadastro e controle de tarefas to-do, com autenticação e autorização de usuário.

## Tecnologias utilizadas:
- React: Frontend declarativo
- ShadCN: biblioteca de componentes com suporte ao teclado e estilo padronizado
- Postgres: banco de dados relacional
- Drizzle: ORM (facilitar migrations, declaração de schema da db em typescript com tipagem automática),
- Express: criação de rotas e middlewares,
- Zod: validação com conversão de atributos de payload de requisição,
- Tanstack Router: Roteamento de front-end para visualizações baseada em url e proteção de de páginas,
- Tanstack Query: caching e revalidação inteligentes pro front-end,

# Passo-a-passo para instalar e rodar localmente:
REQUISITOS:
- ter o psql (PostgreSQL) 18.4 instalado;
- ter o node v22.23.1 instalado

1. instale os pacotes necessários rodando:
`npm install`

2 Configure as seguintes variáveis de ambiente em `.env` na raiz do projeto:
`DATABASE_URL=postgresql://{usuario}:{senha}@localhost:5432/{nome_do_banco}`
substitua os valores em chaves pelos valores correspondentes

3 Suba o schema da base de dados (garanta que o psql esteja rodando):
`npx drizzle-kit push`

4 Rode o servidor backend com: `npx run dev-backend`

5 Rode a interface web com `npx run dev`

# Estrutura de pastas:

O projeto utiliza uma estrutura monorepo com frontend e backend dentro da mesma pasta `src/`:

```
src/
├── main.tsx                  # Ponto de entrada da aplicação React
├── App.tsx                   # Componente raiz que inicializa o Tanstack Router
├── index.css                 # Estilos globais (Tailwind CSS)
│
├── backend/
│   ├── server.ts             # Inicializa e sobe o servidor HTTP (Express)
│   ├── app.ts                # Configura o app Express: middlewares, rotas e error handler
│   │
│   ├── db/
│   │   ├── drizzle.ts        # Conexão com o banco de dados via Drizzle ORM
│   │   ├── schema.ts         # Definição das tabelas (users, tasks e sessions) com Drizzle
│   │   └── migrations/       # Arquivos SQL gerados automaticamente pelo Drizzle Kit
│   │
│   └── http/
│       ├── features/         # Organização por feature/domínio
│       │   ├── tasks/
│       │   │   ├── task.route.ts    # Rotas HTTP do CRUD de tarefas
│       │   │   ├── task.schema.ts   # Schemas Zod de validação dos payloads de tarefas
│       │   │   └── task.service.ts  # Lógica de negócio e queries de tarefas no banco
│       │   └── users/
│       │       ├── user.route.ts    # Rotas HTTP de cadastro e login de usuários
│       │       ├── user.schema.ts   # Schemas Zod de validação dos payloads de usuários
│       │       └── user.service.ts  # Lógica de negócio de usuários (hash de senha, autenticação)
│       │
│       └── middleware/
│           ├── authorizeUser.ts            # Middleware que valida o cookie de sessão e protege rotas
│           └── errorHandler.middleware.ts  # Handler global de erros do Express
│
├── frontend/
│   ├── router.ts             # Configuração das rotas do Tanstack Router
│   ├── rootRoute.tsx         # Rota raiz: layout base e verificação de autenticação
│   │
│   ├── api/                  # Funções de chamada HTTP ao backend (fetch wrappers)
│   │   ├── tasks.ts          # Chamadas de API para o CRUD de tarefas
│   │   └── users.ts          # Chamadas de API para login e cadastro de usuários
│   │
│   ├── components/
│   │   ├── task/             # Componentes de domínio de tarefas
│   │   │   ├── TaskView.tsx        # Componente principal que exibe a lista de tarefas
│   │   │   ├── TaskGroup.tsx       # Agrupa tarefas por status (pendentes/concluídas)
│   │   │   ├── TaskCard.tsx        # Card individual de uma tarefa com ações
│   │   │   ├── NewTaskFormBar.tsx  # Barra com formulário para criação de nova tarefa
│   │   │   ├── OptionsBar.tsx      # Barra de opções de filtro e ordenação
│   │   │   ├── OptionsSection.tsx  # Seção expansível de opções da barra
│   │   │   └── task-options.ts     # Constantes de configuração das opções de filtro/ordenação
│   │   │
│   │   └── ui/               # Componentes de UI genéricos (shadcn/ui), sem lógica de domínio
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── checkbox.tsx
│   │       ├── dropdown-menu.tsx
│   │       ├── input.tsx
│   │       └── label.tsx
│   │
│   ├── hooks/                # Hooks React que encapsulam queries e mutações do Tanstack Query
│   │   ├── useAuth.ts          # Hook de estado de autenticação do usuário
│   │   ├── useGetTask.ts       # Hook de busca das tarefas do usuário (com cache)
│   │   ├── usePostTask.ts      # Hook de mutação para criação de tarefas
│   │   ├── useLoginUser.ts     # Hook de mutação para login
│   │   └── useRegisterUser.ts  # Hook de mutação para cadastro de usuário
│   │
│   ├── pages/                # Componentes de página (montados pelo router)
│   │   ├── HomePage.tsx      # Página principal com a lista de tarefas
│   │   ├── LoginPage.tsx     # Página de login
│   │   └── RegisterPage.tsx  # Página de cadastro
│   │
│   └── shared/
│       └── utils.ts          # Utilitários compartilhados (ex: helper `cn` para classes Tailwind)
│
└── types/
    └── express.d.ts          # Extensão de tipos do Express (ex: adiciona `user` ao objeto `Request`)
```

# Sobre o uso de inteligência Artificial
A IA foi utilizada como auxiliadora no processo de implementação de certas features, assim como auxiliar em debugar erros e considerar opções de implementações. A principal ferramenta de IA utilizada foi o claude-code e o AI Mode da Google para buscas rápidas. Alguns casos de uso:
- Ajudou a familiarizar-me com as frameworks e bibliotecas utilizadas através da aplicação, respondendo dúvidas pontuais
- Ajudou a construir, de forma guiada, os componentes e páginas do Frontend da aplicação a partir do Design feito a mão no Figma
- Ajudou a escrever partes do README
- Implementou componentes React responsivos
- Implementou rotas e services específicos

# Desafio Fullstack – Plataforma de Tarefas (To-Do List)
## Objetivo
- Criar uma aplicação web completa que permita usuários se cadastrarem, autenticarem, e gerenciarem uma lista de tarefas.
- O desafio cobre banco de dados → backend → frontend, segurança básica, e deve ser entregue via GitHub.
- Javascript (Node+React)

## Requisitos Funcionais
### Banco de Dados
- Modelo de usuário:
	- Nome
	- Email (único)
	- Senha (hash seguro)
- Modelo de tarefa:
	- Título
	- Descrição
	- Status: pendente/concluída
- Usuário associado (relacionamento)

### Backend
- Endpoints/Rotas:
	- Cadastro de usuário
	- Login/autenticação (JWT ou sessão)
	- CRUD de tarefas (criar, listar, atualizar, deletar)
	- Rotas protegidas: cada usuário só acessa suas próprias tarefas

- Boas práticas:
	- Hash de senha
	- Validação de input
	- Proteção contra injeção de SQL/XSS
	- Tratamento de erros e respostas claras

### Frontend
- Tela de login e cadastro
- Tela principal mostrando lista de tarefas do usuário
- Formulário para adicionar tarefas
- Botões para marcar como concluída ou deletar tarefas
- Atualização dinâmica da lista sem recarregar a página (AJAX ou React state)
- Extras (Opcional, mas valorizados)
	- Filtro de tarefas (todas, pendentes, concluídas)
	- Responsividade (mobile-friendly)
	- Boas práticas de segurança (hash de senha, validação de input, proteção contra XSS)

## Documentação Obrigatória do Código
No README o candidato deve incluir:
- Descrição Geral
	- Objetivo do projeto
	- Tecnologias utilizadas
- Estrutura de Pastas e Arquivos
  - Backend:
  - Frontend:
- Explicação do propósito de cada pasta/arquivo
- Modelagem do Banco de Dados
	- Diagramas ou descrição textual das tabelas e relacionamentos
- Funções Principais
	- Descrever principais funções/métodos de cada módulo
	- Explicar o que cada rota faz, quais validações realiza
- Segurança Aplicada
	- Hash de senhas
	- Proteção de rotas privadas
	- Validação de input
	- Tratamento de erros e mensagens

## Fluxo de Uso do Sistema
...
## Entrega no GitHub
O candidato deve entregar:
- Repositório público ou privado com link
- README contendo:
	- Instruções de instalação
	- Como rodar backend e frontend localmente
	- Tecnologias utilizadas
	- Explicação da arquitetura e fluxos
- Código completo funcionando
- Documentação do projeto conforme o item acima

## Critérios de Avaliação 
- Estrutura do código (limpeza, organização, boas práticas)
- Funcionalidade (todos os endpoints funcionando e frontend integrado)
- Segurança básica (hash de senhas, proteção de rotas, validação de input)
- UX/UI básica (frontend intuitivo, tarefas fáceis de gerenciar)
- Uso correto do GitHub (commits claros, README informativo)

| Critério                                   | Pontuação |
| ------------------------------------------ | --------- |
| Funcionalidade do backend                  | 20%       |
| Funcionalidade do frontend                 | 20%       |
| Integração fullstack (DB→Backend→Frontend) | 20%       |
| Boas práticas de código e organização      | 15%       |
| Segurança básica aplicada                  | 15%       |
| Documentação completa                      | 10%       |


> "**É permitido o uso de ferramentas de Inteligência Artificial (IA)** para auxiliar na solução do desafio. Entretanto, o(a) candidato(a) **deverá ser capaz de compreender, explicar e defender tecnicamente todo o trabalho entregue**. Caso utilize IA durante o desenvolvimento, **deverá informar na documentação (README) quais ferramentas foram utilizadas** e, de forma breve, o auxílio dessas ferramentas."


**⏳ Prazo:** 16 de setembro até às 17 horas enviara para o e-mail:

**Para:** cess.uff.pessoas@gmail.com


**CC:** rhaiany_souza@id.uff.br

