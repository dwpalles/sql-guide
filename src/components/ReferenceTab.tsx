import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Database, ChevronDown, Activity, FileSpreadsheet, Heart } from "lucide-react";
import { SQL_GROUPS, type SqlGroup, type SqlRow } from "@/data/sqlCommands";
import { groupFull, groupNote, groupLabel, rowDescription } from "@/data/sqlCommandsI18n";
import { SCHEMA_TABLES, SCHEMA_RELATIONSHIPS, tableLabel, columnLabel } from "@/data/schema";
import { CodeBlock } from "@/components/CodeBlock";
import { SqlAnalyzerPanel } from "@/components/SqlAnalyzerPanel";
import { ExcelSqlPanel } from "@/components/ExcelSqlPanel";
import { useI18n, useT } from "@/i18n";
import { useFavorites, favKey } from "@/hooks/useFavorites";
import { cn } from "@/lib/utils";

const ANALYZER_ID = "analisador";
const EXCEL_ID = "excel";
const FAVORITES_ID = "favoritos";
const ALL_SQL_ID = "all-sql";
type FilterId = "analisador" | "excel" | "favoritos" | "all-sql" | string;

// Cor rosa do code-keyword usada para o SQL Doctor.
const PINK = "oklch(0.78 0.16 320)";
// Dourado/amarelo do Excel.
const GOLD = "oklch(0.82 0.16 85)";
// Vermelho/rosa do coração para favoritos.
const FAV_RED = "oklch(0.72 0.2 20)";
// Verde para o atalho mobile "SQL".
const GREEN = "oklch(0.78 0.18 150)";

export function ReferenceTab() {
  const t = useT();
  const { lang } = useI18n();
  const { favs, toggle, isFav } = useFavorites();
  // SQL Doctor é a tela de entrada por padrão (primeiro item da sidebar).
  const [filter, setFilter] = useState<FilterId>(ANALYZER_ID);
  const [schemaOpen, setSchemaOpen] = useState(false);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  // Detect mobile-only layout (<640px = below Tailwind `sm`).
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia("(max-width: 639px)");
    const update = () => setIsMobile(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    if (
      isMobile &&
      filter !== ANALYZER_ID &&
      filter !== EXCEL_ID &&
      filter !== FAVORITES_ID &&
      filter !== ALL_SQL_ID
    ) {
      setFilter(ANALYZER_ID);
    }
  }, [isMobile, filter]);

  // Grupos ordenados alfabeticamente pelo rótulo localizado;
  // comandos dentro de cada grupo também A→Z.
  const sortedGroups = [...SQL_GROUPS]
    .map((g) => ({
      ...g,
      rows: [...g.rows].sort((a, b) => a.name.localeCompare(b.name, "pt-BR")),
    }))
    .sort((a, b) => groupLabel(a, lang).localeCompare(groupLabel(b, lang), lang));

  const showAnalyzer = filter === ANALYZER_ID;
  const showExcel = filter === EXCEL_ID;
  const showFavorites = filter === FAVORITES_ID;
  const showAllSql = filter === ALL_SQL_ID;
  const visibleGroups =
    showAnalyzer || showExcel || showFavorites || showAllSql
      ? []
      : sortedGroups.filter((g) => g.id === filter);

  // Flat A→Z list of every command across every group.
  const allSqlRows: { group: SqlGroup; row: SqlRow }[] = [];
  for (const g of SQL_GROUPS) {
    for (const r of g.rows) allSqlRows.push({ group: g, row: r });
  }
  allSqlRows.sort((a, b) => a.row.name.localeCompare(b.row.name, "pt-BR"));

  // Flat favorites list (across all groups, A→Z by command name).
  const favoriteRows: { group: SqlGroup; row: SqlRow }[] = [];
  for (const g of SQL_GROUPS) {
    for (const r of g.rows) {
      if (favs.has(favKey(g.id, r.name))) favoriteRows.push({ group: g, row: r });
    }
  }
  favoriteRows.sort((a, b) => a.row.name.localeCompare(b.row.name, "pt-BR"));

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
          {/* Favoritos: heart-only entry above the two existing pills */}
          <SidebarLink
            label=""
            ariaLabel={t("sidebar.favorites")}
            icon={
              <Heart
                className="h-3.5 w-3.5"
                style={{ color: FAV_RED }}
                fill={favs.size > 0 ? FAV_RED : "none"}
              />
            }
            active={filter === FAVORITES_ID}
            onClick={() => setFilter(FAVORITES_ID)}
            bold
            colorOverride={FAV_RED}
            count={favs.size > 0 ? favs.size : undefined}
            iconOnly
          />
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
              label={groupLabel(g, lang).toUpperCase()}
              color={g.color}
              count={g.rows.length}
              active={filter === g.id}
              onClick={() => setFilter(g.id)}
            />
          ))}
        </div>
      </aside>

      <div className="min-w-0">
        {/* Linha 1: Favoritos (♥) + Schema E-commerce */}
        <div className="mb-4 flex flex-wrap items-center gap-2 lg:justify-end">
          <div className="lg:hidden">
            <FilterPill
              label=""
              ariaLabel={t("sidebar.favorites")}
              icon={
                <Heart
                  className="h-3.5 w-3.5"
                  fill={favs.size > 0 ? "currentColor" : "none"}
                />
              }
              active={filter === FAVORITES_ID}
              onClick={() => setFilter(FAVORITES_ID)}
              variant="favorites"
              count={favs.size > 0 ? favs.size : undefined}
              iconOnly
            />
          </div>
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

        {/* Linha 2: SQL Doctor + Excel → SQL (+ pills de categorias em sm+) */}
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
          {/* Mobile-only green "SQL" pill — inline A→Z list view */}
          {isMobile && (
            <FilterPill
              label={t("nav.sql")}
              active={filter === ALL_SQL_ID}
              onClick={() => setFilter(ALL_SQL_ID)}
              variant="allsql"
            />
          )}
          {/* Group pills only hidden on phones (<640px). At sm+ they always render. */}
          {!isMobile &&
            sortedGroups.map((g) => (
              <FilterPill
                key={g.id}
                label={groupLabel(g, lang).toUpperCase()}
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
                      <th className="w-10 px-2 py-2"></th>
                      <th className="w-[26%] px-4 py-2 text-left">{t("table.command")}</th>
                      <th className="w-[32%] px-4 py-2 text-left">{t("table.description")}</th>
                      <th className="px-4 py-2 text-left">{t("table.example")}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {group.rows.map((r, i) => {
                      const k = favKey(group.id, r.name);
                      const fav = isFav(k);
                      return (
                        <tr key={i} className="align-top">
                          <td className="px-2 py-3">
                            <FavButton active={fav} onClick={() => toggle(k)} />
                          </td>
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
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          ))}

          {showFavorites && (
            <section
              ref={(el) => {
                sectionRefs.current[FAVORITES_ID] = el;
              }}
            >
              <div className="mb-3 flex flex-wrap items-center gap-3">
                <span
                  className="inline-flex h-6 items-center gap-1 rounded-md border px-2 text-[11px] font-semibold uppercase tracking-wider"
                  style={{
                    color: FAV_RED,
                    background: `color-mix(in oklab, ${FAV_RED} 12%, transparent)`,
                    borderColor: `color-mix(in oklab, ${FAV_RED} 35%, transparent)`,
                  }}
                >
                  <Heart className="h-3 w-3" fill="currentColor" />
                  {t("favorites.title")}
                </span>
                <span className="text-xs text-muted-foreground">{favoriteRows.length}</span>
              </div>

              {favoriteRows.length === 0 ? (
                <div className="rounded-lg border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
                  {t("favorites.empty")}
                </div>
              ) : (
                <div className="overflow-hidden rounded-lg border border-border">
                  <table className="w-full text-sm">
                    <thead className="bg-secondary/40 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      <tr>
                        <th className="w-10 px-2 py-2"></th>
                        <th className="w-[26%] px-4 py-2 text-left">{t("table.command")}</th>
                        <th className="w-[32%] px-4 py-2 text-left">{t("table.description")}</th>
                        <th className="px-4 py-2 text-left">{t("table.example")}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {favoriteRows.map(({ group, row }, i) => {
                        const k = favKey(group.id, row.name);
                        return (
                          <tr key={i} className="align-top">
                            <td className="px-2 py-3">
                              <FavButton active onClick={() => toggle(k)} />
                            </td>
                            <td className="px-4 py-3">
                              <code className="font-mono text-sm font-semibold text-foreground">
                                {row.name}
                              </code>
                              <div
                                className="mt-1 inline-flex h-5 items-center rounded border px-1.5 text-[10px] font-semibold uppercase tracking-wider"
                                style={{
                                  color: group.color,
                                  background: group.bg,
                                  borderColor: `color-mix(in oklab, ${group.color} 35%, transparent)`,
                                }}
                              >
                                {groupLabel(group, lang)}
                              </div>
                            </td>
                            <td className="px-4 py-3 text-muted-foreground">
                              {rowDescription(group.id, row, lang)}
                            </td>
                            <td className="px-4 py-3">
                              <CodeBlock code={row.example} />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          )}

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
  const { lang } = useI18n();
  const fullText = groupFull(group, lang);
  const noteText = groupNote(group, lang);
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
        {groupLabel(group, lang)}
      </span>
      <h3 className="text-base font-semibold text-foreground">
        {fullText.replace(/^\d+\.\s*/, "")}
      </h3>
      <span className="hidden text-xs text-muted-foreground sm:inline">— {noteText}</span>
    </div>
  );
}

function FavButton({ active, onClick }: { active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={active ? "Remove from favorites" : "Add to favorites"}
      className={cn(
        "inline-flex h-7 w-7 items-center justify-center rounded-md border transition",
        active
          ? "border-transparent"
          : "border-border text-muted-foreground hover:text-foreground",
      )}
      style={
        active
          ? {
              color: FAV_RED,
              background: `color-mix(in oklab, ${FAV_RED} 14%, transparent)`,
            }
          : undefined
      }
    >
      <Heart className="h-3.5 w-3.5" fill={active ? "currentColor" : "none"} />
    </button>
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
  iconOnly,
  ariaLabel,
}: {
  label: string;
  color?: string;
  active: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
  count?: number;
  bold?: boolean;
  colorOverride?: string;
  iconOnly?: boolean;
  ariaLabel?: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
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
      {!iconOnly && <span className="flex-1 truncate">{label}</span>}
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
  count,
  iconOnly,
  ariaLabel,
}: {
  label: string;
  color?: string;
  active: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
  variant?: "analyzer" | "excel" | "favorites";
  count?: number;
  iconOnly?: boolean;
  ariaLabel?: string;
}) {
  const c =
    variant === "analyzer"
      ? PINK
      : variant === "excel"
        ? GOLD
        : variant === "favorites"
          ? FAV_RED
          : (color ?? "#7d8590");

  let style: React.CSSProperties;
  if (variant === "analyzer" || variant === "excel" || variant === "favorites") {
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
      aria-label={ariaLabel}
      className={cn(
        "inline-flex h-7 items-center gap-1.5 rounded-full border text-[11px] font-semibold uppercase tracking-wider transition",
        iconOnly ? "px-2" : "px-3",
      )}
      style={style}
    >
      {icon}
      {!iconOnly && label}
      {typeof count === "number" && (
        <span className="ml-0.5 rounded-full bg-black/15 px-1.5 py-0.5 text-[10px] font-mono tabular-nums">
          {count}
        </span>
      )}
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
