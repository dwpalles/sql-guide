import { useRef, useState } from "react";
import { Database, ChevronDown, Activity, FileSpreadsheet } from "lucide-react";
import { SQL_GROUPS, type SqlGroup } from "@/data/sqlCommands";
import { groupFull, groupNote, rowDescription } from "@/data/sqlCommandsI18n";
import { SCHEMA_TABLES, SCHEMA_RELATIONSHIPS, tableLabel, columnLabel } from "@/data/schema";
import { CodeBlock } from "@/components/CodeBlock";
import { SqlAnalyzerPanel } from "@/components/SqlAnalyzerPanel";
import { ExcelSqlPanel } from "@/components/ExcelSqlPanel";
import { useI18n, useT } from "@/i18n";
import { cn } from "@/lib/utils";

const ANALYZER_ID = "analisador";
const EXCEL_ID = "excel";
type FilterId = "analisador" | "excel" | string;

// Cor rosa do code-keyword usada para o SQL Doctor.
const PINK = "oklch(0.78 0.16 320)";
// Dourado/amarelo do Excel.
const GOLD = "oklch(0.82 0.16 85)";

export function ReferenceTab() {
  const t = useT();
  // SQL Doctor é a tela de entrada por padrão (primeiro item da sidebar).
  const [filter, setFilter] = useState<FilterId>(ANALYZER_ID);
  const [schemaOpen, setSchemaOpen] = useState(false);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  // Grupos ordenados alfabeticamente; comandos dentro de cada grupo também A→Z.
  const sortedGroups = [...SQL_GROUPS]
    .map((g) => ({
      ...g,
      rows: [...g.rows].sort((a, b) => a.name.localeCompare(b.name, "pt-BR")),
    }))
    .sort((a, b) => a.label.localeCompare(b.label, "pt-BR"));

  const showAnalyzer = filter === ANALYZER_ID;
  const showExcel = filter === EXCEL_ID;
  const visibleGroups =
    filter === ANALYZER_ID || filter === EXCEL_ID
      ? []
      : sortedGroups.filter((g) => g.id === filter);

  const jumpToGroup = (id: string) => {
    setFilter(id);
    setTimeout(() => {
      sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[230px_1fr]">
      <aside className="hidden lg:sticky lg:top-20 lg:block lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          {t("sidebar.categories")}
        </div>
        <div className="mt-2 flex flex-col gap-0.5">
          <SidebarLink
            label={t("sidebar.sqlDoctor")}
            icon={<Activity className="h-3.5 w-3.5" style={{ color: PINK }} />}
            active={filter === ANALYZER_ID}
            onClick={() => setFilter(ANALYZER_ID)}
            bold
            colorOverride={PINK}
          />
          <SidebarLink
            label={t("sidebar.excelToSql")}
            icon={<FileSpreadsheet className="h-3.5 w-3.5" style={{ color: GOLD }} />}
            active={filter === EXCEL_ID}
            onClick={() => setFilter(EXCEL_ID)}
            bold
            colorOverride={GOLD}
          />
          {sortedGroups.map((g) => (
            <SidebarLink
              key={g.id}
              label={g.label.toUpperCase()}
              color={g.color}
              count={g.rows.length}
              active={filter === g.id}
              onClick={() => setFilter(g.id)}
            />
          ))}
        </div>
      </aside>

      <div className="min-w-0">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSchemaOpen((o) => !o)}
            className="ml-auto inline-flex items-center gap-1.5 rounded-lg border border-border bg-secondary/40 px-3 py-2 text-xs font-medium text-foreground hover:border-primary"
          >
            <Database className="h-3.5 w-3.5" />
            {t("schema.toggle")}
            <ChevronDown className={cn("h-3.5 w-3.5 transition", schemaOpen && "rotate-180")} />
          </button>
        </div>

        {schemaOpen && <SchemaPanel />}

        <div className="mb-5 flex flex-wrap gap-1.5 lg:hidden">
          <FilterPill
            label={t("sidebar.sqlDoctor")}
            icon={<Activity className="h-3 w-3" />}
            active={filter === ANALYZER_ID}
            onClick={() => setFilter(ANALYZER_ID)}
            variant="analyzer"
          />
          <FilterPill
            label={t("sidebar.excelToSql")}
            icon={<FileSpreadsheet className="h-3 w-3" />}
            active={filter === EXCEL_ID}
            onClick={() => setFilter(EXCEL_ID)}
            variant="excel"
          />
          {sortedGroups.map((g) => (
            <FilterPill
              key={g.id}
              label={g.label.toUpperCase()}
              color={g.color}
              active={filter === g.id}
              onClick={() => setFilter(g.id)}
            />
          ))}
        </div>

        <div className="space-y-8">
          {visibleGroups.map((group) => (
            <section
              key={group.id}
              ref={(el) => {
                sectionRefs.current[group.id] = el;
              }}
            >
              <SectionHeader group={group} />
              <div className="overflow-hidden rounded-lg border border-border">
                <table className="w-full text-sm">
                  <thead className="bg-secondary/40 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    <tr>
                      <th className="w-[28%] px-4 py-2 text-left">{t("table.command")}</th>
                      <th className="w-[32%] px-4 py-2 text-left">{t("table.description")}</th>
                      <th className="px-4 py-2 text-left">{t("table.example")}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {group.rows.map((r, i) => (
                      <tr key={i} className="align-top">
                        <td className="px-4 py-3">
                          <code className="font-mono text-sm font-semibold text-foreground">
                            {r.name}
                          </code>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {rowDescription(group.id, r, lang)}
                        </td>
                        <td className="px-4 py-3">
                          <CodeBlock code={r.example} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ))}

          {showExcel && (
            <section
              ref={(el) => {
                sectionRefs.current[EXCEL_ID] = el;
              }}
              className="rounded-lg border border-border bg-card p-5"
            >
              <ExcelSqlPanel />
            </section>
          )}

          {showAnalyzer && (
            <section
              ref={(el) => {
                sectionRefs.current[ANALYZER_ID] = el;
              }}
              className="rounded-lg border border-border bg-card p-5"
            >
              <SqlAnalyzerPanel onJumpToGroup={jumpToGroup} />
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ group }: { group: SqlGroup }) {
  return (
    <div className="mb-3 flex flex-wrap items-center gap-3">
      <span
        className="inline-flex h-6 items-center rounded-md border px-2 text-[11px] font-semibold uppercase tracking-wider"
        style={{
          color: group.color,
          background: group.bg,
          borderColor: `color-mix(in oklab, ${group.color} 35%, transparent)`,
        }}
      >
        {group.label}
      </span>
      <h3 className="text-base font-semibold text-foreground">
        {group.full.replace(/^\d+\.\s*/, "")}
      </h3>
      <span className="hidden text-xs text-muted-foreground sm:inline">— {group.note}</span>
    </div>
  );
}

function SidebarLink({
  label,
  color,
  active,
  onClick,
  icon,
  count,
  bold,
  colorOverride,
}: {
  label: string;
  color?: string;
  active: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
  count?: number;
  bold?: boolean;
  colorOverride?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group flex items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs uppercase tracking-wider transition",
        bold ? "font-bold" : "font-medium",
        active
          ? "bg-secondary text-foreground"
          : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
      )}
      style={colorOverride && !active ? { color: colorOverride } : undefined}
    >
      {icon ?? (
        <span
          className="inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full"
          style={{ background: color ?? "var(--muted-foreground)" }}
        />
      )}
      <span className="flex-1 truncate">{label}</span>
      {typeof count === "number" && (
        <span
          className={cn(
            "ml-auto rounded-full px-1.5 py-0.5 text-[10px] font-mono tabular-nums",
            active
              ? "bg-background/60 text-foreground"
              : "bg-secondary/60 text-muted-foreground",
          )}
        >
          {count}
        </span>
      )}
    </button>
  );
}

function FilterPill({
  label,
  color,
  active,
  onClick,
  icon,
  variant,
}: {
  label: string;
  color?: string;
  active: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
  variant?: "analyzer" | "excel";
}) {
  const c =
    variant === "analyzer" ? PINK : variant === "excel" ? GOLD : (color ?? "#7d8590");

  let style: React.CSSProperties;
  if (variant === "analyzer" || variant === "excel") {
    style = active
      ? { color: "#000", background: c, borderColor: "#000" }
      : { color: c, background: "transparent", borderColor: c };
  } else {
    style = active
      ? { color: "#000", background: c, borderColor: "#000" }
      : {
          color: "var(--muted-foreground)",
          background: "var(--secondary)",
          borderColor: "var(--border)",
        };
  }

  return (
    <button
      onClick={onClick}
      className="inline-flex h-7 items-center gap-1.5 rounded-full border px-3 text-[11px] font-semibold uppercase tracking-wider transition"
      style={style}
    >
      {icon}
      {label}
    </button>
  );
}

function SchemaPanel() {
  const t = useT();
  const { lang } = useI18n();
  return (
    <div className="mb-5 rounded-lg border border-border bg-card p-4">
      <div className="mb-3 text-sm font-semibold text-foreground">
        {t("schema.title")}
        <span className="ml-2 text-xs font-normal text-muted-foreground">
          {t("schema.subtitle")}
        </span>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {SCHEMA_TABLES.map((tbl) => (
          <div key={tbl.name} className="rounded-md border border-border bg-code-bg p-3">
            <div className="mb-2">
              <div className="font-mono text-sm font-semibold text-primary">{tbl.name}</div>
              <div className="text-[10px] font-normal text-muted-foreground">
                {tableLabel(tbl, lang)}
              </div>
            </div>
            <div className="flex flex-wrap gap-1">
              {tbl.columns.map((c) => (
                <span
                  key={c.name}
                  title={columnLabel(c, lang)}
                  className={cn(
                    "rounded-md border px-1.5 py-0.5 font-mono text-[11px]",
                    c.kind === "pk"
                      ? "border-warning/40 bg-warning/10 text-warning"
                      : c.kind === "fk"
                        ? "border-primary/40 bg-primary/10 text-primary"
                        : "border-border bg-secondary text-muted-foreground",
                  )}
                >
                  {c.kind === "pk" && "🔑 "}
                  {c.kind === "fk" && "🔗 "}
                  {c.name}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 text-xs text-muted-foreground">
        {t("schema.legend")} · {SCHEMA_RELATIONSHIPS.join(" · ")}
      </div>
    </div>
  );
}
