import { useMemo, useState } from "react";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  Sparkles,
  RotateCcw,
  ArrowUpRight,
  FileSpreadsheet,
  Star,
  Search,
} from "lucide-react";
import { analyzeSql, findGroupIdForCommand, type AnalyzedToken } from "@/lib/sqlAnalyzer";
import { EXCEL_TO_SQL } from "@/data/excelToSql";
import { CodeBlock } from "@/components/CodeBlock";
import { cn } from "@/lib/utils";

const STATUS_META = {
  ok: { icon: CheckCircle2, label: "Válido", cls: "border-success/30 bg-success/10 text-success" },
  warn: { icon: AlertTriangle, label: "Variante", cls: "border-warning/30 bg-warning/10 text-warning" },
  invalid: { icon: XCircle, label: "Inválido", cls: "border-destructive/30 bg-destructive/10 text-destructive" },
  unknown: { icon: HelpCircle, label: "Desconhecido", cls: "border-border bg-muted/40 text-muted-foreground" },
  excel: { icon: FileSpreadsheet, label: "Excel → SQL", cls: "border-[oklch(0.78_0.16_85)]/40 bg-[oklch(0.78_0.16_85)]/10 text-[oklch(0.82_0.16_85)]" },
} as const;

interface Props {
  /** when a related/canonical command is clicked, jump to its group section */
  onJumpToGroup?: (groupId: string) => void;
}

export function SqlAnalyzerPanel({ onJumpToGroup }: Props) {
  const [code, setCode] = useState("");
  const [analysis, setAnalysis] = useState<ReturnType<typeof analyzeSql> | null>(null);
  const [excelQuery, setExcelQuery] = useState("");

  const run = () => setAnalysis(analyzeSql(code));
  const clear = () => { setCode(""); setAnalysis(null); };

  const filteredExcel = useMemo(() => {
    const q = excelQuery.trim().toLowerCase();
    const list = q
      ? EXCEL_TO_SQL.filter(
          (m) =>
            m.excel.toLowerCase().includes(q) ||
            m.sql.toLowerCase().includes(q) ||
            m.description.toLowerCase().includes(q) ||
            m.category.toLowerCase().includes(q) ||
            m.example.toLowerCase().includes(q),
        )
      : EXCEL_TO_SQL;
    // Top 20 primeiro
    return [...list].sort((a, b) => Number(b.top) - Number(a.top));
  }, [excelQuery]);

  return (
    <div>
      <div className="mb-3">
        <h2 className="text-lg font-semibold">⌥ Analisador de SQL</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Cole ou digite qualquer código SQL — cada comando é identificado, verificado e
          relacionado ao material acima. Variantes de outros dialetos (SQL Server, Oracle…), termos inválidos
          e <span className="font-medium text-[oklch(0.82_0.16_85)]">funções do Excel</span> (com equivalente SQL) também são detectados.
        </p>
      </div>

      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        spellCheck={false}
        placeholder={"Cole sua query ou digite uma função Excel (VLOOKUP, SUMIF, COUNTIF…)\nEx: SELECT nome, MAX(preco) FROM produtos WHERE estoque > 0 GROUP BY id_categoria HAVING COUNT(*) > 2 ORDER BY preco DESC LIMIT 5;"}
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
            {analysis.counts.excel > 0 && (
              <span className="inline-flex items-center gap-1">{analysis.counts.excel}<FileSpreadsheet className="h-3.5 w-3.5 text-[oklch(0.82_0.16_85)]" /></span>
            )}
            {analysis.counts.unknown > 0 && (
              <span className="inline-flex items-center gap-1">{analysis.counts.unknown}<HelpCircle className="h-3.5 w-3.5" /></span>
            )}
          </div>
        )}
      </div>

      {analysis && analysis.tokens.length === 0 && (
        <div className="mt-5 rounded-md border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
          Nenhum comando SQL ou função Excel conhecido identificado. Tenta colar uma query ou uma função como <code className="font-mono">VLOOKUP</code>.
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

      {/* ===== Banco Excel → SQL ===== */}
      <div className="mt-8">
        <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h3 className="flex items-center gap-2 text-base font-semibold">
              <FileSpreadsheet className="h-4 w-4 text-[oklch(0.82_0.16_85)]" />
              Funções do Excel → SQL
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              {EXCEL_TO_SQL.length} funções mapeadas. Pesquise pelo nome Excel, pelo equivalente SQL ou pela descrição.
              <span className="ml-1 inline-flex items-center gap-1">
                <Star className="h-3 w-3 fill-[oklch(0.82_0.16_85)] text-[oklch(0.82_0.16_85)]" />
                = entre as 20 mais usadas.
              </span>
            </p>
          </div>
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              value={excelQuery}
              onChange={(e) => setExcelQuery(e.target.value)}
              placeholder="Pesquisar função Excel ou SQL…"
              className="w-64 rounded-md border border-border bg-secondary/40 py-1.5 pl-8 pr-2 text-sm outline-none focus:border-primary"
            />
          </div>
        </div>

        {filteredExcel.length === 0 ? (
          <div className="rounded-md border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            Nenhuma função encontrada para "{excelQuery}".
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-border">
            <div className="hidden grid-cols-[160px_140px_1fr] gap-4 border-b border-border bg-secondary/40 px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground md:grid">
              <div>Excel</div>
              <div>SQL</div>
              <div>Descrição & exemplo</div>
            </div>
            <div className="divide-y divide-border">
              {filteredExcel.map((m) => (
                <div key={m.excel} className="grid grid-cols-1 gap-3 px-4 py-3 md:grid-cols-[160px_140px_1fr] md:gap-4">
                  <div className="flex items-center gap-2">
                    {m.top && (
                      <Star className="h-3.5 w-3.5 shrink-0 fill-[oklch(0.82_0.16_85)] text-[oklch(0.82_0.16_85)]" />
                    )}
                    <code className="font-mono text-sm font-semibold text-foreground">{m.excel}</code>
                    <span className="ml-auto rounded border border-border bg-secondary/40 px-1.5 py-0.5 text-[10px] text-muted-foreground md:hidden">
                      {m.category}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <code className="font-mono text-sm text-primary">{m.sql}</code>
                    <span className="hidden text-[10px] text-muted-foreground md:inline">{m.category}</span>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{m.description}</p>
                    <div className="mt-2">
                      <CodeBlock code={m.example} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
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
    if (token.status === "excel") return token.excel?.description ?? "";
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
        {token.status === "excel" && token.excel?.top && (
          <span className="inline-flex w-fit items-center gap-1 text-[10px] text-[oklch(0.82_0.16_85)]">
            <Star className="h-3 w-3 fill-current" /> Top 20
          </span>
        )}
      </div>

      <div className="min-w-0">
        <code className="font-mono text-sm font-semibold text-foreground">{token.token}</code>
        {token.canonical && (
          <span className="ml-2 text-xs text-muted-foreground">
            → use <code className="font-mono text-foreground">{token.canonical}</code>
          </span>
        )}
        {token.status === "excel" && token.excel && (
          <span className="ml-2 text-xs text-muted-foreground">
            → equivalente SQL: <code className="font-mono text-primary">{token.excel.sql}</code>
          </span>
        )}
        {message && <p className="mt-1 text-xs text-muted-foreground">{message}</p>}
        {token.status === "excel" && token.excel && (
          <div className="mt-2 max-w-xl">
            <CodeBlock code={token.excel.example} />
          </div>
        )}
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
