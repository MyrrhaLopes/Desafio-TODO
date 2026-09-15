import { Filter, Tag, LayoutGrid, Clock, Check, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/frontend/components/ui/dropdown-menu";
import { Button } from "@/frontend/components/ui/button";
import { useSearch, useNavigate } from "@tanstack/react-router";
import { cn } from "@/frontend/shared/utils";
import type { HomeSearch } from "@/frontend/pages/HomePage";
import {
  TASK_VIEW_OPTIONS,
  TASK_GROUPING_OPTIONS,
  TASK_PRAZO_OPTIONS,
} from "./task-options";

export { TASK_VIEW_OPTIONS, TASK_GROUPING_OPTIONS, TASK_PRAZO_OPTIONS };

const PRAZO_LABELS: Record<typeof TASK_PRAZO_OPTIONS[number], string> = {
  "sem-prazo": "Sem prazo",
  "hoje": "Hoje",
  "esta-semana": "Esta semana",
};

const STATUS_LABELS: Record<string, string> = {
  "to-do": "Pendente",
  "done": "Concluída",
  "in-progress": "Em progresso",
};

const GROUPING_LABELS: Record<typeof TASK_GROUPING_OPTIONS[number], string> = {
  "date": "Data de Prazo",
  "status": "Status",
  "no_grouping": "Sem agrupamento",
};

const VIEW_LABELS: Record<typeof TASK_VIEW_OPTIONS[number], string> = {
  "list": "Listas",
  "calendar": "Kanban",
};

export function OptionsBar() {
  const { prazo, status, view, grouping } = useSearch({ from: "/" });
  const navigate = useNavigate({ from: "/" });

  const set = (patch: Partial<HomeSearch>) =>
    navigate({ search: (prev) => ({ ...prev, ...patch }) });

  const prazoAtivo = prazo !== undefined;
  const statusAtivo = status !== "all";

  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
      <div className="flex items-center gap-2">
        <span className="flex items-center gap-1.5 text-sm font-semibold text-neutral-800">
          <Filter className="h-4 w-4" />
          Filtros
        </span>

        <div className="inline-flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="xs"
                className={cn(prazoAtivo && "rounded-r-none border-r-0")}
              >
                <Clock className={cn(prazoAtivo ? "text-neutral-600" : "text-neutral-400")} />
                <span className={cn(!prazoAtivo && "text-neutral-400")}>
                  {prazoAtivo ? PRAZO_LABELS[prazo] : "Selecionar prazo"}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {TASK_PRAZO_OPTIONS.map((opt) => (
                <DropdownMenuItem key={opt} onClick={() => set({ prazo: opt })}>
                  {PRAZO_LABELS[opt]}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          {prazoAtivo && (
            <button
              type="button"
              onClick={() => set({ prazo: undefined })}
              className="inline-flex items-center h-7 px-1.5 border rounded-r-sm text-neutral-400 hover:bg-neutral-50 hover:text-neutral-600 transition-colors"
            >
              <X className="size-3" />
            </button>
          )}
        </div>

        <div className="inline-flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="xs"
                className={cn(statusAtivo && "rounded-r-none border-r-0")}
              >
                <Check className={cn(statusAtivo ? "text-neutral-600" : "text-neutral-400")} />
                <span className={cn(!statusAtivo && "text-neutral-400")}>
                  {statusAtivo ? STATUS_LABELS[status] : "Selecionar status"}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => set({ status: "to-do" })}>Pendente</DropdownMenuItem>
              <DropdownMenuItem onClick={() => set({ status: "done" })}>Concluída</DropdownMenuItem>
              <DropdownMenuItem onClick={() => set({ status: "in-progress" })}>Em progresso</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {statusAtivo && (
            <button
              type="button"
              onClick={() => set({ status: "all" })}
              className="inline-flex items-center h-7 px-1.5 border rounded-r-sm text-neutral-400 hover:bg-neutral-50 hover:text-neutral-600 transition-colors"
            >
              <X className="size-3" />
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="flex items-center gap-1.5 text-sm font-semibold text-neutral-800">
          <Tag className="h-4 w-4" />
          Agrupamento
        </span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="xs">
              {GROUPING_LABELS[grouping]}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {TASK_GROUPING_OPTIONS.map((opt) => (
              <DropdownMenuItem key={opt} onClick={() => set({ grouping: opt })}>
                {GROUPING_LABELS[opt]}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center gap-2">
        <span className="flex items-center gap-1.5 text-sm font-semibold text-neutral-800">
          <LayoutGrid className="h-4 w-4" />
          Visualizações
        </span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="xs">
              {VIEW_LABELS[view]}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {TASK_VIEW_OPTIONS.map((opt) => (
              <DropdownMenuItem key={opt} onClick={() => set({ view: opt })}>
                {VIEW_LABELS[opt]}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
