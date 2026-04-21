import { useState } from "react";
import { CheckCircle2, AlertTriangle, XCircle, HelpCircle, Sparkles, RotateCcw, ArrowUpRight } from "lucide-react";
import { analyzeSql, findGroupIdForCommand, type AnalyzedToken } from "@/lib/sqlAnalyzer";
import { cn } from "@/lib/utils";

const STATUS_META = {
  ok: { icon: CheckCircle2, label: "Válido", cls: "border-success/30 bg-success/10 text-success" },
  warn: { icon: AlertTriangle, label: "Variante", cls: "border-warning/30 bg-warning/10 text-warning" },
  invalid: { icon: XCircle, label: "Inválido", cls: "border-destructive/30 bg-destructive/10 text-destructive" },
  unknown: { icon: HelpCircle, label: "Desconhecido", cls: "border-border bg-muted/40 text-muted-foreground" },
} as const;

interface Props {
  /** when a related/canonical command is clicked, jump to its group section */
  onJumpToGroup?: (groupId: string) => void;
}

export function SqlAnalyzerPanel({ onJumpToGroup }: Props) {
  const [code, setCode] = useState("");
  const [analysis, setAnalysis] = useState<ReturnType<typeof analyzeSql> | null>(null);

  const run = () => setAnalysis(analyzeSql(code));
  const clear = () => { setCode(""); setAnalysis(null); };

  return (
    <div>
      <div className="mb-3">
        <h2 className="text-lg font-semibold">⌥ Analisador de SQL</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Cole ou digite qualquer código SQL — cada comando é identificado, verificado e
          relacionado ao material acima. Variantes de outros dialetos (SQL Server, Oracle…) e termos inválidos
          recebem sugestões.
        </p>
      </div>

      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        spellCheck={false}
        placeholder={"Cole sua query aqui…\nEx: SELECT nome, MAX(preco) FROM produtos WHERE estoque > 0 GROUP BY id_categoria HAVING COUNT(*) > 2 ORDER BY preco DESC LIMIT 5;"}
        className="min-h-[160px] w-full rounded-lg border border-border bg-code-bg p-3 font-mono text-sm leading-relaxed text-foreground outline-none focus:border-primary"
      />

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          onClick={run}
          disabled={!code.trim()}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Sparkles className="h-4 w-4" /> Analisar
        </button>
        <button
          onClick={clear}
          className="inline-flex items-center gap-2 rounded-md border border-border bg-secondary px-3 py-1.5 text-sm font-medium text-secondary-foreground transition hover:bg-secondary/70"
        >
          <RotateCcw className="h-4 w-4" /> Limpar
        </button>

        {analysis && (
          <div className="ml-auto flex items-center gap-3 text-xs text-muted-foreground">
            <span>{analysis.counts.total} identificados:</span>
            <span className="inline-flex items-center gap-1">{analysis.counts.ok}<CheckCircle2 className="h-3.5 w-3.5 text-success" /></span>
            <span className="inline-flex items-center gap-1">{analysis.counts.warn}<AlertTriangle className="h-3.5 w-3.5 text-warning" /></span>
            <span className="inline-flex items-center gap-1">{analysis.counts.invalid}<XCircle className="h-3.5 w-3.5 text-destructive" /></span>
            {analysis.counts.unknown > 0 && (
              <span className="inline-flex items-center gap-1">{analysis.counts.unknown}<HelpCircle className="h-3.5 w-3.5" /></span>
            )}
          </div>
        )}
      </div>

      {analysis && analysis.tokens.length === 0 && (
        <div className="mt-5 rounded-md border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
          Nenhum comando SQL conhecido identificado. Tenta colar uma query.
        </div>
      )}

      {analysis && analysis.tokens.length > 0 && (
        <div className="mt-5 overflow-hidden rounded-lg border border-border">
          <div className="grid grid-cols-[150px_1fr_240px] gap-4 border-b border-border bg-secondary/40 px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            <div>Status / Seção</div>
            <div>Comando</div>
            <div>Relacionados / Sugestões</div>
          </div>
          <div className="divide-y divide-border">
            {analysis.tokens.map((t, i) => (
              <Row key={i} token={t} onJumpToGroup={onJumpToGroup} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ token, onJumpToGroup }: { token: AnalyzedToken; onJumpToGroup?: (id: string) => void }) {
  const meta = STATUS_META[token.status];
  const Icon = meta.icon;

  const message = (() => {
    if (token.status === "ok") return token.section ? `Seção ${token.section}` : "";
    if (token.status === "warn") return token.note ?? "";
    if (token.status === "invalid") return token.reason ?? "";
    return "Não foi reconhecido como comando SQL conhecido.";
  })();

  return (
    <div className="grid grid-cols-[150px_1fr_240px] gap-4 px-4 py-3 text-sm">
      <div className="flex flex-col gap-1">
        <span className={cn("inline-flex w-fit items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium", meta.cls)}>
          <Icon className="h-3 w-3" /> {meta.label}
        </span>
        {token.section && (
          <button
            onClick={() => token.groupId && onJumpToGroup?.(token.groupId)}
            className="text-left text-[11px] text-muted-foreground hover:text-primary hover:underline"
          >
            ↳ {token.section}
          </button>
        )}
      </div>

      <div className="min-w-0">
        <code className="font-mono text-sm font-semibold text-foreground">{token.token}</code>
        {token.canonical && (
          <span className="ml-2 text-xs text-muted-foreground">
            → use <code className="font-mono text-foreground">{token.canonical}</code>
          </span>
        )}
        {message && <p className="mt-1 text-xs text-muted-foreground">{message}</p>}
      </div>

      <div className="flex flex-wrap items-start gap-1.5">
        {token.related.length === 0 ? (
          <span className="text-xs text-muted-foreground">—</span>
        ) : (
          token.related.map((r) => {
            const gid = findGroupIdForCommand(r);
            return (
              <button
                key={r}
                onClick={() => gid && onJumpToGroup?.(gid)}
                disabled={!gid}
                className={cn(
                  "inline-flex items-center gap-1 rounded-md border border-border bg-secondary/60 px-2 py-0.5 font-mono text-[11px] text-foreground",
                  gid ? "cursor-pointer hover:border-primary/50 hover:text-primary" : "cursor-default opacity-70",
                )}
              >
                {r}
                {gid && <ArrowUpRight className="h-3 w-3 text-muted-foreground" />}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
