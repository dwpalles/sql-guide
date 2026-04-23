import { createFileRoute, Link } from "@tanstack/react-router";
import { Database, Heart } from "lucide-react";
import { SQL_GROUPS, type SqlGroup, type SqlRow } from "@/data/sqlCommands";
import { rowDescription, groupLabel } from "@/data/sqlCommandsI18n";
import { CodeBlock } from "@/components/CodeBlock";
import { LangToggle } from "@/components/LangToggle";
import { WhyBrand } from "@/components/WhyBrand";
import { useI18n, useT } from "@/i18n";
import { useFavorites, favKey } from "@/hooks/useFavorites";
import { cn } from "@/lib/utils";

const FAV_RED = "oklch(0.72 0.2 20)";

export const Route = createFileRoute("/sql")({
  head: () => ({
    meta: [
      { title: "SQL — Lista completa A→Z" },
      {
        name: "description",
        content: "Lista única de todos os comandos SQL, ordenada A→Z, com favoritos.",
      },
    ],
  }),
  component: SqlPage,
});

function SqlPage() {
  const t = useT();
  const { lang } = useI18n();
  const { toggle, isFav } = useFavorites();

  // Flat A→Z list of every command across every group.
  const flat: { group: SqlGroup; row: SqlRow }[] = [];
  for (const g of SQL_GROUPS) {
    for (const r of g.rows) flat.push({ group: g, row: r });
  }
  flat.sort((a, b) => a.row.name.localeCompare(b.row.name, "pt-BR"));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
        <div className="mx-auto flex h-14 max-w-[1400px] items-center gap-3 px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/15 text-primary">
              <Database className="h-4 w-4" />
            </div>
            <span className="font-mono text-sm font-semibold tracking-tight text-primary">
              SQL<span className="text-muted-foreground">.ref</span>
            </span>
          </div>
          <nav className="ml-2 flex items-center gap-1">
            <Link
              to="/"
              className="rounded-md px-2.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:bg-secondary hover:text-foreground"
            >
              {t("nav.codigos")}
            </Link>
            <Link
              to="/sql"
              className="rounded-md border border-primary bg-primary/15 px-2.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary"
            >
              {t("nav.sql")}
            </Link>
          </nav>
          <div className="ml-auto">
            <LangToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1400px] px-4 py-5">
        <div className="mb-4">
          <h1 className="text-base font-semibold text-foreground">{t("sql.all.title")}</h1>
          <p className="mt-1 text-xs text-muted-foreground">{t("sql.all.subtitle")}</p>
        </div>

        <ul className="space-y-3">
          {flat.map(({ group, row }, i) => {
            const k = favKey(group.id, row.name);
            const fav = isFav(k);
            return (
              <li
                key={i}
                className="rounded-lg border border-border bg-card p-3"
              >
                <div className="flex items-start gap-2">
                  <button
                    type="button"
                    onClick={() => toggle(k)}
                    aria-pressed={fav}
                    aria-label={fav ? "Remove from favorites" : "Add to favorites"}
                    className={cn(
                      "inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md border transition",
                      fav ? "border-transparent" : "border-border text-muted-foreground",
                    )}
                    style={
                      fav
                        ? {
                            color: FAV_RED,
                            background: `color-mix(in oklab, ${FAV_RED} 14%, transparent)`,
                          }
                        : undefined
                    }
                  >
                    <Heart className="h-4 w-4" fill={fav ? "currentColor" : "none"} />
                  </button>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <code className="break-all font-mono text-sm font-semibold text-foreground">
                        {row.name}
                      </code>
                      <span
                        className="inline-flex h-5 items-center rounded border px-1.5 text-[10px] font-semibold uppercase tracking-wider"
                        style={{
                          color: group.color,
                          background: group.bg,
                          borderColor: `color-mix(in oklab, ${group.color} 35%, transparent)`,
                        }}
                      >
                        {groupLabel(group, lang)}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {rowDescription(group.id, row, lang)}
                    </p>
                    <div className="mt-2">
                      <CodeBlock code={row.example} />
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </main>

      <footer className="mx-auto max-w-[1400px]">
        <WhyBrand />
      </footer>
    </div>
  );
}
