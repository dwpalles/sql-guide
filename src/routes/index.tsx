import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Database, BookOpen, Code2 } from "lucide-react";
import { ReferenceTab } from "@/components/ReferenceTab";
import { PracticeTab } from "@/components/PracticeTab";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SQL Master — Referência e Prática de SQL" },
      {
        name: "description",
        content:
          "Aprenda SQL com uma referência completa de comandos e exercícios práticos em um banco de dados de e-commerce.",
      },
      { property: "og:title", content: "SQL Master — Referência e Prática de SQL" },
      {
        property: "og:description",
        content: "Referência completa e exercícios práticos de SQL.",
      },
    ],
  }),
  component: Index,
});

type Tab = "reference" | "practice";

function Index() {
  const [tab, setTab] = useState<Tab>("reference");

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
        <div className="mx-auto flex h-14 max-w-7xl items-center gap-6 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/15 text-primary">
              <Database className="h-4 w-4" />
            </div>
            <span className="font-semibold tracking-tight">
              SQL <span className="text-primary">Master</span>
            </span>
          </div>

          <nav className="flex h-full items-end gap-1">
            <TabButton active={tab === "reference"} onClick={() => setTab("reference")}>
              <BookOpen className="h-4 w-4" />
              Referência
            </TabButton>
            <TabButton active={tab === "practice"} onClick={() => setTab("practice")}>
              <Code2 className="h-4 w-4" />
              Prática
            </TabButton>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {tab === "reference" ? <ReferenceTab /> : <PracticeTab />}
      </main>

      <footer className="mx-auto max-w-7xl border-t border-border px-4 py-6 text-xs text-muted-foreground sm:px-6 lg:px-8">
        SQL Master · Construído para estudo e referência rápida
      </footer>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative flex h-full items-center gap-2 px-3 pb-3 pt-3 text-sm font-medium transition-colors",
        active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
      <span
        className={cn(
          "absolute inset-x-0 -bottom-px h-[2px] rounded-full transition-colors",
          active ? "bg-primary" : "bg-transparent",
        )}
      />
    </button>
  );
}
