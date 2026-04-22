import { SCHEMA_TABLES, SCHEMA_RELATIONSHIPS } from "@/data/schema";
import { cn } from "@/lib/utils";

export function ErdDiagram() {
  return (
    <div className="flex h-full flex-col">
      <div className="mb-3">
        <h2 className="text-sm font-semibold text-foreground">Schema E-commerce</h2>
        <p className="text-xs text-muted-foreground">
          Diagrama ERD simplificado · 🔑 PK · 🔗 FK
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {SCHEMA_TABLES.map((t) => (
          <div
            key={t.name}
            className="rounded-md border border-border bg-code-bg p-3 shadow-sm"
          >
            <div className="mb-2 border-b border-border pb-1.5 font-mono text-sm font-semibold text-primary">
              {t.name}
            </div>
            <ul className="flex flex-col gap-1">
              {t.columns.map((c) => (
                <li
                  key={c.name}
                  className={cn(
                    "flex items-center gap-1.5 font-mono text-[11px]",
                    c.kind === "pk"
                      ? "text-warning"
                      : c.kind === "fk"
                        ? "text-primary"
                        : "text-muted-foreground",
                  )}
                >
                  <span className="w-3">
                    {c.kind === "pk" ? "🔑" : c.kind === "fk" ? "🔗" : "·"}
                  </span>
                  {c.name}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-md border border-border bg-secondary/30 p-3">
        <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Relacionamentos
        </div>
        <ul className="space-y-1 font-mono text-[11px] text-foreground">
          {SCHEMA_RELATIONSHIPS.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
