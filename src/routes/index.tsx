import { createFileRoute } from "@tanstack/react-router";
import { Database } from "lucide-react";
import { ReferenceTab } from "@/components/ReferenceTab";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SQL.ref — Referência completa de SQL com analisador" },
      {
        name: "description",
        content:
          "Referência completa de SQL em português: 22 grupos, ~220 comandos com exemplos no schema de e-commerce e analisador que identifica e corrige sintaxe.",
      },
      { property: "og:title", content: "SQL.ref — Referência completa de SQL" },
      {
        property: "og:description",
        content:
          "22 grupos, ~220 comandos SQL com exemplos no schema de e-commerce e analisador integrado.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
        <div className="mx-auto flex h-14 max-w-[1400px] items-center gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/15 text-primary">
              <Database className="h-4 w-4" />
            </div>
            <span className="font-mono text-sm font-semibold tracking-tight text-primary">
              SQL<span className="text-muted-foreground">.ref</span>
            </span>
          </div>
          <span className="hidden text-xs text-muted-foreground sm:inline">
            Referência completa · 22 grupos · ~220 comandos · analisador integrado
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8">
        <ReferenceTab />
      </main>

      <footer className="mx-auto max-w-[1400px] border-t border-border px-4 py-6 text-xs text-muted-foreground sm:px-6 lg:px-8">
        SQL.ref · Construído para estudo e referência rápida
      </footer>
    </div>
  );
}
