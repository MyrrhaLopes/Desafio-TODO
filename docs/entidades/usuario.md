# Entidade: Usuário

## Modelagem

**Tabela:** `users`

| Coluna          | Tipo        | Restrições              | Descrição                                  |
| --------------- | ----------- | ----------------------- | ------------------------------------------ |
| `id`            | `serial`    | PK, auto-incremental    | Identificador interno do usuário           |
| `email`         | `text`      | NOT NULL, UNIQUE        | Email de login; unicidade garantida no banco |
| `password_hash` | `text`      | NOT NULL                | Hash bcrypt da senha (nunca texto puro)    |
| `created_at`    | `timestamp` | DEFAULT now()           | Data de criação do registro                |

**Relacionamentos:**
- Um usuário possui zero ou mais **tarefas** (`tasks.user_id → users.id`, CASCADE DELETE).
- Um usuário possui zero ou mais **sessões** (`sessions.user_id → users.id`, CASCADE DELETE).

O CASCADE DELETE garante que ao remover um usuário todas as suas tarefas e sessões são apagadas automaticamente, sem necessidade de lógica extra no código.

---

## Rotas relevantes

### `POST /users/`
Cadastra um novo usuário.

- **Validação (Zod):** `email` (string, formato e-mail) e `password` (string).
- **Lógica:** verifica duplicidade de e-mail, gera hash bcrypt com fator 10 e insere na tabela.
- **Resposta:** `201 { id, email }` ou `409` se o e-mail já existir.
- **Arquivo:** `src/backend/http/features/users/user.route.ts`

### `DELETE /users/`
Exclui a conta do usuário autenticado e limpa o cookie de sessão.

- **Proteção:** requer cookie `session_id` válido (middleware `authorizeUser`).
- **Lógica:** deleta o registro em `users`; o CASCADE remove tarefas e sessões em cascata.
- **Resposta:** `204 No Content`.

---

## Funções principais

### `USER_SERVICE.registerUser(email, password)`
(`src/backend/http/features/users/user.service.ts`)

1. Verifica se o e-mail já existe na tabela `users`.
2. Gera `bcrypt.hash(password, 10)`.
3. Insere o usuário e retorna `{ id, email }`.

### `USER_SERVICE.deleteUser(userId)`
Remove o registro do usuário por `id`.

---

## Segurança aplicada

- **Hash de senha:** bcrypt com salt factor 10 — resistente a ataques de força bruta e rainbow tables.
- **Sem exposição do hash:** o campo `password_hash` nunca é retornado nas respostas da API.
- **Proteção de rota:** `DELETE /users/` exige sessão válida via middleware `authorizeUser`.
