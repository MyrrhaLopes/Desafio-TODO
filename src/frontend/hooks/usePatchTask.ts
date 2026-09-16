import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchTask } from "../api/tasks";
import type { PatchTaskBody } from "@/backend/http/features/tasks/task.schema";

export default function usePatchTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["tasks", "patch"],
    mutationFn: ({ id, values }: { id: string; values: PatchTaskBody }) =>
      patchTask(id, values),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.setQueryData(["tasks", updated.id], updated);
    },
  });
}
