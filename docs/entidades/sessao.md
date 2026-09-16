# Entidade: Sessão

## Modelagem

**Tabela:** `sessions`

| Coluna       | Tipo        | Restrições                              | Descrição                                     |
| ------------ | ----------- | --------------------------------------- | --------------------------------------------- |
| `id`         | `uuid`      | PK, DEFAULT gen_random_uuid()           | Token de sessão enviado ao browser via cookie |
| `user_id`    | `integer`   | NOT NULL, FK → `users.id` CASCADE DELETE| Usuário dono da sessão                        |
| `expires_at` | `timestamp` | NOT NULL, DEFAULT now() + 7 days        | Prazo de validade calculado pelo banco        |
| `created_at` | `timestamp` | NOT NULL, DEFAULT now()                 | Momento de criação da sessão                  |

**Relacionamentos:**
- Pertence a um **usuário** (`sessions.user_id → users.id`).
- CASCADE DELETE: ao remover o usuário, todas as suas sessões são removidas junto.

A expiração é definida diretamente no banco com `now() + interval '7 days'`, evitando dependência de lógica de data no backend.

---

## Rotas relevantes

### `POST /sessions/`
Autentica o usuário (login) e cria uma sessão.

- **Validação (Zod):** `email` e `password`.
- **Lógica:** compara a senha fornecida com o hash armazenado via `bcrypt.compare`; se válida, insere uma linha em `sessions` e devolve o `id` (UUID) no cookie.
- **Cookie:** `session_id` com flags `httpOnly`, `sameSite: lax`, `secure: true` — inacessível por JavaScript no browser.
- **Resposta:** `201` vazio (o token vai no cookie) ou `401` para credenciais inválidas.

### `GET /sessions/`
Verifica a sessão atual e retorna os dados do usuário autenticado.

- **Proteção:** middleware `authorizeUser`.
- **Resposta:** `200 { id, email, created_at }`.
- **Uso:** o frontend chama esta rota na inicialização para saber se o usuário está logado.

### `DELETE /sessions/`
Encerra a sessão (logout).

- **Proteção:** middleware `authorizeUser`.
- **Lógica:** remove a linha da tabela `sessions` e limpa o cookie `session_id`.
- **Resposta:** `204 No Content`.

---

## Middleware: `authorizeUser`
(`src/backend/http/middleware/authorizeUser.ts`)

Aplicado em todas as rotas protegidas. Fluxo:

1. Lê o cookie `session_id` da requisição.
2. Busca a sessão na tabela `sessions`.
3. Verifica se `expires_at > now()`.
4. Busca o usuário dono da sessão e o anexa em `req.user`.
5. Chama `next()` para prosseguir ou retorna `401` em qualquer falha.

---

## Funções principais

### `USER_SERVICE.loginUser(email, password)`
(`src/backend/http/features/users/user.service.ts`)

1. Busca o usuário pelo e-mail.
2. Compara a senha com `bcrypt.compare`.
3. Insere uma nova linha em `sessions` e retorna o `id` (UUID) da sessão.

### `USER_SERVICE.logoutUser(sessionId)`
Remove a sessão da tabela pelo UUID.

---

## Segurança aplicada

- **Cookie httpOnly:** o token de sessão não é acessível via `document.cookie` no JavaScript do browser, mitigando XSS.
- **Cookie sameSite: lax:** protege contra CSRF na maioria dos cenários de navegação cruzada.
- **Expiração server-side:** a validade é verificada no banco a cada requisição, não apenas no cliente.
- **Sem JWT:** a sessão é stateful — invalidar o registro na tabela encerra imediatamente o acesso, sem depender de expiração de token.
