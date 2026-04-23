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
  BookOpen,
} from "lucide-react";
import { analyzeSql, findGroupIdForCommand, type AnalyzedToken } from "@/lib/sqlAnalyzer";
import { explainSql } from "@/lib/sqlExplainer";
import { CodeBlock } from "@/components/CodeBlock";
import { useI18n, useT } from "@/i18n";
import { variantNote, invalidReason } from "@/data/sqlAnalyzerDataI18n";
import { excelDescription, excelCategory } from "@/data/excelToSqlI18n";
import { cn } from "@/lib/utils";
import whyLogo from "@/assets/why_solutions_logo.png";

type StatusKey = "ok" | "warn" | "invalid" | "unknown" | "excel";

const STATUS_META: Record<
  StatusKey,
  { icon: typeof CheckCircle2; labelKey: "status.ok" | "status.warn" | "status.invalid" | "status.unknown" | "status.excel"; cls: string }
> = {
  ok: { icon: CheckCircle2, labelKey: "status.ok", cls: "border-success/30 bg-success/10 text-success" },
  warn: { icon: AlertTriangle, labelKey: "status.warn", cls: "border-warning/30 bg-warning/10 text-warning" },
  invalid: { icon: XCircle, labelKey: "status.invalid", cls: "border-destructive/30 bg-destructive/10 text-destructive" },
  unknown: { icon: HelpCircle, labelKey: "status.unknown", cls: "border-border bg-muted/40 text-muted-foreground" },
  excel: { icon: FileSpreadsheet, labelKey: "status.excel", cls: "border-[oklch(0.78_0.16_85)]/40 bg-[oklch(0.78_0.16_85)]/10 text-[oklch(0.82_0.16_85)]" },
};

interface Props {
  /** when a related/canonical command is clicked, jump to its group section */
  onJumpToGroup?: (groupId: string) => void;
}

export function SqlAnalyzerPanel({ onJumpToGroup }: Props) {
  const t = useT();
  const { lang } = useI18n();
  const [code, setCode] = useState("");
  const [analysis, setAnalysis] = useState<ReturnType<typeof analyzeSql> | null>(null);

  const explainSteps = useMemo(() => explainSql(code, lang), [code, lang]);

  const run = () => setAnalysis(analyzeSql(code));
  const clear = () => { setCode(""); setAnalysis(null); };


  return (
    <div>
      <div className="mb-3">
        <h2 className="text-lg font-semibold">{t("analyzer.title")}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{t("analyzer.intro")}</p>
      </div>

      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        spellCheck={false}
        placeholder={t("analyzer.placeholder")}
        className="min-h-[160px] w-full rounded-lg border border-border bg-code-bg p-3 font-mono text-sm leading-relaxed text-foreground outline-none focus:border-primary"
        style={{
          backgroundImage: `url(${whyLogo})`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "40%",
        }}
      />

      {/* Explicação automática em tempo real */}
      <div className="mt-3 rounded-lg border border-border bg-card/40">
        <div className="flex items-center gap-2 border-b border-border px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <BookOpen className="h-3.5 w-3.5 text-primary" />
          {t("analyzer.stepByStep")}
          {explainSteps.length > 0 && (
            <span className="ml-auto rounded-full bg-secondary/60 px-2 py-0.5 font-mono text-[10px] tabular-nums text-muted-foreground">
              {t("analyzer.clauses", { n: explainSteps.length, s: explainSteps.length === 1 ? "" : "s" })}
            </span>
          )}
        </div>

        {explainSteps.length === 0 ? (
          <p className="px-3 py-4 text-xs text-muted-foreground">{t("analyzer.empty")}</p>
        ) : (
          <ol className="divide-y divide-border">
            {explainSteps.map((s, i) => (
              <li key={i} className="grid grid-cols-[28px_1fr] gap-3 px-3 py-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/15 font-mono text-[11px] font-semibold text-primary">
                  {i + 1}
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-baseline gap-2">
                    <span className="rounded-md border border-primary/30 bg-primary/10 px-1.5 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-primary">
                      {s.clause}
                    </span>
                    <code className="break-all font-mono text-[11px] text-muted-foreground">
                      {s.snippet}
                    </code>
                  </div>
                  <p className="mt-1.5 text-xs leading-relaxed text-foreground">
                    {s.explanation}
                  </p>
                  {s.context && (
                    <p className="mt-1 text-[11px] italic text-muted-foreground">
                      🗄️ {s.context}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          onClick={run}
          disabled={!code.trim()}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Sparkles className="h-4 w-4" /> {t("analyzer.analyze")}
        </button>
        <button
          onClick={clear}
          className="inline-flex items-center gap-2 rounded-md border border-border bg-secondary px-3 py-1.5 text-sm font-medium text-secondary-foreground transition hover:bg-secondary/70"
        >
          <RotateCcw className="h-4 w-4" /> {t("analyzer.clear")}
        </button>

        {analysis && (
          <div className="ml-auto flex items-center gap-3 text-xs text-muted-foreground">
            <span>{t("analyzer.identified", { n: analysis.counts.total })}</span>
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
          {t("analyzer.noResults")} <code className="font-mono">VLOOKUP</code>.
        </div>
      )}

      {analysis && analysis.tokens.length > 0 && (
        <div className="mt-5 overflow-hidden rounded-lg border border-border">
          <div className="grid grid-cols-[150px_1fr_240px] gap-4 border-b border-border bg-secondary/40 px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            <div>{t("analyzer.col.status")}</div>
            <div>{t("analyzer.col.command")}</div>
            <div>{t("analyzer.col.related")}</div>
          </div>
          <div className="divide-y divide-border">
            {analysis.tokens.map((tok, i) => (
              <Row key={i} token={tok} onJumpToGroup={onJumpToGroup} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

function Row({ token, onJumpToGroup }: { token: AnalyzedToken; onJumpToGroup?: (id: string) => void }) {
  const t = useT();
  const { lang } = useI18n();
  const meta = STATUS_META[token.status];
  const Icon = meta.icon;

  const message = (() => {
    if (token.status === "ok") return token.section ? `${t("analyzer.section")} ${token.section}` : "";
    if (token.status === "warn") return token.canonical ? variantNote(token.token, lang) : (token.note ?? "");
    if (token.status === "invalid") return invalidReason(token.token, lang);
    if (token.status === "excel") return token.excel ? excelDescription(token.excel, lang) : "";
    return t("analyzer.notRecognized");
  })();

  return (
    <div className="grid grid-cols-[150px_1fr_240px] gap-4 px-4 py-3 text-sm">
      <div className="flex flex-col gap-1">
        <span className={cn("inline-flex w-fit items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium", meta.cls)}>
          <Icon className="h-3 w-3" /> {t(meta.labelKey)}
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
            <Star className="h-3 w-3 fill-current" /> {t("analyzer.top20")}
          </span>
        )}
      </div>

      <div className="min-w-0">
        <code className="font-mono text-sm font-semibold text-foreground">{token.token}</code>
        {token.canonical && (
          <span className="ml-2 text-xs text-muted-foreground">
            → {t("analyzer.use")} <code className="font-mono text-foreground">{token.canonical}</code>
          </span>
        )}
        {token.status === "excel" && token.excel && (
          <span className="ml-2 text-xs text-muted-foreground">
            → {t("analyzer.sqlEquivalent")} <code className="font-mono text-primary">{token.excel.sql}</code>
            <span className="ml-2 text-[10px]">· {excelCategory(token.excel, lang)}</span>
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
