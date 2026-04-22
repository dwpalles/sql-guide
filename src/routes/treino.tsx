import { createFileRoute, Link } from "@tanstack/react-router";
import { Database, Dumbbell } from "lucide-react";
import { ErdDiagram } from "@/components/ErdDiagram";
import { TreinoPanel } from "@/components/TreinoPanel";

export const Route = createFileRoute("/treino")({
  head: () => ({
    meta: [
      { title: "TREINO — Pratique SQL no schema e-commerce | SQL.ref" },
      {
        name: "description",
        content:
          "Pratique consultas SQL com exercícios sobre o schema de e-commerce. Diagrama ERD à esquerda, editor com gabarito à direita.",
      },
    ],
  }),
  component: TreinoPage,
});

function TreinoPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
        <div className="mx-auto flex h-14 max-w-[1400px] items-center gap-4 px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/15 text-primary">
              <Database className="h-4 w-4" />
            </div>
            <span className="font-mono text-sm font-semibold tracking-tight text-primary">
              SQL<span className="text-muted-foreground">.ref</span>
            </span>
          </Link>

          <nav className="ml-2 flex items-center gap-1">
            <Link
              to="/"
              className="rounded-md px-2.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:bg-secondary hover:text-foreground"
            >
              SQL.ref
            </Link>
            <Link
              to="/treino"
              className="inline-flex items-center gap-1.5 rounded-md border border-primary bg-primary/15 px-2.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary"
            >
              <Dumbbell className="h-3.5 w-3.5" />
              Treino
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <section className="rounded-lg border border-border bg-card p-5">
            <ErdDiagram />
          </section>
          <section className="rounded-lg border border-border bg-card p-5">
            <TreinoPanel />
          </section>
        </div>
      </main>

      <footer className="mx-auto max-w-[1400px] border-t border-border px-4 py-6 text-xs text-muted-foreground sm:px-6 lg:px-8">
        SQL.ref · TREINO · Pratique queries no schema de referência
      </footer>
    </div>
  );
}
