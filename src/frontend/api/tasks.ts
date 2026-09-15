import type { TasksSelect } from "@/backend/db/schema";

type FetchTasksParams = {
  status?: string;
  search?: string;
};

export async function fetchTasks(params: FetchTasksParams): Promise<TasksSelect[]> {
  const query = new URLSearchParams();
  if (params.status && params.status !== "all") query.set("status", params.status);
  if (params.search && params.search !== "*") query.set("search", params.search);

  const res = await fetch(`/api/tasks?${query}`);
  if (!res.ok) throw new Error("Falha ao buscar tarefas");
  return res.json();
}
