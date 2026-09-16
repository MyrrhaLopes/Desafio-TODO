import { createRoute, useNavigate, useParams } from "@tanstack/react-router";
import { rootRoute } from "../rootRoute";
import { useState, useEffect, useRef } from "react";
import { ChevronLeft, Clock, Trash2 } from "lucide-react";
import useGetTaskById from "../hooks/useGetTaskById";
import usePatchTask from "../hooks/usePatchTask";
import useDeleteTask from "../hooks/useDeleteTask";
import { cn } from "../shared/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/frontend/components/ui/dialog";

export const taskRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/tasks/$taskId",
  component: TaskPage,
});

function TaskPage() {
  const { taskId } = useParams({ from: "/tasks/$taskId" });
  const navigate = useNavigate();
  const { data: task, isLoading } = useGetTaskById(taskId);
  const { mutate: patch } = usePatchTask();
  const { mutate: remove } = useDeleteTask();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (task && !initializedRef.current) {
      initializedRef.current = true;
      setTitle(task.title);
      setDescription(task.description ?? "");
    }
  }, [task]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8f8f8]">
        <header className="h-12 bg-neutral-800" />
        <main className="mx-auto max-w-3xl px-6 py-8">
          <p className="text-sm text-neutral-400">Carregando...</p>
        </main>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="min-h-screen bg-[#f8f8f8]">
        <header className="h-12 bg-neutral-800" />
        <main className="mx-auto max-w-3xl px-6 py-8">
          <p className="text-sm text-neutral-400">Tarefa não encontrada.</p>
        </main>
      </div>
    );
  }

  const completed = task.status === "done";

  const handleSave = () => {
    patch(
      { id: taskId, values: { title, description: description || undefined } },
      { onSuccess: () => navigate({ to: "/" }) },
    );
  };

  const handleDelete = () => {
    remove(taskId, { onSuccess: () => navigate({ to: "/" }) });
  };

  const handleToggleComplete = () => {
    patch({
      id: taskId,
      values: { status: completed ? "to-do" : "done" },
    });
  };

  const formatDueDate = () => {
    if (!task.dueDateStart) return null;
    const d = new Date(task.dueDateStart);
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);

    const isTomorrow =
      d.getDate() === tomorrow.getDate() &&
      d.getMonth() === tomorrow.getMonth() &&
      d.getFullYear() === tomorrow.getFullYear();

    const isToday =
      d.getDate() === now.getDate() &&
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear();

    const timeStr = d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

    if (isToday) return `Hoje às ${timeStr}`;
    if (isTomorrow) return `Para amanhã às ${timeStr}`;
    return `${d.toLocaleDateString("pt-BR")} às ${timeStr}`;
  };

  const dueDateLabel = formatDueDate();

  return (
    <div className="min-h-screen bg-[#f8f8f8]">
      <header className="h-12 bg-neutral-800" />

      <main className="mx-auto max-w-3xl px-6 py-8 space-y-6">
        <button
          type="button"
          onClick={() => navigate({ to: "/" })}
          className="flex items-center justify-center w-9 h-9 rounded-full bg-neutral-800 text-white hover:bg-neutral-700 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="space-y-2">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <button
                type="button"
                onClick={handleToggleComplete}
                className={cn(
                  "w-6 h-6 shrink-0 rounded-sm border-2 flex items-center justify-center transition-colors",
                  completed
                    ? "bg-neutral-800 border-neutral-800"
                    : "bg-white border-neutral-400 hover:border-neutral-600",
                )}
              >
                {completed && (
                  <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>

              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="flex-1 min-w-0 text-2xl font-bold text-neutral-900 bg-transparent outline-none border-b border-neutral-300 focus:border-neutral-600 transition-colors pb-0.5"
              />
            </div>

            <div className="flex items-center gap-2 pl-9 sm:pl-0 shrink-0">
              <button
                type="button"
                onClick={handleSave}
                className="rounded-full bg-neutral-800 px-4 py-1.5 text-sm text-white hover:bg-neutral-700 transition-colors"
              >
                salvar
              </button>
              <button
                type="button"
                onClick={() => setConfirmOpen(true)}
                className="flex items-center gap-1.5 rounded-full bg-neutral-800 px-4 py-1.5 text-sm text-white hover:bg-red-600 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                excluir
              </button>
            </div>
          </div>

          {dueDateLabel && (
            <div className="flex items-center gap-2 pl-9">
              <span className="text-sm text-neutral-600">{dueDateLabel}</span>
              <button
                type="button"
                className="flex items-center gap-1 rounded-full border border-neutral-300 bg-white px-3 py-1 text-xs text-neutral-500 hover:bg-neutral-50 transition-colors"
              >
                <Clock className="w-3.5 h-3.5" />
                Mudar prazo
              </button>
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white px-4 py-3 min-h-64">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Adicionar descrição..."
            className="w-full h-full min-h-56 text-sm text-neutral-700 placeholder:text-neutral-400 bg-transparent outline-none resize-none leading-relaxed"
          />
        </div>
      </main>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Excluir tarefa</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir "{task.title}"? Essa ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <button
              type="button"
              onClick={() => setConfirmOpen(false)}
              className="rounded-full border border-neutral-300 px-4 py-1.5 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="rounded-full bg-red-600 px-4 py-1.5 text-sm text-white hover:bg-red-700 transition-colors"
            >
              Excluir
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
