import type {
  UserLoginInput,
  UserRegisterInput,
} from "@/backend/http/features/users/user.schema";

export async function registerUser(data: UserRegisterInput): Promise<void> {
  const res = await fetch("/api/v1/users/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (res.status === 409) throw new Error("Email já cadastrado");
  if (!res.ok) throw new Error("Erro ao criar conta");
}

export async function loginUser(data: UserLoginInput): Promise<void> {
  const res = await fetch("/api/v1/sessions/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (res.status === 401) throw new Error("Credenciais inválidas");
  if (!res.ok) throw new Error("Erro ao fazer login");
}
