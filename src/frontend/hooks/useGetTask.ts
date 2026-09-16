import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import { fetchTasks } from "../api/tasks";
import type { tasksQuerySchemaType } from "@/backend/http/features/tasks/task.schema";

type UseGetTaskParams = Omit<tasksQuerySchemaType, "status"> & { status?: tasksQuerySchemaType["status"] | "all" };

export default function useGetTask({ status, search }: UseGetTaskParams) {
  const { data: user } = useAuth()
  return useQuery({
    queryKey: ['tasks', user?.userId, status, search],
    queryFn: () => fetchTasks({
      status: status === "all" ? undefined : status,
      search,
    }),
    enabled: !!user?.id,
  })
}
