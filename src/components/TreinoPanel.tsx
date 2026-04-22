import { useState } from "react";
import { ChevronLeft, ChevronRight, Eye, EyeOff, RotateCcw } from "lucide-react";
import { EXERCISES } from "@/data/treinoExercises";
import { CodeBlock } from "@/components/CodeBlock";
import { cn } from "@/lib/utils";

const LEVEL_COLOR: Record<string, string> = {
  fácil: "oklch(0.78 0.16 150)",
  médio: "oklch(0.82 0.16 85)",
  difícil: "oklch(0.72 0.18 25)",
};

export function TreinoPanel() {
  const [index, setIndex] = useState(0);
  const [userSql, setUserSql] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);

  const ex = EXERCISES[index];

  const go = (delta: number) => {
    const next = (index + delta + EXERCISES.length) % EXERCISES.length;
    setIndex(next);
    setUserSql("");
    setShowAnswer(false);
  };

  return (
    <div className="flex h-full flex-col">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Exercícios</h2>
          <p className="text-xs text-muted-foreground">
            {index + 1} de {EXERCISES.length}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => go(-1)}
            className="rounded-md border border-border bg-secondary/40 p-1.5 text-muted-foreground hover:border-primary hover:text-foreground"
            aria-label="Anterior"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => go(1)}
            className="rounded-md border border-border bg-secondary/40 p-1.5 text-muted-foreground hover:border-primary hover:text-foreground"
            aria-label="Próximo"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-4">
        <div className="mb-2 flex items-center gap-2">
          <span
            className="inline-flex h-5 items-center rounded-md border px-2 text-[10px] font-semibold uppercase tracking-wider"
            style={{
              color: LEVEL_COLOR[ex.level],
              borderColor: `color-mix(in oklab, ${LEVEL_COLOR[ex.level]} 45%, transparent)`,
              background: `color-mix(in oklab, ${LEVEL_COLOR[ex.level]} 12%, transparent)`,
            }}
          >
            {ex.level}
          </span>
          <h3 className="text-sm font-semibold text-foreground">{ex.title}</h3>
        </div>
        <p className="text-sm text-muted-foreground">{ex.prompt}</p>
      </div>

      <div className="mt-4 flex flex-1 flex-col">
        <div className="mb-1.5 flex items-center justify-between">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Sua resposta
          </label>
          <button
            onClick={() => setUserSql("")}
            className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="h-3 w-3" />
            Limpar
          </button>
        </div>
        <textarea
          value={userSql}
          onChange={(e) => setUserSql(e.target.value)}
          spellCheck={false}
          placeholder="-- Escreva seu SQL aqui&#10;SELECT ..."
          className={cn(
            "min-h-[160px] flex-1 resize-none rounded-lg border border-border bg-code-bg p-3",
            "font-mono text-sm text-foreground outline-none placeholder:text-muted-foreground",
            "focus:border-primary",
          )}
        />
      </div>

      <div className="mt-3">
        <button
          onClick={() => setShowAnswer((s) => !s)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-secondary/40 px-3 py-2 text-xs font-medium text-foreground hover:border-primary"
        >
          {showAnswer ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
          {showAnswer ? "Ocultar gabarito" : "Ver gabarito"}
        </button>

        {showAnswer && (
          <div className="mt-3">
            <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Gabarito
            </div>
            <CodeBlock code={ex.answer} />
          </div>
        )}
      </div>
    </div>
  );
}
