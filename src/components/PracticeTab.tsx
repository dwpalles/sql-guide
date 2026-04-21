import { useMemo, useState } from "react";
import { CheckCircle2, XCircle, Sparkles, RotateCcw, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { CodeBlock } from "./CodeBlock";
import { SCHEMA_DESCRIPTION } from "@/data/sqlCommands";
import { cn } from "@/lib/utils";

type Difficulty = "Iniciante" | "Intermediário" | "Avançado";

interface Exercise {
  id: string;
  difficulty: Difficulty;
  title: string;
  description: string;
  hint?: string;
  solution: string;
  // very loose check: required substrings (case-insensitive)
  requires: string[];
}

const EXERCISES: Exercise[] = [
  {
    id: "ex1",
    difficulty: "Iniciante",
    title: "Clientes do estado de SP",
    description: "Liste todos os clientes do estado de SP.",
    hint: "Use WHERE para filtrar por coluna.",
    requires: ["select", "from", "clientes", "where", "estado", "sp"],
    solution: `SELECT * FROM clientes WHERE estado = 'SP';`,
  },
  {
    id: "ex2",
    difficulty: "Iniciante",
    title: "Top 5 produtos mais caros",
    description: "Mostre o nome e o preço dos 5 produtos mais caros.",
    hint: "Combine ORDER BY com LIMIT.",
    requires: ["select", "nome", "preco", "from", "produtos", "order by", "desc", "limit", "5"],
    solution: `SELECT nome, preco FROM produtos
ORDER BY preco DESC
LIMIT 5;`,
  },
  {
    id: "ex3",
    difficulty: "Iniciante",
    title: "Pedidos entregues",
    description: "Quantos pedidos têm status 'entregue'?",
    hint: "COUNT(*) conta todas as linhas.",
    requires: ["select", "count", "from", "pedidos", "where", "status", "entregue"],
    solution: `SELECT COUNT(*) FROM pedidos WHERE status = 'entregue';`,
  },
  {
    id: "ex4",
    difficulty: "Iniciante",
    title: "Receita total",
    description: "Qual é o valor total de todos os pedidos?",
    hint: "SUM soma valores numéricos.",
    requires: ["select", "sum", "total", "from", "pedidos"],
    solution: `SELECT SUM(total) FROM pedidos;`,
  },
  {
    id: "ex5",
    difficulty: "Intermediário",
    title: "Total gasto por cliente",
    description: "Liste os clientes e o total gasto por cada um, ordenados do maior para o menor.",
    hint: "Use JOIN + GROUP BY + SUM.",
    requires: ["select", "join", "clientes", "pedidos", "sum", "group by", "order by"],
    solution: `SELECT c.nome, SUM(p.total) AS total_gasto
FROM clientes c
JOIN pedidos p ON c.id = p.id_cliente
GROUP BY c.id, c.nome
ORDER BY total_gasto DESC;`,
  },
  {
    id: "ex6",
    difficulty: "Intermediário",
    title: "Produtos nunca pedidos",
    description: "Quais produtos nunca foram pedidos?",
    hint: "LEFT JOIN com WHERE NULL detecta ausências.",
    requires: ["select", "from", "produtos", "left join", "itens_pedido", "is null"],
    solution: `SELECT p.nome
FROM produtos p
LEFT JOIN itens_pedido ip ON p.id = ip.id_produto
WHERE ip.id IS NULL;`,
  },
  {
    id: "ex7",
    difficulty: "Intermediário",
    title: "Categoria com mais produtos",
    description: "Qual categoria tem mais produtos? Retorne apenas o nome e o total.",
    hint: "GROUP BY + COUNT + LIMIT 1.",
    requires: ["select", "categorias", "join", "produtos", "group by", "order by", "limit", "1"],
    solution: `SELECT c.nome, COUNT(*) AS total
FROM categorias c
JOIN produtos p ON c.id = p.id_categoria
GROUP BY c.id, c.nome
ORDER BY total DESC
LIMIT 1;`,
  },
  {
    id: "ex8",
    difficulty: "Avançado",
    title: "Clientes acima da média",
    description: "Liste os clientes que gastaram acima da média geral dos pedidos.",
    hint: "Subquery dentro do HAVING.",
    requires: ["select", "join", "pedidos", "group by", "having", "sum", "avg"],
    solution: `SELECT c.nome, SUM(p.total) AS gasto
FROM clientes c
JOIN pedidos p ON c.id = p.id_cliente
GROUP BY c.id
HAVING SUM(p.total) > (SELECT AVG(total) FROM pedidos);`,
  },
  {
    id: "ex9",
    difficulty: "Avançado",
    title: "Top 3 produtos mais vendidos",
    description: "Mostre os 3 produtos mais vendidos por quantidade total.",
    hint: "SUM(quantidade) com JOIN duplo.",
    requires: ["select", "produtos", "join", "itens_pedido", "sum", "quantidade", "group by", "order by", "limit", "3"],
    solution: `SELECT pr.nome, SUM(ip.quantidade) AS vendidos
FROM produtos pr
JOIN itens_pedido ip ON pr.id = ip.id_produto
GROUP BY pr.id, pr.nome
ORDER BY vendidos DESC
LIMIT 3;`,
  },
  {
    id: "ex10",
    difficulty: "Avançado",
    title: "Clientes ativos todos os meses de 2025",
    description: "Liste os clientes que fizeram pedidos em todos os 12 meses de 2025.",
    hint: "COUNT DISTINCT com HAVING.",
    requires: ["select", "clientes", "join", "pedidos", "year", "2025", "group by", "having", "count", "distinct", "month", "12"],
    solution: `SELECT c.nome
FROM clientes c
JOIN pedidos p ON c.id = p.id_cliente
WHERE YEAR(p.data_pedido) = 2025
GROUP BY c.id
HAVING COUNT(DISTINCT MONTH(p.data_pedido)) = 12;`,
  },
];

const DIFFICULTIES: Difficulty[] = ["Iniciante", "Intermediário", "Avançado"];

const DIFFICULTY_STYLES: Record<Difficulty, string> = {
  Iniciante: "bg-success/15 text-success border-success/30",
  Intermediário: "bg-warning/15 text-warning border-warning/30",
  Avançado: "bg-destructive/15 text-destructive border-destructive/30",
};

type Feedback =
  | { state: "idle" }
  | { state: "correct" }
  | { state: "incorrect"; missing: string[] };

export function PracticeTab() {
  const [difficulty, setDifficulty] = useState<Difficulty>("Iniciante");
  const exercises = useMemo(
    () => EXERCISES.filter((e) => e.difficulty === difficulty),
    [difficulty],
  );
  const [currentId, setCurrentId] = useState(exercises[0].id);
  const current = exercises.find((e) => e.id === currentId) ?? exercises[0];

  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<Feedback>({ state: "idle" });
  const [showSolution, setShowSolution] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  const handleDifficultyChange = (d: Difficulty) => {
    setDifficulty(d);
    const first = EXERCISES.find((e) => e.difficulty === d)!;
    setCurrentId(first.id);
    setAnswer("");
    setFeedback({ state: "idle" });
    setShowSolution(false);
    setShowHint(false);
  };

  const handleSelect = (id: string) => {
    setCurrentId(id);
    setAnswer("");
    setFeedback({ state: "idle" });
    setShowSolution(false);
    setShowHint(false);
  };

  const handleSubmit = () => {
    const lower = answer.toLowerCase();
    const missing = current.requires.filter((r) => !lower.includes(r.toLowerCase()));
    if (missing.length === 0) {
      setFeedback({ state: "correct" });
      setCompleted((prev) => new Set(prev).add(current.id));
    } else {
      setFeedback({ state: "incorrect", missing });
    }
  };

  const handleReset = () => {
    setAnswer("");
    setFeedback({ state: "idle" });
    setShowSolution(false);
    setShowHint(false);
  };

  const total = EXERCISES.length;
  const done = completed.size;
  const progress = (done / total) * 100;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]">
      {/* Sidebar */}
      <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Progresso
            </span>
            <span className="text-xs text-muted-foreground">
              {done}/{total}
            </span>
          </div>
          <Progress value={progress} className="h-1.5" />
          <p className="mt-2 text-xs text-muted-foreground">
            {done === total ? "Todos os exercícios concluídos! 🎉" : "Continue praticando."}
          </p>
        </div>

        <div className="rounded-lg border border-border bg-card p-3">
          <div className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Dificuldade
          </div>
          <div className="flex flex-col gap-1">
            {DIFFICULTIES.map((d) => (
              <button
                key={d}
                onClick={() => handleDifficultyChange(d)}
                className={cn(
                  "rounded-md px-2 py-1.5 text-left text-sm transition-colors hover:bg-secondary",
                  difficulty === d && "bg-secondary text-foreground",
                )}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-3">
          <div className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Exercícios
          </div>
          <div className="flex flex-col gap-1">
            {exercises.map((ex, i) => {
              const isDone = completed.has(ex.id);
              const isActive = ex.id === current.id;
              return (
                <button
                  key={ex.id}
                  onClick={() => handleSelect(ex.id)}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors hover:bg-secondary",
                    isActive && "bg-secondary text-foreground",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] font-semibold",
                      isDone
                        ? "border-success bg-success/20 text-success"
                        : "border-border text-muted-foreground",
                    )}
                  >
                    {isDone ? "✓" : i + 1}
                  </span>
                  <span className="truncate">{ex.title}</span>
                </button>
              );
            })}
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="min-w-0 space-y-5">
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <Badge className={cn("border", DIFFICULTY_STYLES[current.difficulty])} variant="outline">
              {current.difficulty}
            </Badge>
            {completed.has(current.id) && (
              <Badge variant="outline" className="border-success/30 bg-success/10 text-success">
                Concluído
              </Badge>
            )}
          </div>
          <h2 className="mb-2 text-xl font-semibold">{current.title}</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">{current.description}</p>
        </div>

        <div className="rounded-lg border border-border bg-card p-5">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Schema disponível
          </div>
          <pre className="overflow-x-auto rounded-md bg-code-bg p-3 text-xs leading-relaxed text-muted-foreground">
{SCHEMA_DESCRIPTION}
          </pre>
        </div>

        <div className="rounded-lg border border-border bg-card p-5">
          <div className="mb-2 flex items-center justify-between">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Sua resposta SQL
            </div>
            <Button variant="ghost" size="sm" onClick={handleReset} className="h-7 gap-1 text-xs">
              <RotateCcw className="h-3 w-3" /> Limpar
            </Button>
          </div>
          <Textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            spellCheck={false}
            placeholder="-- Digite sua query SQL aqui&#10;SELECT ..."
            className="min-h-[180px] border-border bg-code-bg font-mono text-sm leading-relaxed"
          />
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Button onClick={handleSubmit} disabled={!answer.trim()} className="gap-2">
              <Sparkles className="h-4 w-4" />
              Verificar resposta
            </Button>
            <Button variant="secondary" onClick={() => setShowSolution((s) => !s)}>
              {showSolution ? "Ocultar solução" : "Ver solução"}
            </Button>
          </div>
        </div>

        {feedback.state === "correct" && (
          <div className="flex items-start gap-3 rounded-lg border border-success/30 bg-success/10 p-4">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />
            <div>
              <div className="font-semibold text-success">Resposta correta!</div>
              <p className="mt-1 text-sm text-muted-foreground">
                Sua query contém todos os elementos esperados. Bom trabalho!
              </p>
            </div>
          </div>
        )}

        {feedback.state === "incorrect" && (
          <div className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-4">
            <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
            <div className="min-w-0">
              <div className="font-semibold text-destructive">Quase lá...</div>
              <p className="mt-1 text-sm text-muted-foreground">
                Sua resposta parece estar faltando alguns elementos esperados:
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {feedback.missing.map((m) => (
                  <code
                    key={m}
                    className="rounded border border-border bg-code-bg px-2 py-0.5 text-xs text-foreground"
                  >
                    {m}
                  </code>
                ))}
              </div>
            </div>
          </div>
        )}

        {showSolution && (
          <div className="rounded-lg border border-border bg-card p-5">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Solução de referência
            </div>
            <CodeBlock code={current.solution} />
          </div>
        )}
      </div>
    </div>
  );
}
