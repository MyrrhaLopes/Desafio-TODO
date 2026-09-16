import { useQuery } from "@tanstack/react-query";
import { fetchTaskById } from "../api/tasks";

export default function useGetTaskById(id: string) {
  return useQuery({
    queryKey: ["tasks", id],
    queryFn: () => fetchTaskById(id),
    enabled: !!id,
  });
}
