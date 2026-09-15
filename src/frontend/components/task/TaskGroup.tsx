import { useRef, useState, useEffect } from "react";
import { TaskCard } from "@/frontend/components/task/TaskCard";
import { cn } from "@/frontend/shared/utils";

interface Task {
  id: string;
  title: string;
  description?: string;
  completed?: boolean;
}

interface TaskGroupProps {
  label: string;
  tasks: Task[];
  showSeeMore?: boolean;
  variant?: "grid" | "time";
  timeLabel?: string;
  columns?: { time: string; tasks: Task[] }[];
}

function GridTaskGroup({ label, tasks, showSeeMore }: Omit<TaskGroupProps, "variant">) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [maskLeft, setMaskLeft] = useState(false);
  const [maskRight, setMaskRight] = useState(false);

  const checkMasks = () => {
    const el = scrollRef.current;
    if (!el) return;
    setMaskLeft(el.scrollLeft > 8);
    setMaskRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
  };

  useEffect(() => {
    checkMasks();
    const el = scrollRef.current;
    el?.addEventListener("scroll", checkMasks);
    window.addEventListener("resize", checkMasks);
    return () => {
      el?.removeEventListener("scroll", checkMasks);
      window.removeEventListener("resize", checkMasks);
    };
  }, [tasks]);

  return (
    <section>
      <div className="flex items-baseline gap-2 mb-3">
        <h2 className="text-2xl font-bold text-neutral-900">{label}</h2>
        <span className="text-sm text-neutral-500">{tasks.length} tarefas</span>
        {showSeeMore && (
          <button type="button" className="ml-1 text-sm text-neutral-500 underline underline-offset-2 hover:text-neutral-700">
            Ver mais
          </button>
        )}
      </div>

      <div className="relative border-t border-b border-neutral-200 py-3">
        <div
          className={cn(
            "absolute inset-y-0 left-0 w-10 z-10 pointer-events-none transition-opacity duration-200 bg-gradient-to-r from-white to-transparent",
            maskLeft ? "opacity-100" : "opacity-0"
          )}
        />
        <div
          className={cn(
            "absolute inset-y-0 right-0 w-10 z-10 pointer-events-none transition-opacity duration-200 bg-gradient-to-l from-white to-transparent",
            maskRight ? "opacity-100" : "opacity-0"
          )}
        />

        <div
          ref={scrollRef}
          className="overflow-x-auto pb-1 scrollbar-none"
          style={{ scrollbarWidth: "none" }}
        >
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 w-fit min-w-full" style={{ gridTemplateColumns: "repeat(2, minmax(220px, 1fr))" }}>
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                title={task.title}
                description={task.description}
                completed={task.completed}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TimeColumnGroup({ label, columns = [], showSeeMore }: Omit<TaskGroupProps, "variant">) {
  const scrollXRef = useRef<HTMLDivElement>(null);
  const [maskLeft, setMaskLeft] = useState(false);
  const [maskRight, setMaskRight] = useState(false);

  const checkMasks = () => {
    const el = scrollXRef.current;
    if (!el) return;
    setMaskLeft(el.scrollLeft > 8);
    setMaskRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
  };

  useEffect(() => {
    checkMasks();
    const el = scrollXRef.current;
    el?.addEventListener("scroll", checkMasks);
    window.addEventListener("resize", checkMasks);
    return () => {
      el?.removeEventListener("scroll", checkMasks);
      window.removeEventListener("resize", checkMasks);
    };
  }, [columns]);

  const totalTasks = columns.reduce((sum, col) => sum + col.tasks.length, 0);

  return (
    <section>
      <div className="flex items-baseline gap-2 mb-3">
        <h2 className="text-2xl font-bold text-neutral-900">{label}</h2>
        <span className="text-sm text-neutral-500">{totalTasks} tarefas</span>
        {showSeeMore && (
          <button type="button" className="ml-1 text-sm text-neutral-500 underline underline-offset-2 hover:text-neutral-700">
            Ver mais
          </button>
        )}
      </div>

      <div className="relative border-t border-neutral-200">
        <div
          className={cn(
            "absolute inset-y-0 left-0 w-12 z-10 pointer-events-none transition-opacity duration-200 bg-gradient-to-r from-white to-transparent",
            maskLeft ? "opacity-100" : "opacity-0"
          )}
        />
        <div
          className={cn(
            "absolute inset-y-0 right-0 w-12 z-10 pointer-events-none transition-opacity duration-200 bg-gradient-to-l from-white to-transparent",
            maskRight ? "opacity-100" : "opacity-0"
          )}
        />

        <div
          ref={scrollXRef}
          className="overflow-x-auto scrollbar-none"
          style={{ scrollbarWidth: "none" }}
        >
          <div className="flex min-w-fit">
            {columns.map((col, colIdx) => (
              <div
                key={col.time}
                className={cn(
                  "w-52 shrink-0 border-r border-neutral-200",
                  colIdx === 0 && "border-l border-neutral-200"
                )}
              >
                <div className="py-2 px-3 text-center text-sm font-semibold text-neutral-700 border-b border-neutral-200">
                  {col.time}
                </div>
                <div
                  className="overflow-y-auto relative"
                  style={{
                    maxHeight: "320px",
                    scrollbarWidth: "none",
                    maskImage: col.tasks.length > 3
                      ? "linear-gradient(to bottom, black 70%, transparent 100%)"
                      : undefined,
                    WebkitMaskImage: col.tasks.length > 3
                      ? "linear-gradient(to bottom, black 70%, transparent 100%)"
                      : undefined,
                  }}
                >
                  <div className="flex flex-col gap-2 p-3">
                    {col.tasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        title={task.title}
                        description={task.description}
                        completed={task.completed}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
            <div className="w-52 shrink-0" />
          </div>
        </div>
      </div>
    </section>
  );
}

export function TaskGroup(props: TaskGroupProps) {
  if (props.variant === "time") {
    return <TimeColumnGroup {...props} />;
  }
  return <GridTaskGroup {...props} />;
}
