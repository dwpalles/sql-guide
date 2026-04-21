import { useMemo, useState } from "react";
import { Search, Database } from "lucide-react";
import { Input } from "@/components/ui/input";
import { CodeBlock } from "./CodeBlock";
import { CATEGORIES, SCHEMA_DESCRIPTION, SQL_COMMANDS, type SqlCategory } from "@/data/sqlCommands";
import { cn } from "@/lib/utils";

const CATEGORY_BADGE_CLASS: Record<SqlCategory, string> = {
  DDL: "cat-ddl",
  DML: "cat-dml",
  SELECT: "cat-select",
  JOIN: "cat-join",
  Agregação: "cat-agregacao",
  Subqueries: "cat-subqueries",
};

export function ReferenceTab() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<SqlCategory | "Todos">("Todos");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return SQL_COMMANDS.filter((c) => {
      if (activeCategory !== "Todos" && c.category !== activeCategory) return false;
      if (!q) return true;
      return (
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.syntax.toLowerCase().includes(q) ||
        c.example.toLowerCase().includes(q)
      );
    });
  }, [query, activeCategory]);

  const grouped = useMemo(() => {
    const map = new Map<SqlCategory, typeof filtered>();
    for (const cmd of filtered) {
      if (!map.has(cmd.category)) map.set(cmd.category, []);
      map.get(cmd.category)!.push(cmd);
    }
    return Array.from(map.entries());
  }, [filtered]);

  const sidebarCategories = CATEGORIES.filter((cat) =>
    SQL_COMMANDS.some((c) => c.category === cat),
  );

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[220px_1fr]">
      {/* Sticky sidebar */}
      <aside className="lg:sticky lg:top-20 lg:self-start">
        <div className="rounded-lg border border-border bg-card p-3">
          <div className="mb-2 flex items-center gap-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Database className="h-3.5 w-3.5" />
            Categorias
          </div>
          <nav className="flex flex-col">
            <a
              href="#all"
              onClick={(e) => {
                e.preventDefault();
                setActiveCategory("Todos");
              }}
              className={cn(
                "rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-secondary",
                activeCategory === "Todos" && "bg-secondary text-foreground",
              )}
            >
              Todos
              <span className="ml-2 text-xs text-muted-foreground">{SQL_COMMANDS.length}</span>
            </a>
            {sidebarCategories.map((cat) => {
              const count = SQL_COMMANDS.filter((c) => c.category === cat).length;
              return (
                <a
                  key={cat}
                  href={`#${cat}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveCategory(cat);
                    document.getElementById(`cat-${cat}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  className={cn(
                    "rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-secondary",
                    activeCategory === cat && "bg-secondary text-foreground",
                  )}
                >
                  {cat}
                  <span className="ml-2 text-xs text-muted-foreground">{count}</span>
                </a>
              );
            })}
          </nav>
        </div>

        <div className="mt-4 rounded-lg border border-border bg-card p-3">
          <div className="mb-2 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Schema usado
          </div>
          <pre className="overflow-x-auto rounded-md bg-code-bg p-3 text-[11px] leading-relaxed text-muted-foreground">
{SCHEMA_DESCRIPTION}
          </pre>
        </div>
      </aside>

      {/* Main content */}
      <div className="min-w-0">
        {/* Search */}
        <div className="relative mb-4">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar comando, sintaxe ou descrição..."
            className="h-11 pl-9"
          />
        </div>

        {/* Filter pills */}
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveCategory("Todos")}
            data-active={activeCategory === "Todos"}
            className="cat-pill"
          >
            Todos
          </button>
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                data-active={isActive}
                className={cn("cat-pill", isActive && CATEGORY_BADGE_CLASS[cat])}
              >
                <span className={cn("cat-dot", CATEGORY_BADGE_CLASS[cat])} />
                {cat}
              </button>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="rounded-lg border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
            Nenhum comando encontrado para "{query}".
          </div>
        )}

        <div className="space-y-10">
          {grouped.map(([cat, cmds]) => (
            <section key={cat} id={`cat-${cat}`} className="scroll-mt-20">
              <div className="mb-3 flex items-center gap-3">
                <h2 className="text-lg font-semibold">{cat}</h2>
                <div className="h-px flex-1 bg-border" />
                <Badge variant="secondary" className="text-xs">
                  {cmds.length}
                </Badge>
              </div>
              <div className="grid gap-4">
                {cmds.map((cmd) => (
                  <article
                    key={cmd.id}
                    className="rounded-lg border border-border bg-card p-5 transition-colors hover:border-primary/40"
                  >
                    <header className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
                      <h3 className="font-mono text-base font-semibold text-foreground">
                        {cmd.name}
                      </h3>
                      <span className={cn("cat-badge", CATEGORY_BADGE_CLASS[cmd.category])}>
                        {cmd.category}
                      </span>
                    </header>

                    <p className="mb-3 text-sm text-muted-foreground">{cmd.description}</p>

                    <div className="mb-3">
                      <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Sintaxe
                      </div>
                      <code className="block rounded-md border border-border bg-code-bg px-3 py-2 text-xs text-foreground">
                        {cmd.syntax}
                      </code>
                    </div>

                    <div>
                      <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Exemplo
                      </div>
                      <CodeBlock code={cmd.example} />
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
