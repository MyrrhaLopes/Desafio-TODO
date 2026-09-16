import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTask } from "../api/tasks";

export default function useDeleteTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["tasks", "delete"],
    mutationFn: (id: string) => deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}
