# Entidade: Tarefa

## Modelagem

**Tabela:** `tasks`

| Coluna           | Tipo                    | Restrições                              | Descrição                              |
| ---------------- | ----------------------- | --------------------------------------- | -------------------------------------- |
| `id`             | `uuid`                  | PK, DEFAULT gen_random_uuid()           | Identificador único da tarefa          |
| `title`          | `text`                  | NOT NULL                                | Título da tarefa (máx. 72 chars no app)|
| `description`    | `text`                  | NULL                                    | Descrição opcional                     |
| `due_date_start` | `timestamp`             | NULL                                    | Início do prazo (opcional)             |
| `due_date_end`   | `timestamp`             | NULL                                    | Fim do prazo (opcional)                |
| `status`         | `todo_status` (enum PG) | DEFAULT `'to-do'`                       | Estado da tarefa                       |
| `create_at`      | `timestamp`             | DEFAULT now()                           | Data de criação                        |
| `user_id`        | `serial`                | FK → `users.id` CASCADE DELETE          | Usuário dono da tarefa                 |

**Enum `todo_status`** (definido no banco):
- `"to-do"` — pendente
- `"in-progress"` — em andamento (estado previsto para futura expansão de funcionalidade)
- `"done"` — concluída

**Relacionamentos:**
- Pertence a um **usuário** (`tasks.user_id → users.id`).
- CASCADE DELETE: ao remover o usuário todas as suas tarefas são removidas.

O uso de um enum PostgreSQL em vez de `text` livre garante que nenhum valor inválido de status seja persistido sem checagem adicional no código.

---

## Rotas relevantes

Todas as rotas de tarefa requerem autenticação via middleware `authorizeUser`.

### `GET /tasks/`
Lista as tarefas do usuário autenticado com filtragem opcional.

- **Query params (Zod):**
  - `search` (string, opcional) — filtra por título ou descrição (`ILIKE %termo%`)
  - `status` (enum, opcional) — filtra pelo status da tarefa
- **Lógica:** usa `and()` do Drizzle para combinar `userId = req.user.id` com os filtros opcionais.
- **Resposta:** `200 TasksSelect[]`

### `GET /tasks/:id`
Retorna uma tarefa específica do usuário.

- **Validação:** `id` deve ser UUID válido.
- **Lógica:** filtra por `id` AND `userId` — impede acesso a tarefas de outros usuários.
- **Resposta:** `200 TasksSelect` ou `404` se não encontrada/não pertence ao usuário.

### `POST /tasks/`
Cria uma nova tarefa para o usuário autenticado.

- **Validação (Zod):**
  - `title`: string, máx. 72 caracteres
  - `description`: string opcional
  - `dueDateStart` / `dueDateEnd`: `z.coerce.date()` — aceita ISO string e converte para Date
  - `status`: enum obrigatório
- **Lógica:** anexa `userId = req.user.id` ao payload antes de inserir.
- **Resposta:** `201 TasksSelect[]`

### `PATCH /tasks/:id`
Atualiza campos de uma tarefa existente (update parcial).

- **Validação:** todos os campos do body são opcionais; `dueDateStart`/`End` aceitam `null` para limpar o prazo.
- **Lógica:** filtra por `id` AND `userId`, impede edição de tarefas de outros usuários.
- **Resposta:** `200 TasksSelect` ou `404`.

### `DELETE /tasks/:id`
Remove uma tarefa.

- **Lógica:** filtra por `id` AND `userId`.
- **Resposta:** `200 { message: "task deleted" }` ou `404`.

---

## Funções principais

Todas em `src/backend/http/features/tasks/task.service.ts`.

### `TASK_SERVICE.queryTasks(userId, query?, status?)`
Retorna tarefas do usuário com filtros combinados via `and()` do Drizzle.

### `TASK_SERVICE.queryById(userId, id)`
Busca uma tarefa específica garantindo que pertença ao `userId`.

### `TASK_SERVICE.postTask(values)`
Insere uma nova tarefa com os valores validados + `userId` do usuário autenticado.

### `TASK_SERVICE.updateTask(userId, id, values)`
Atualiza campos fornecidos (`.set(values)`) com guard de `userId`.

### `TASK_SERVICE.deleteTask(userId, id)`
Remove a tarefa com guard de `userId`.

---

## Segurança aplicada

- **Isolamento por usuário:** todas as queries incluem `eq(TasksTable.userId, userId)` — um usuário nunca lê, edita ou deleta tarefas de outro, mesmo conhecendo o UUID.
- **Validação de input:** Zod valida e coerce os tipos antes de qualquer acesso ao banco, prevenindo dados malformados.
- **Proteção de rotas:** o middleware `authorizeUser` bloqueia qualquer requisição sem sessão válida antes de chegar ao handler.
- **Proteção contra SQL Injection:** o Drizzle ORM usa queries parametrizadas — não há interpolação de strings diretamente no SQL.
