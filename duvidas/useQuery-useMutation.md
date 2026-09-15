# useQuery vs useMutation

## useQuery

Usado para **buscar dados** (GET). Executa automaticamente quando o componente monta.

```ts
const { data, isPending, error } = useQuery({
  queryKey: ["tasks", { status: "open" }], // identificador único do cache
  queryFn: () => fetchTasks({ status: "open" }), // a função que busca os dados
});
```

**`queryKey`** é a peça mais importante. É um array que identifica aquela query no cache global. O TanStack usa ela para:
- Saber se já tem o dado em cache (evita refetch desnecessário)
- Saber quais queries invalidar quando um dado muda

A regra é: **tudo que muda o resultado da query entra na key.**

```ts
// query diferente pra cada status — caches separados
queryKey: ["tasks", { status }]

// query de um item específico
queryKey: ["tasks", taskId]
```

**O que retorna:**
- `data` — o resultado da `queryFn` quando resolvida
- `isPending` — `true` enquanto busca pela primeira vez
- `error` — o erro caso a `queryFn` rejeite

---

## useMutation

Usado para **ações que alteram dados** (POST, PUT, DELETE). Não executa sozinha — você chama `mutate()` quando quiser.

```ts
const { mutate, isPending, error } = useMutation({
  mutationFn: registerUser, // a função que faz a ação
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["tasks"] }); // invalida cache relacionado
  },
});

// em algum event handler:
mutate({ email, password });
```

Não tem `mutationKey` porque mutations não são cacheadas — cada chamada é independente.

**O que retorna:**
- `mutate(data)` — dispara a mutation com os dados
- `isPending` — `true` enquanto a requisição está em andamento
- `error` — o erro caso a função rejeite

**`onSuccess`** pode ir em dois lugares com comportamentos diferentes:

```ts
// 1. no useMutation — executa sempre, em qualquer chamada
useMutation({
  mutationFn: registerUser,
  onSuccess: () => navigate({ to: "/login" }),
});

// 2. no mutate — executa só nessa chamada específica
mutate(data, {
  onSuccess: () => navigate({ to: "/login" }),
});
```

---

## Resumo

```
useQuery                          useMutation
────────────────────────          ────────────────────────
executa ao montar                 executa ao chamar mutate()
tem queryKey (cache)              sem cache
GET                               POST / PUT / DELETE
data + isPending + error          mutate + isPending + error
```

A conexão entre os dois é o `queryClient.invalidateQueries()` dentro do `onSuccess` da mutation — é assim que você faz o TanStack refazer um `useQuery` depois que um dado foi alterado.
