import { cn } from "@/frontend/shared/utils";
import { useNavigate } from "@tanstack/react-router";
import usePatchTask from "@/frontend/hooks/usePatchTask";

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

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    patch({ id, values: { status: completed ? "to-do" : "done" } });
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => navigate({ to: "/tasks/$taskId", params: { taskId: id } })}
      onKeyDown={(e) => e.key === "Enter" && navigate({ to: "/tasks/$taskId", params: { taskId: id } })}
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
    </div>
  );
}
