import type { TasksSelect } from "@/backend/db/schema";
import type { TaskView as TaskViewVariant } from "@/frontend/components/task/task-options";
import { TaskGroup } from "@/frontend/components/task/TaskGroup";

interface TaskViewProps {
  variant: TaskViewVariant;
  tasks: TasksSelect[];
}

function toCardTask(t: TasksSelect) {
  return {
    id: t.id,
    title: t.title,
    description: t.description ?? undefined,
    completed: t.status === "done",
  };
}

function TaskListView({ tasks }: { tasks: TasksSelect[] }) {
  const semPrazo = tasks.filter((t) => !t.dueDateStart);
  const comPrazo = tasks.filter((t) => !!t.dueDateStart);
  //TODO: definir mais seções a partir de data de prazo start

  if (tasks.length === 0) {
    return <p className="text-sm text-neutral-400">Nenhuma tarefa encontrada.</p>;
  }

  return (
    <div className="space-y-8">
      {semPrazo.length > 0 && (
        <TaskGroup label="Sem prazo" tasks={semPrazo.map(toCardTask)} />
      )}
      {comPrazo.length > 0 && (
        <TaskGroup label="Com prazo" tasks={comPrazo.map(toCardTask)} />
      )}
    </div>
  );
}

export function TaskView({ variant, tasks }: TaskViewProps) {
  if (variant === "list") {
    return <TaskListView tasks={tasks} />;
  }

  return null;
}
