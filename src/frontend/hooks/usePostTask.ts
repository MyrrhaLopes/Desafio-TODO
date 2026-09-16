import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postTask } from "../api/tasks";

export default function usePostTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["tasks", "post"],
    mutationFn: postTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}
