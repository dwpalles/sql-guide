import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Eye, EyeOff, RotateCcw, Sparkles, BookOpen, Code2 } from "lucide-react";
import { EXERCISES } from "@/data/treinoExercises";
import { exerciseTitle, exercisePrompt } from "@/data/treinoExercisesI18n";
import { CodeBlock } from "@/components/CodeBlock";
import { explainSql, type ExplainStep } from "@/lib/sqlExplainer";
import { useI18n, useT } from "@/i18n";
import type { DictKey } from "@/i18n";
import { cn } from "@/lib/utils";

const LEVEL_COLOR: Record<string, string> = {
  fácil: "oklch(0.78 0.16 150)",
  médio: "oklch(0.82 0.16 85)",
  difícil: "oklch(0.72 0.18 25)",
};

type Tab = "exercicios" | "editor";

export function TreinoPanel() {
  const t = useT();
  const [tab, setTab] = useState<Tab>("exercicios");

  return (
    <div className="flex h-full flex-col">
      <div className="mb-4 inline-flex w-fit items-center gap-1 rounded-lg border border-border bg-secondary/40 p-1">
        <TabButton active={tab === "exercicios"} onClick={() => setTab("exercicios")} icon={<BookOpen className="h-3.5 w-3.5" />}>
          {t("treino.tab.exercises")}
        </TabButton>
        <TabButton active={tab === "editor"} onClick={() => setTab("editor")} icon={<Code2 className="h-3.5 w-3.5" />}>
          {t("treino.tab.debugger")}
        </TabButton>
      </div>

      {tab === "exercicios" ? <ExercisesView /> : <EditorView />}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors",
        active
          ? "bg-primary/15 text-primary"
          : "text-muted-foreground hover:text-foreground",
      )}
    >
      {icon}
      {children}
    </button>
  );
}

function ExercisesView() {
  const t = useT();
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

  const levelKey = `level.${ex.level}` as DictKey;

  return (
    <div className="flex flex-1 flex-col">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-foreground">{t("treino.exercises.title")}</h2>
          <p className="text-xs text-muted-foreground">
            {t("treino.exercises.counter", { i: index + 1, n: EXERCISES.length })}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => go(-1)}
            className="rounded-md border border-border bg-secondary/40 p-1.5 text-muted-foreground hover:border-primary hover:text-foreground"
            aria-label={t("treino.exercises.prev")}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => go(1)}
            className="rounded-md border border-border bg-secondary/40 p-1.5 text-muted-foreground hover:border-primary hover:text-foreground"
            aria-label={t("treino.exercises.next")}
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
            {t(levelKey)}
          </span>
          <h3 className="text-sm font-semibold text-foreground">{ex.title}</h3>
        </div>
        <p className="text-sm text-muted-foreground">{ex.prompt}</p>
      </div>

      <div className="mt-4 flex flex-1 flex-col">
        <div className="mb-1.5 flex items-center justify-between">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {t("treino.exercises.yourAnswer")}
          </label>
          <button
            onClick={() => setUserSql("")}
            className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="h-3 w-3" />
            {t("treino.exercises.clear")}
          </button>
        </div>
        <textarea
          value={userSql}
          onChange={(e) => setUserSql(e.target.value)}
          spellCheck={false}
          placeholder={t("treino.exercises.placeholder")}
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
          {showAnswer ? t("treino.exercises.hideAnswer") : t("treino.exercises.showAnswer")}
        </button>

        {showAnswer && (
          <div className="mt-3">
            <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {t("treino.exercises.answer")}
            </div>
            <CodeBlock code={ex.answer} />
          </div>
        )}
      </div>
    </div>
  );
}

function EditorView() {
  const t = useT();
  const { lang } = useI18n();
  const [sql, setSql] = useState(
    "SELECT c.nome, COUNT(p.id) AS total_pedidos\nFROM clientes c\nLEFT JOIN pedidos p ON p.id_cliente = c.id\nGROUP BY c.nome\nORDER BY total_pedidos DESC;",
  );

  const steps: ExplainStep[] = useMemo(() => {
    try {
      return explainSql(sql, lang);
    } catch {
      return [];
    }
  }, [sql, lang]);

  return (
    <div className="flex flex-1 flex-col">
      <div className="mb-3">
        <h2 className="text-sm font-semibold text-foreground">{t("debugger.title")}</h2>
        <p className="text-xs text-muted-foreground">{t("debugger.subtitle")}</p>
      </div>

      <div className="flex flex-col">
        <div className="mb-1.5 flex items-center justify-between">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {t("debugger.label")}
          </label>
          <button
            onClick={() => setSql("")}
            className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="h-3 w-3" />
            {t("debugger.clear")}
          </button>
        </div>
        <textarea
          value={sql}
          onChange={(e) => setSql(e.target.value)}
          spellCheck={false}
          placeholder={t("treino.exercises.placeholder")}
          className={cn(
            "min-h-[180px] resize-none rounded-lg border border-border bg-code-bg p-3",
            "font-mono text-sm text-foreground outline-none placeholder:text-muted-foreground",
            "focus:border-primary",
          )}
        />
      </div>

      <div className="mt-4">
        <div className="mb-2 flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {t("debugger.autoExplain")}
          </span>
        </div>

        {steps.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border bg-secondary/20 p-4 text-xs text-muted-foreground">
            {t("debugger.empty")}
          </div>
        ) : (
          <ol className="space-y-2">
            {steps.map((step, i) => (
              <li
                key={i}
                className="rounded-lg border border-border bg-card p-3"
              >
                <div className="flex items-start gap-2">
                  <span className="mt-0.5 inline-flex h-5 min-w-[20px] items-center justify-center rounded-md bg-primary/15 px-1.5 text-[10px] font-bold text-primary">
                    {i + 1}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold text-primary">
                        {step.clause}
                      </span>
                      {step.snippet && (
                        <code className="truncate rounded bg-code-bg px-1.5 py-0.5 font-mono text-[11px] text-foreground/80">
                          {step.snippet}
                        </code>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-foreground/90">{step.explanation}</p>
                    {step.context && (
                      <p className="mt-1 text-[11px] text-muted-foreground">{step.context}</p>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}
