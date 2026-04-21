import { useMemo, useState } from "react";
import { FileSpreadsheet, Search, Star } from "lucide-react";
import { EXCEL_TO_SQL } from "@/data/excelToSql";
import { CodeBlock } from "@/components/CodeBlock";

export function ExcelSqlPanel() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
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
    // Top 20 primeiro, depois ordem alfabética
    return [...list].sort((a, b) => {
      if (a.top !== b.top) return Number(b.top) - Number(a.top);
      return a.excel.localeCompare(b.excel);
    });
  }, [query]);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <FileSpreadsheet className="h-5 w-5 text-[oklch(0.82_0.16_85)]" />
            Excel → SQL
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {EXCEL_TO_SQL.length} funções do Excel mapeadas para o equivalente SQL.
            <span className="ml-1 inline-flex items-center gap-1">
              <Star className="h-3 w-3 fill-[oklch(0.82_0.16_85)] text-[oklch(0.82_0.16_85)]" />
              = entre as 20 mais usadas (no topo).
            </span>
          </p>
        </div>
        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Pesquisar Excel, SQL ou descrição…"
            className="w-72 rounded-md border border-border bg-secondary/40 py-1.5 pl-8 pr-2 text-sm outline-none focus:border-primary"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-md border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
          Nenhuma função encontrada para "{query}".
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-border">
          <div className="hidden grid-cols-[180px_160px_1fr] gap-4 border-b border-border bg-secondary/40 px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground md:grid">
            <div>Excel</div>
            <div>SQL</div>
            <div>Descrição & exemplo</div>
          </div>
          <div className="divide-y divide-border">
            {filtered.map((m) => (
              <div
                key={m.excel}
                className="grid grid-cols-1 gap-3 px-4 py-3 md:grid-cols-[180px_160px_1fr] md:gap-4"
              >
                <div className="flex items-center gap-2">
                  {m.top && (
                    <Star className="h-3.5 w-3.5 shrink-0 fill-[oklch(0.82_0.16_85)] text-[oklch(0.82_0.16_85)]" />
                  )}
                  <code className="font-mono text-sm font-semibold text-foreground">
                    {m.excel}
                  </code>
                </div>
                <div className="flex flex-col gap-1">
                  <code className="font-mono text-sm text-primary">{m.sql}</code>
                  <span className="text-[10px] text-muted-foreground">{m.category}</span>
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
  );
}
