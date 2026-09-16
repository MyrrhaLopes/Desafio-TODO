import { cn } from "@/frontend/shared/utils";
import { useNavigate } from "@tanstack/react-router";
import usePatchTask from "@/frontend/hooks/usePatchTask";
import useDeleteTask from "@/frontend/hooks/useDeleteTask";
import { MoreVertical, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/frontend/components/ui/dialog";

interface TaskCardProps {
  id: string;
  title: string;
  description?: string;
  completed?: boolean;
  className?: string;
}

export function TaskCard({ id, title, description, completed = false, className }: TaskCardProps) {
  const navigate = useNavigate();
  const { mutate: patch } = usePatchTask();
  const { mutate: remove } = useDeleteTask();

  const [dropdownPos, setDropdownPos] = useState<{ x: number; y: number } | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    patch({ id, values: { status: completed ? "to-do" : "done" } });
  };

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (dropdownPos) {
      setDropdownPos(null);
      return;
    }
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setDropdownPos({ x: rect.left, y: rect.bottom + 4 });
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setDropdownPos({ x: e.clientX, y: e.clientY });
  };

  const handleDiscard = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDropdownPos(null);
    setConfirmOpen(true);
  };

  const handleDelete = () => {
    remove(id);
    setConfirmOpen(false);
  };

  useEffect(() => {
    if (!dropdownPos) return;
    const close = () => setDropdownPos(null);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, [dropdownPos]);

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        onClick={() => navigate({ to: "/tasks/$taskId", params: { taskId: id } })}
        onKeyDown={(e) => e.key === "Enter" && navigate({ to: "/tasks/$taskId", params: { taskId: id } })}
        onContextMenu={handleContextMenu}
        className={cn(
          "flex items-start gap-2 rounded-full border border-neutral-300 bg-white px-3 py-2 cursor-pointer hover:bg-neutral-50 transition-colors",
          description && "rounded-2xl",
          className,
        )}
      >
        <button
          type="button"
          onClick={handleToggle}
          className={cn(
            "mt-0.5 w-4 h-4 shrink-0 rounded-sm border-2 flex items-center justify-center transition-colors",
            completed
              ? "bg-neutral-800 border-neutral-800"
              : "bg-white border-neutral-400 hover:border-neutral-600",
          )}
        >
          {completed && (
            <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>
        <div className="min-w-0 flex-1">
          <p className={cn(
            "text-sm font-medium text-neutral-900 leading-tight truncate",
            completed && "line-through text-neutral-400",
          )}>
            {title}
          </p>
          {description && (
            <p className="mt-0.5 text-xs text-neutral-500 leading-snug line-clamp-2">{description}</p>
          )}
        </div>
        <button
          type="button"
          onClick={handleMenuClick}
          className="ml-auto shrink-0 mt-0.5 p-0.5 rounded text-neutral-300 hover:text-neutral-600 hover:bg-neutral-100 transition-colors"
          aria-label="Opções da tarefa"
        >
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>

      {dropdownPos && (
        <div
          className="fixed z-50 min-w-[160px] rounded-lg border border-neutral-200 bg-white shadow-lg py-1"
          style={{ left: dropdownPos.x, top: dropdownPos.y }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={handleDiscard}
            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Descartar tarefa
          </button>
        </div>
      )}

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Excluir tarefa</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir "{title}"? Essa ação não pode ser desfeita.
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
    </>
  );
}
