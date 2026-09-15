import { Checkbox } from "@/frontend/components/ui/checkbox";
import { cn } from "@/frontend/shared/utils";

interface TaskCardProps {
  title: string;
  description?: string;
  completed?: boolean;
  className?: string;
}

export function TaskCard({ title, description, completed = false, className }: TaskCardProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-2 rounded-full border border-neutral-300 bg-white px-3 py-2",
        description && "rounded-2xl",
        className
      )}
    >
      <Checkbox
        checked={completed}
        className="mt-0.5 shrink-0"
      />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-neutral-900 leading-tight truncate">{title}</p>
        {description && (
          <p className="mt-0.5 text-xs text-neutral-500 leading-snug line-clamp-2">{description}</p>
        )}
      </div>
    </div>
  );
}
