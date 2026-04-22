import { useMemo, useState } from "react";
import { ArrowRight, KeyRound, Link2 } from "lucide-react";
import { SCHEMA_TABLES, SCHEMA_RELATIONSHIPS } from "@/data/schema";
import { useT } from "@/i18n";
import { cn } from "@/lib/utils";

// Each table gets its own distinct color so FK badges and table headers visually match.
const TABLE_COLORS: Record<string, string> = {
  clientes: "oklch(0.78 0.16 240)", // azul
  categorias: "oklch(0.80 0.16 320)", // rosa/magenta
  produtos: "oklch(0.82 0.17 85)", // amarelo
  pedidos: "oklch(0.78 0.17 150)", // verde
  itens_pedido: "oklch(0.78 0.17 30)", // laranja
};

interface Edge {
  fromTable: string;
  fromCol: string;
  toTable: string;
  toCol: string;
}

const EDGES: Edge[] = SCHEMA_RELATIONSHIPS.map((r) => {
  const [left, right] = r.split("→").map((s) => s.trim());
  const [fromTable, fromCol] = left.split(".");
  const [toTable, toCol] = right.split(".");
  return { fromTable, fromCol, toTable, toCol };
});

// Build a quick lookup: "tabela.coluna" -> Edge (only FK columns have one).
const EDGE_BY_FK = new Map<string, Edge>();
for (const e of EDGES) EDGE_BY_FK.set(`${e.fromTable}.${e.fromCol}`, e);

export function ErdDiagram() {
  const t = useT();
  // hovered = either a table name OR a "tabela.coluna" key — both highlight related items.
  const [hovered, setHovered] = useState<string | null>(null);

  const highlightedTables = useMemo(() => {
    if (!hovered) return new Set<string>();
    const set = new Set<string>();
    // Hovered a table directly
    if (SCHEMA_TABLES.some((t) => t.name === hovered)) {
      set.add(hovered);
      // also light up any table connected to it
      for (const e of EDGES) {
        if (e.fromTable === hovered) set.add(e.toTable);
        if (e.toTable === hovered) set.add(e.fromTable);
      }
      return set;
    }
    // Hovered an FK column "tabela.coluna"
    const edge = EDGE_BY_FK.get(hovered);
    if (edge) {
      set.add(edge.fromTable);
      set.add(edge.toTable);
    }
    return set;
  }, [hovered]);

  const isTableHighlighted = (name: string) =>
    highlightedTables.size === 0 ? false : highlightedTables.has(name);
  const isTableDimmed = (name: string) =>
    highlightedTables.size > 0 && !highlightedTables.has(name);

  const scrollToTable = (name: string) => {
    const el = document.getElementById(`erd-table-${name}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
  };

  return (
    <div className="flex h-full flex-col">
      <div className="mb-3">
        <h2 className="text-sm font-semibold text-foreground">{t("erd.title")}</h2>
        <p className="text-xs text-muted-foreground">{t("erd.subtitle")}</p>
      </div>

      {/* Legenda visual de relacionamentos */}
      <div className="mb-4 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
        {EDGES.map((e, i) => {
          const key = `${e.fromTable}.${e.fromCol}`;
          const active = hovered === key || hovered === e.fromTable || hovered === e.toTable;
          return (
            <button
              key={i}
              type="button"
              onMouseEnter={() => setHovered(key)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => scrollToTable(e.toTable)}
              className={cn(
                "group flex items-center gap-2 rounded-md border bg-card px-2 py-1.5 text-left text-[11px] transition-all",
                active
                  ? "border-primary shadow-sm"
                  : "border-border hover:border-primary/60",
              )}
            >
              <span
                className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 font-mono font-semibold"
                style={{
                  color: TABLE_COLORS[e.fromTable],
                  background: `color-mix(in oklab, ${TABLE_COLORS[e.fromTable]} 14%, transparent)`,
                }}
              >
                {e.fromTable}
                <span className="text-foreground/60">.{e.fromCol}</span>
              </span>
              <ArrowRight className="h-3 w-3 shrink-0 text-muted-foreground" />
              <span
                className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 font-mono font-semibold"
                style={{
                  color: TABLE_COLORS[e.toTable],
                  background: `color-mix(in oklab, ${TABLE_COLORS[e.toTable]} 14%, transparent)`,
                }}
              >
                {e.toTable}
                <span className="text-foreground/60">.{e.toCol}</span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {SCHEMA_TABLES.map((tbl) => {
          const color = TABLE_COLORS[tbl.name] ?? "var(--primary)";
          const highlighted = isTableHighlighted(tbl.name);
          const dimmed = isTableDimmed(tbl.name);
          return (
            <div
              key={tbl.name}
              id={`erd-table-${tbl.name}`}
              onMouseEnter={() => setHovered(tbl.name)}
              onMouseLeave={() => setHovered(null)}
              className={cn(
                "rounded-md border bg-code-bg p-3 shadow-sm transition-all",
                highlighted
                  ? "scale-[1.01] border-transparent ring-2"
                  : "border-border",
                dimmed && "opacity-40",
              )}
              style={
                highlighted
                  ? ({
                      ["--tw-ring-color" as string]: color,
                      borderColor: color,
                    } as React.CSSProperties)
                  : undefined
              }
            >
              <div
                className="mb-2 flex items-center justify-between border-b pb-1.5 font-mono text-sm font-semibold"
                style={{
                  color,
                  borderColor: `color-mix(in oklab, ${color} 30%, transparent)`,
                }}
              >
                <span>{tbl.name}</span>
                <span
                  className="inline-block h-2 w-2 rounded-full"
                  style={{ background: color }}
                  aria-hidden
                />
              </div>
              <ul className="flex flex-col gap-1">
                {tbl.columns.map((c) => {
                  const colKey = `${tbl.name}.${c.name}`;
                  const edge = EDGE_BY_FK.get(colKey);
                  const isFkHovered = hovered === colKey;
                  return (
                    <li
                      key={c.name}
                      onMouseEnter={(e) => {
                        if (edge) {
                          e.stopPropagation();
                          setHovered(colKey);
                        }
                      }}
                      className={cn(
                        "flex items-center gap-1.5 rounded px-1 py-0.5 font-mono text-[11px] transition-colors",
                        c.kind === "pk"
                          ? "text-warning"
                          : c.kind === "fk"
                            ? "text-primary"
                            : "text-muted-foreground",
                        isFkHovered && "bg-primary/10",
                      )}
                    >
                      <span className="w-3 shrink-0">
                        {c.kind === "pk" ? (
                          <KeyRound className="h-3 w-3 text-warning" />
                        ) : c.kind === "fk" ? (
                          <Link2 className="h-3 w-3 text-primary" />
                        ) : (
                          <span className="text-muted-foreground">·</span>
                        )}
                      </span>
                      <span className="font-semibold">{c.name}</span>
                      {edge && (
                        <button
                          type="button"
                          onClick={(ev) => {
                            ev.stopPropagation();
                            scrollToTable(edge.toTable);
                          }}
                          className="ml-auto inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-semibold transition-all hover:scale-105"
                          style={{
                            color: TABLE_COLORS[edge.toTable],
                            background: `color-mix(in oklab, ${TABLE_COLORS[edge.toTable]} 16%, transparent)`,
                            border: `1px solid color-mix(in oklab, ${TABLE_COLORS[edge.toTable]} 35%, transparent)`,
                          }}
                          title={`${t("erd.goTo")} ${edge.toTable}.${edge.toCol}`}
                        >
                          <ArrowRight className="h-2.5 w-2.5" />
                          {edge.toTable}.{edge.toCol}
                        </button>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
