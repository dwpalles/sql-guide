import { useEffect, useMemo, useRef, useState } from "react";
import { Search, X, Database, ChevronDown, Activity } from "lucide-react";
import { SQL_GROUPS, type SqlGroup } from "@/data/sqlCommands";
import { SCHEMA_TABLES, SCHEMA_RELATIONSHIPS } from "@/data/schema";
import { CodeBlock } from "@/components/CodeBlock";
import { SqlAnalyzerPanel } from "@/components/SqlAnalyzerPanel";
import { cn } from "@/lib/utils";

const ANALYZER_ID = "analisador";
type FilterId = "all" | "analisador" | string;

export function ReferenceTab() {
  const [filter, setFilter] = useState<FilterId>("all");
  const [query, setQuery] = useState("");
  const [schemaOpen, setSchemaOpen] = useState(false);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  const q = query.trim().toLowerCase();

  const filteredGroups = useMemo(() => {
    return SQL_GROUPS.map((g) => {
      const groupMatches =
        !q || g.label.toLowerCase().includes(q) || g.full.toLowerCase().includes(q);
      const rows = g.rows.filter((r) => {
        if (!q) return true;
        if (groupMatches) return true;
        return (
          r.name.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.example.toLowerCase().includes(q)
        );
      });
      return { group: g, rows };
    });
  }, [q]);

  const totalMatches = useMemo(
    () => filteredGroups.reduce((acc, g) => acc + g.rows.length, 0),
    [filteredGroups],
  );

  const groupCounts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const { group, rows } of filteredGroups) map[group.id] = rows.length;
    return map;
  }, [filteredGroups]);

  const showAnalyzer = filter === "all" || filter === ANALYZER_ID;
  const visibleGroups =
    filter === ANALYZER_ID
      ? []
      : filter === "all"
        ? filteredGroups
        : filteredGroups.filter((g) => g.group.id === filter);

  const jumpToGroup = (id: string) => {
    setFilter("all");
    setTimeout(() => {
      sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  const searchRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[230px_1fr]">
      <aside className="hidden lg:sticky lg:top-20 lg:block lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Grupos
        </div>
        <div className="mt-2 flex flex-col gap-0.5">
          <SidebarLink
            label="Todos"
            count={totalMatches}
            active={filter === "all"}
            onClick={() => setFilter("all")}
          />
          {SQL_GROUPS.map((g) => (
            <SidebarLink
              key={g.id}
              label={g.label}
              color={g.color}
              count={groupCounts[g.id] ?? g.rows.length}
              active={filter === g.id}
              onClick={() => setFilter(g.id)}
            />
          ))}
          <SidebarLink
            label="Analisador"
            icon={<Activity className="h-3.5 w-3.5" />}
            active={filter === ANALYZER_ID}
            onClick={() => setFilter(ANALYZER_ID)}
          />
        </div>
      </aside>

      <div className="min-w-0">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <div className="relative min-w-0 flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              ref={searchRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Procurar comando, descrição, exemplo… (⌘K)"
              className="w-full rounded-lg border border-border bg-secondary/40 py-2 pl-9 pr-9 text-sm outline-none placeholder:text-muted-foreground focus:border-primary"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:bg-border hover:text-foreground"
                aria-label="Limpar busca"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {q && (
            <span className="text-xs text-muted-foreground">
              {totalMatches} resultado{totalMatches === 1 ? "" : "s"}
            </span>
          )}

          <button
            onClick={() => setSchemaOpen((o) => !o)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-secondary/40 px-3 py-2 text-xs font-medium text-foreground hover:border-primary"
          >
            <Database className="h-3.5 w-3.5" />
            Schema E-commerce
            <ChevronDown className={cn("h-3.5 w-3.5 transition", schemaOpen && "rotate-180")} />
          </button>
        </div>

        {schemaOpen && <SchemaPanel />}

        <div className="mb-5 flex flex-wrap gap-1.5 lg:hidden">
          <FilterPill label="Todos" active={filter === "all"} onClick={() => setFilter("all")} />
          {SQL_GROUPS.map((g) => (
            <FilterPill
              key={g.id}
              label={g.label}
              color={g.color}
              active={filter === g.id}
              onClick={() => setFilter(g.id)}
            />
          ))}
          <FilterPill
            label="Analisador"
            icon={<Activity className="h-3 w-3" />}
            active={filter === ANALYZER_ID}
            onClick={() => setFilter(ANALYZER_ID)}
          />
        </div>

        <div className="space-y-8">
          {visibleGroups.map(({ group, rows }) => {
            if (rows.length === 0 && q) return null;
            return (
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
                        <th className="w-[28%] px-4 py-2 text-left">Comando</th>
                        <th className="w-[32%] px-4 py-2 text-left">Descrição</th>
                        <th className="px-4 py-2 text-left">Exemplo</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {rows.map((r, i) => (
                        <tr key={i} className="align-top">
                          <td className="px-4 py-3">
                            <code className="font-mono text-sm font-semibold text-foreground">
                              {r.name}
                            </code>
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">{r.description}</td>
                          <td className="px-4 py-3">
                            <CodeBlock code={r.example} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            );
          })}

          {visibleGroups.length > 0 &&
            q &&
            visibleGroups.every((g) => g.rows.length === 0) && (
              <div className="rounded-md border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
                Nenhum resultado para “{query}”.
              </div>
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
}: {
  label: string;
  color?: string;
  active: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
  count?: number;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group flex items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs font-medium transition",
        active
          ? "bg-secondary text-foreground"
          : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
      )}
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
}: {
  label: string;
  color?: string;
  active: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
}) {
  const c = color ?? "#7d8590";
  return (
    <button
      onClick={onClick}
      className="inline-flex h-7 items-center gap-1.5 rounded-full border px-3 text-xs font-medium transition"
      style={
        active
          ? {
              color: c,
              background: `color-mix(in oklab, ${c} 18%, transparent)`,
              borderColor: `color-mix(in oklab, ${c} 50%, transparent)`,
            }
          : {
              color: "var(--muted-foreground)",
              background: "var(--secondary)",
              borderColor: "var(--border)",
            }
      }
    >
      {icon}
      {label}
    </button>
  );
}

function SchemaPanel() {
  return (
    <div className="mb-5 rounded-lg border border-border bg-card p-4">
      <div className="mb-3 text-sm font-semibold text-foreground">
        🗄️ Banco de referência — E-commerce
        <span className="ml-2 text-xs font-normal text-muted-foreground">
          (todos os exemplos usam este schema)
        </span>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {SCHEMA_TABLES.map((t) => (
          <div key={t.name} className="rounded-md border border-border bg-code-bg p-3">
            <div className="mb-2 font-mono text-sm font-semibold text-primary">{t.name}</div>
            <div className="flex flex-wrap gap-1">
              {t.columns.map((c) => (
                <span
                  key={c.name}
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
        🔑 pk = chave primária · 🔗 fk = chave estrangeira · {SCHEMA_RELATIONSHIPS.join(" · ")}
      </div>
    </div>
  );
}
