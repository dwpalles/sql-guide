import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "pt" | "en";

const STORAGE_KEY = "sqlref.lang";

// Centralized UI dictionary. Keys are stable; values are per-language strings.
// Supports {placeholder} interpolation via the second arg of t().
const DICT = {
  // Header / nav
  "nav.codigos": { pt: "CÓDIGOS", en: "CODES" },
  "nav.treino": { pt: "Treino", en: "Training" },
  "header.tagline": { pt: "Referência completa · 22 grupos · ~220 comandos", en: "Complete reference · 22 groups · ~220 commands" },
  "footer.main": { pt: "SQL.ref · Construído para estudo e referência rápida", en: "SQL.ref · Built for study and quick reference" },
  "footer.treino": { pt: "SQL.ref · TREINO · Pratique queries no schema de referência", en: "SQL.ref · TRAINING · Practice queries on the reference schema" },

  // 404
  "404.title": { pt: "Página não encontrada", en: "Page not found" },
  "404.desc": { pt: "A página que você procura não existe ou foi movida.", en: "The page you're looking for doesn't exist or has been moved." },
  "404.home": { pt: "Ir para o início", en: "Go home" },

  // Lang toggle
  "lang.toggle.label": { pt: "Idioma", en: "Language" },

  // Sidebar / categories
  "sidebar.categories": { pt: "Categorias", en: "Categories" },
  "sidebar.sqlDoctor": { pt: "SQL DOCTOR", en: "SQL DOCTOR" },
  "sidebar.excelToSql": { pt: "EXCEL → SQL", en: "EXCEL → SQL" },

  // Schema panel
  "schema.toggle": { pt: "Schema E-commerce", en: "E-commerce Schema" },
  "schema.title": { pt: "🗄️ Banco de referência — E-commerce", en: "🗄️ Reference database — E-commerce" },
  "schema.subtitle": { pt: "(todos os exemplos usam este schema)", en: "(all examples use this schema)" },
  "schema.legend": { pt: "🔑 pk = chave primária · 🔗 fk = chave estrangeira", en: "🔑 pk = primary key · 🔗 fk = foreign key" },

  // Reference table
  "table.command": { pt: "Comando", en: "Command" },
  "table.description": { pt: "Descrição", en: "Description" },
  "table.example": { pt: "Exemplo", en: "Example" },

  // Excel → SQL panel
  "excel.title": { pt: "Excel → SQL", en: "Excel → SQL" },
  "excel.subtitle": { pt: "{n} funções do Excel mapeadas para o equivalente SQL.", en: "{n} Excel functions mapped to their SQL equivalent." },
  "excel.top": { pt: "= entre as 20 mais usadas (no topo).", en: "= among the top 20 most used (at the top)." },
  "excel.col.excel": { pt: "Excel", en: "Excel" },
  "excel.col.sql": { pt: "SQL", en: "SQL" },
  "excel.col.descExample": { pt: "Descrição & exemplo", en: "Description & example" },

  // Analyzer panel
  "analyzer.title": { pt: "⌥ Analisador de SQL", en: "⌥ SQL Analyzer" },
  "analyzer.intro": {
    pt: "Cole ou digite qualquer código SQL — cada comando é identificado, verificado e relacionado ao material acima. Variantes de outros dialetos (SQL Server, Oracle…), termos inválidos e funções do Excel (com equivalente SQL) também são detectados.",
    en: "Paste or type any SQL — each command is identified, verified, and linked to the material above. Variants from other dialects (SQL Server, Oracle…), invalid terms, and Excel functions (with SQL equivalents) are also detected.",
  },
  "analyzer.placeholder": {
    pt: "Cole sua query ou digite uma função Excel (VLOOKUP, SUMIF, COUNTIF…)\nEx: SELECT nome, MAX(preco) FROM produtos WHERE estoque > 0 GROUP BY id_categoria HAVING COUNT(*) > 2 ORDER BY preco DESC LIMIT 5;",
    en: "Paste your query or type an Excel function (VLOOKUP, SUMIF, COUNTIF…)\nEx: SELECT nome, MAX(preco) FROM produtos WHERE estoque > 0 GROUP BY id_categoria HAVING COUNT(*) > 2 ORDER BY preco DESC LIMIT 5;",
  },
  "analyzer.stepByStep": { pt: "Explicação passo a passo", en: "Step-by-step explanation" },
  "analyzer.clauses": { pt: "{n} cláusula{s}", en: "{n} clause{s}" },
  "analyzer.empty": {
    pt: "Comece a digitar uma query (SELECT, INSERT, UPDATE, DELETE, CREATE…) e cada cláusula será explicada aqui automaticamente, com contexto do schema e-commerce.",
    en: "Start typing a query (SELECT, INSERT, UPDATE, DELETE, CREATE…) and each clause will be explained here automatically, with context from the e-commerce schema.",
  },
  "analyzer.analyze": { pt: "Analisar", en: "Analyze" },
  "analyzer.clear": { pt: "Limpar", en: "Clear" },
  "analyzer.identified": { pt: "{n} identificados:", en: "{n} identified:" },
  "analyzer.noResults": { pt: "Nenhum comando SQL ou função Excel conhecido identificado. Tenta colar uma query ou uma função como", en: "No known SQL command or Excel function identified. Try pasting a query or a function like" },
  "analyzer.col.status": { pt: "Status / Seção", en: "Status / Section" },
  "analyzer.col.command": { pt: "Comando", en: "Command" },
  "analyzer.col.related": { pt: "Relacionados / Sugestões", en: "Related / Suggestions" },
  "analyzer.use": { pt: "use", en: "use" },
  "analyzer.sqlEquivalent": { pt: "equivalente SQL:", en: "SQL equivalent:" },
  "analyzer.section": { pt: "Seção", en: "Section" },
  "analyzer.notRecognized": { pt: "Não foi reconhecido como comando SQL conhecido.", en: "Not recognized as a known SQL command." },
  "analyzer.top20": { pt: "Top 20", en: "Top 20" },

  // Status labels
  "status.ok": { pt: "Válido", en: "Valid" },
  "status.warn": { pt: "Variante", en: "Variant" },
  "status.invalid": { pt: "Inválido", en: "Invalid" },
  "status.unknown": { pt: "Desconhecido", en: "Unknown" },
  "status.excel": { pt: "Excel → SQL", en: "Excel → SQL" },

  // Treino tabs / panel
  "treino.tab.exercises": { pt: "Exercícios", en: "Exercises" },
  "treino.tab.debugger": { pt: "Depurador", en: "Debugger" },
  "treino.exercises.title": { pt: "Exercícios", en: "Exercises" },
  "treino.exercises.counter": { pt: "{i} de {n}", en: "{i} of {n}" },
  "treino.exercises.prev": { pt: "Anterior", en: "Previous" },
  "treino.exercises.next": { pt: "Próximo", en: "Next" },
  "treino.exercises.yourAnswer": { pt: "Sua resposta", en: "Your answer" },
  "treino.exercises.clear": { pt: "Limpar", en: "Clear" },
  "treino.exercises.placeholder": { pt: "-- Escreva seu SQL aqui\nSELECT ...", en: "-- Write your SQL here\nSELECT ..." },
  "treino.exercises.showAnswer": { pt: "Ver gabarito", en: "Show answer" },
  "treino.exercises.hideAnswer": { pt: "Ocultar gabarito", en: "Hide answer" },
  "treino.exercises.answer": { pt: "Gabarito", en: "Answer" },

  // Levels
  "level.fácil": { pt: "fácil", en: "easy" },
  "level.médio": { pt: "médio", en: "medium" },
  "level.difícil": { pt: "difícil", en: "hard" },

  // Debugger view
  "debugger.title": { pt: "SQL Depurador", en: "SQL Debugger" },
  "debugger.subtitle": { pt: "Escreva uma query e veja a explicação cláusula por cláusula em tempo real.", en: "Write a query and see the clause-by-clause explanation in real time." },
  "debugger.label": { pt: "SQL", en: "SQL" },
  "debugger.clear": { pt: "Limpar", en: "Clear" },
  "debugger.autoExplain": { pt: "Explicação automática", en: "Automatic explanation" },
  "debugger.empty": { pt: "Digite uma query SQL para ver a explicação cláusula por cláusula.", en: "Type a SQL query to see the clause-by-clause explanation." },

  // ERD diagram
  "erd.title": { pt: "Schema E-commerce", en: "E-commerce Schema" },
  "erd.subtitle": { pt: "Diagrama ERD · 🔑 PK · 🔗 FK · passe o mouse para destacar relacionamentos", en: "ERD diagram · 🔑 PK · 🔗 FK · hover to highlight relationships" },
  "erd.goTo": { pt: "Vai para", en: "Go to" },
  "erd.relationships": { pt: "Relacionamentos", en: "Relationships" },
  "erd.tables": { pt: "Tabelas", en: "Tables" },
} satisfies Record<string, { pt: string; en: string }>;

export type DictKey = keyof typeof DICT;

interface I18nCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: DictKey, vars?: Record<string, string | number>) => string;
}

const Ctx = createContext<I18nCtx | null>(null);

function getInitialLang(): Lang {
  if (typeof window === "undefined") return "pt";
  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (saved === "pt" || saved === "en") return saved;
  const nav = window.navigator.language?.toLowerCase() ?? "";
  return nav.startsWith("en") ? "en" : "pt";
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("pt");

  // Hydrate from localStorage / navigator on the client (avoid SSR mismatch).
  useEffect(() => {
    setLangState(getInitialLang());
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, l);
      document.documentElement.lang = l;
    }
  };

  useEffect(() => {
    if (typeof document !== "undefined") document.documentElement.lang = lang;
  }, [lang]);

  const t = (key: DictKey, vars?: Record<string, string | number>) => {
    const entry = DICT[key];
    let str = entry?.[lang] ?? entry?.pt ?? String(key);
    if (vars) {
      for (const [k, v] of Object.entries(vars)) {
        str = str.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
      }
    }
    return str;
  };

  return <Ctx.Provider value={{ lang, setLang, t }}>{children}</Ctx.Provider>;
}

export function useI18n() {
  const ctx = useContext(Ctx);
  if (!ctx) {
    // Safe fallback so components don't crash if used outside provider.
    return {
      lang: "pt" as Lang,
      setLang: () => {},
      t: ((key: DictKey, vars?: Record<string, string | number>) => {
        const entry = DICT[key];
        let str = entry?.pt ?? String(key);
        if (vars) for (const [k, v] of Object.entries(vars)) str = str.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
        return str;
      }) as I18nCtx["t"],
    };
  }
  return ctx;
}

export function useT() {
  return useI18n().t;
}
