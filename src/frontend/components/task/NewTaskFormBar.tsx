import { useState, useRef, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import { Clock, ArrowRight } from "lucide-react";
import { Checkbox } from "@/frontend/components/ui/checkbox";
import { cn } from "@/frontend/shared/utils";
import usePostTask from "@/frontend/hooks/usePostTask";

export function NewTaskFormBar() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPreviewingDescription, setIsPreviewingDescription] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const { mutate } = usePostTask();

  const handleTitleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && e.shiftKey) {
        e.preventDefault();
        setIsExpanded(true);
        setTimeout(() => descriptionRef.current?.focus(), 0);
      }
    },
    []
  );

  const handleDescriptionBlur = useCallback(() => {
    if (description.trim()) {
      setIsPreviewingDescription(true);
    }
  }, [description]);

  const handleDescriptionFocus = useCallback(() => {
    setIsPreviewingDescription(false);
  }, []);

  const handleSubmit = useCallback(() => {
    if (!title.trim()) return;
    mutate({
      title: title.trim(),
      description: description.trim() || undefined,
      status: "to-do",
    });
    setTitle("");
    setDescription("");
    setIsExpanded(false);
    setIsPreviewingDescription(false);
    titleRef.current?.focus();
  }, [title, description, mutate]);

  if (isExpanded) {
    return (
      <div className="w-full rounded-2xl border border-neutral-300 bg-white shadow-sm">
        <div className="flex items-start gap-3 px-4 pt-4 pb-2">
          <Checkbox className="mt-1 shrink-0" />
          <div className="flex-1 min-w-0">
            <input
              ref={titleRef}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nova tarefa"
              className="w-full text-sm font-medium text-neutral-900 placeholder:text-neutral-400 outline-none bg-transparent"
            />
            <div className="mt-2 min-h-[80px]">
              {isPreviewingDescription ? (
                <div
                  className="text-sm text-neutral-600 cursor-text prose prose-sm max-w-none"
                  onClick={handleDescriptionFocus}
                >
                  <ReactMarkdown>{description}</ReactMarkdown>
                </div>
              ) : (
                <textarea
                  ref={descriptionRef}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  onBlur={handleDescriptionBlur}
                  placeholder="Pesquisar a respeito"
                  rows={3}
                  className="w-full text-sm text-neutral-500 placeholder:text-neutral-400 outline-none bg-transparent resize-none"
                />
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 px-4 pb-3 pt-1 border-t border-neutral-100">
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-full border border-neutral-300 px-3 py-1.5 text-xs text-neutral-500 hover:bg-neutral-50 transition-colors"
          >
            <Clock className="h-3.5 w-3.5" />
            Definir prazo
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full transition-colors",
              title.trim()
                ? "bg-neutral-900 text-white hover:bg-neutral-700"
                : "bg-neutral-200 text-neutral-400 cursor-not-allowed"
            )}
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full rounded-full border border-neutral-300 bg-white shadow-sm flex items-center px-3 py-2 gap-2">
      <Checkbox className="shrink-0" />
      <input
        ref={titleRef}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleTitleKeyDown}
        placeholder="Nova tarefa"
        className="flex-1 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none bg-transparent min-w-0"
      />
      <button
        type="button"
        className="flex shrink-0 items-center gap-1.5 rounded-full border border-neutral-300 px-3 py-1.5 text-xs text-neutral-500 hover:bg-neutral-50 transition-colors"
      >
        <Clock className="h-3.5 w-3.5" />
        Definir prazo
      </button>
      <span className="hidden md:block shrink-0 text-xs text-neutral-400 whitespace-nowrap px-2">
        Shift + Enter para adicionar descrição
      </span>
      <button
        type="button"
        onClick={handleSubmit}
        className={cn(
          "flex shrink-0 h-8 w-8 items-center justify-center rounded-full transition-colors",
          title.trim()
            ? "bg-neutral-900 text-white hover:bg-neutral-700"
            : "bg-neutral-200 text-neutral-400 cursor-not-allowed"
        )}
      >
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}
