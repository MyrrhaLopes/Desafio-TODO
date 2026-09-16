import type { TasksSelect } from "@/backend/db/schema";
import type { PostTaskBody } from "@/backend/http/features/tasks/task.schema";

type FetchTasksParams = {
  status?: string;
  search?: string;
};

export async function fetchTasks(
  params: FetchTasksParams,
): Promise<TasksSelect[]> {
  const query = new URLSearchParams();
  if (params.status && params.status !== "all")
    query.set("status", params.status);
  if (params.search && params.search !== "*")
    query.set("search", params.search);

  const res = await fetch(`/api/v1/tasks?${query}`);
  if (!res.ok) throw new Error("Falha ao buscar tarefas");
  return res.json();
}

export async function postTask(values: PostTaskBody): Promise<TasksSelect[]> {
  const res = await fetch("api/v1/tasks/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });
  if (!res.ok) throw new Error("Falha ao criar a tarefa");
  return res.json();
}
