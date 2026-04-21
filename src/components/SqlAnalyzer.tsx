import { useMemo, useState } from "react";
import { Activity, CheckCircle2, AlertTriangle, XCircle, ArrowUpRight, RotateCcw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { analyzeSql, type AnalyzedToken } from "@/lib/sqlAnalyzer";
import { cn } from "@/lib/utils";

const STATUS_META = {
  valid: {
    icon: CheckCircle2,
    label: "Válido",
    cls: "border-success/30 bg-success/10 text-success",
  },
  warning: {
    icon: AlertTriangle,
    label: "Aviso",
    cls: "border-warning/30 bg-warning/10 text-warning",
  },
  invalid: {
    icon: XCircle,
    label: "Inválido",
    cls: "border-destructive/30 bg-destructive/10 text-destructive",
  },
} as const;

export function SqlAnalyzer() {
  const [code, setCode] = useState("");
  const [submitted, setSubmitted] = useState("");

  const analysis = useMemo(() => (submitted ? analyzeSql(submitted) : null), [submitted]);

  const handleAnalyze = () => setSubmitted(code);
  const handleClear = () => {
    setCode("");
    setSubmitted("");
  };

  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <div className="mb-1 flex items-center gap-2">
        <Activity className="h-4 w-4 text-primary" />
        <h2 className="text-base font-semibold">Analisador de SQL</h2>
      </div>
      <p className="mb-4 text-sm text-muted-foreground">
        Cole ou digite qualquer código SQL — cada comando é identificado, verificado e
        relacionado ao material. Termos de Excel, DOS ou outras linguagens recebem sugestões
        de equivalentes em SQL.
      </p>

      <Textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        spellCheck={false}
        placeholder="SELECT * FROM clientes WHERE estado = 'SP';"
        className="min-h-[140px] border-border bg-code-bg font-mono text-sm leading-relaxed"
      />

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Button onClick={handleAnalyze} disabled={!code.trim()} className="gap-2">
          <Sparkles className="h-4 w-4" />
          Analisar
        </Button>
        <Button variant="secondary" onClick={handleClear} className="gap-2">
          <RotateCcw className="h-4 w-4" />
          Limpar
        </Button>

        {analysis && (
          <div className="ml-auto flex items-center gap-3 text-xs text-muted-foreground">
            <span>{analysis.counts.total} identificados:</span>
            <span className="inline-flex items-center gap-1">
              {analysis.counts.valid} <CheckCircle2 className="h-3.5 w-3.5 text-success" />
            </span>
            <span className="inline-flex items-center gap-1">
              {analysis.counts.warning} <AlertTriangle className="h-3.5 w-3.5 text-warning" />
            </span>
            <span className="inline-flex items-center gap-1">
              {analysis.counts.invalid} <XCircle className="h-3.5 w-3.5 text-destructive" />
            </span>
          </div>
        )}
      </div>

      {analysis && analysis.tokens.length === 0 && (
        <div className="mt-5 rounded-md border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
          Nenhum comando identificado. Tente colar uma query SQL.
        </div>
      )}

      {analysis && analysis.tokens.length > 0 && (
        <div className="mt-5 overflow-hidden rounded-lg border border-border">
          <div className="grid grid-cols-[160px_1fr_220px] gap-4 border-b border-border bg-secondary/40 px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            <div>Status / Seção</div>
            <div>Comando</div>
            <div>Relacionados / Substitutos</div>
          </div>
          <div className="divide-y divide-border">
            {analysis.tokens.map((tok, i) => (
              <Row key={i} token={tok} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ token }: { token: AnalyzedToken }) {
  const meta = STATUS_META[token.status];
  const Icon = meta.icon;
  return (
    <div className="grid grid-cols-[160px_1fr_220px] gap-4 px-4 py-3 text-sm">
      <div className="flex flex-col gap-1">
        <span
          className={cn(
            "inline-flex w-fit items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium",
            meta.cls,
          )}
        >
          <Icon className="h-3 w-3" />
          {meta.label}
        </span>
        {token.category && (
          <span className="text-[11px] text-muted-foreground">{token.category}</span>
        )}
        {token.origin && (
          <span className="text-[11px] text-muted-foreground">de {token.origin}</span>
        )}
      </div>

      <div className="min-w-0">
        <code className="font-mono text-sm font-semibold text-foreground">{token.normalized}</code>
        <p className="mt-1 text-xs text-muted-foreground">{token.message}</p>
      </div>

      <div className="flex flex-wrap items-start gap-1.5">
        {token.suggestions.length === 0 ? (
          <span className="text-xs text-muted-foreground">—</span>
        ) : (
          token.suggestions.map((s) => (
            <span
              key={s}
              className="inline-flex items-center gap-1 rounded-md border border-border bg-secondary/60 px-2 py-0.5 font-mono text-[11px] text-foreground"
            >
              {s}
              <ArrowUpRight className="h-3 w-3 text-muted-foreground" />
            </span>
          ))
        )}
      </div>
    </div>
  );
}
