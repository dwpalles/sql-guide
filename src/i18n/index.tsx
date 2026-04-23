import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "pt" | "en" | "es" | "fr";

const STORAGE_KEY = "sqlref.lang";

// Centralized UI dictionary. Keys are stable; values are per-language strings.
// Supports {placeholder} interpolation via the second arg of t().
const DICT = {
  // Header / nav
  "nav.codigos": { pt: "CÓDIGOS", en: "CODES", es: "CÓDIGOS", fr: "CODES" },
  "nav.treino": { pt: "Treino", en: "Training", es: "Entrenamiento", fr: "Entraînement" },
  "header.tagline": {
    pt: "Referência completa · 22 grupos · ~220 comandos",
    en: "Complete reference · 22 groups · ~220 commands",
    es: "Referencia completa · 22 grupos · ~220 comandos",
    fr: "Référence complète · 22 groupes · ~220 commandes",
  },
  "footer.main": {
    pt: "SQL.ref · Construído para estudo e referência rápida",
    en: "SQL.ref · Built for study and quick reference",
    es: "SQL.ref · Construido para estudio y referencia rápida",
    fr: "SQL.ref · Conçu pour l'étude et la référence rapide",
  },
  "footer.treino": {
    pt: "SQL.ref · TREINO · Pratique queries no schema de referência",
    en: "SQL.ref · TRAINING · Practice queries on the reference schema",
    es: "SQL.ref · ENTRENAMIENTO · Practica consultas en el esquema de referencia",
    fr: "SQL.ref · ENTRAÎNEMENT · Pratiquez des requêtes sur le schéma de référence",
  },
  "footer.developedBy": {
    pt: "Desenvolvido por",
    en: "Developed by",
    es: "Desarrollado por",
    fr: "Développé par",
  },

  // 404
  "404.title": {
    pt: "Página não encontrada",
    en: "Page not found",
    es: "Página no encontrada",
    fr: "Page introuvable",
  },
  "404.desc": {
    pt: "A página que você procura não existe ou foi movida.",
    en: "The page you're looking for doesn't exist or has been moved.",
    es: "La página que buscas no existe o ha sido movida.",
    fr: "La page que vous cherchez n'existe pas ou a été déplacée.",
  },
  "404.home": {
    pt: "Ir para o início",
    en: "Go home",
    es: "Ir al inicio",
    fr: "Aller à l'accueil",
  },

  // Lang toggle
  "lang.toggle.label": { pt: "Idioma", en: "Language", es: "Idioma", fr: "Langue" },

  // Sidebar / categories
  "sidebar.categories": { pt: "Categorias", en: "Categories", es: "Categorías", fr: "Catégories" },
  "sidebar.sqlDoctor": { pt: "SQL DOCTOR", en: "SQL DOCTOR", es: "SQL DOCTOR", fr: "SQL DOCTOR" },
  "sidebar.excelToSql": { pt: "EXCEL → SQL", en: "EXCEL → SQL", es: "EXCEL → SQL", fr: "EXCEL → SQL" },
  "sidebar.favorites": { pt: "Favoritos", en: "Favorites", es: "Favoritos", fr: "Favoris" },
  "favorites.empty": {
    pt: "Nenhum favorito ainda. Toque no ♥ ao lado de um comando para favoritá-lo.",
    en: "No favorites yet. Tap the ♥ next to a command to favorite it.",
    es: "Sin favoritos aún. Toca el ♥ junto a un comando para añadirlo.",
    fr: "Aucun favori. Touchez le ♥ à côté d'une commande pour l'ajouter.",
  },
  "favorites.title": { pt: "Favoritos", en: "Favorites", es: "Favoritos", fr: "Favoris" },
  "nav.sql": { pt: "SQL", en: "SQL", es: "SQL", fr: "SQL" },
  "sql.all.title": {
    pt: "Todos os comandos SQL",
    en: "All SQL commands",
    es: "Todos los comandos SQL",
    fr: "Toutes les commandes SQL",
  },
  "sql.all.subtitle": {
    pt: "Lista única, A→Z. Toque no ♥ para favoritar.",
    en: "Single list, A→Z. Tap ♥ to favorite.",
    es: "Lista única, A→Z. Toca ♥ para añadir.",
    fr: "Liste unique, A→Z. Touchez ♥ pour ajouter.",
  },

  // Schema panel
  "schema.toggle": {
    pt: "Schema E-commerce",
    en: "E-commerce Schema",
    es: "Esquema E-commerce",
    fr: "Schéma E-commerce",
  },
  "schema.title": {
    pt: "🗄️ Banco de referência — E-commerce",
    en: "🗄️ Reference database — E-commerce",
    es: "🗄️ Base de datos de referencia — E-commerce",
    fr: "🗄️ Base de données de référence — E-commerce",
  },
  "schema.subtitle": {
    pt: "(todos os exemplos usam este schema)",
    en: "(all examples use this schema)",
    es: "(todos los ejemplos usan este esquema)",
    fr: "(tous les exemples utilisent ce schéma)",
  },
  "schema.legend": {
    pt: "🔑 pk = chave primária · 🔗 fk = chave estrangeira",
    en: "🔑 pk = primary key · 🔗 fk = foreign key",
    es: "🔑 pk = clave primaria · 🔗 fk = clave foránea",
    fr: "🔑 pk = clé primaire · 🔗 fk = clé étrangère",
  },

  // Reference table
  "table.command": { pt: "Comando", en: "Command", es: "Comando", fr: "Commande" },
  "table.description": { pt: "Descrição", en: "Description", es: "Descripción", fr: "Description" },
  "table.example": { pt: "Exemplo", en: "Example", es: "Ejemplo", fr: "Exemple" },

  // Excel → SQL panel
  "excel.title": { pt: "Excel → SQL", en: "Excel → SQL", es: "Excel → SQL", fr: "Excel → SQL" },
  "excel.subtitle": {
    pt: "{n} funções do Excel mapeadas para o equivalente SQL.",
    en: "{n} Excel functions mapped to their SQL equivalent.",
    es: "{n} funciones de Excel mapeadas a su equivalente SQL.",
    fr: "{n} fonctions Excel mappées vers leur équivalent SQL.",
  },
  "excel.top": {
    pt: "= entre as 20 mais usadas (no topo).",
    en: "= among the top 20 most used (at the top).",
    es: "= entre las 20 más usadas (arriba).",
    fr: "= parmi les 20 les plus utilisées (en haut).",
  },
  "excel.col.excel": { pt: "Excel", en: "Excel", es: "Excel", fr: "Excel" },
  "excel.col.sql": { pt: "SQL", en: "SQL", es: "SQL", fr: "SQL" },
  "excel.col.descExample": {
    pt: "Descrição & exemplo",
    en: "Description & example",
    es: "Descripción y ejemplo",
    fr: "Description et exemple",
  },

  // Analyzer panel
  "analyzer.title": {
    pt: "⌥ Analisador de SQL",
    en: "⌥ SQL Analyzer",
    es: "⌥ Analizador de SQL",
    fr: "⌥ Analyseur SQL",
  },
  "analyzer.intro": {
    pt: "Cole ou digite qualquer código SQL — cada comando é identificado, verificado e relacionado ao material acima. Variantes de outros dialetos (SQL Server, Oracle…), termos inválidos e funções do Excel (com equivalente SQL) também são detectados.",
    en: "Paste or type any SQL — each command is identified, verified, and linked to the material above. Variants from other dialects (SQL Server, Oracle…), invalid terms, and Excel functions (with SQL equivalents) are also detected.",
    es: "Pega o escribe cualquier código SQL — cada comando es identificado, verificado y relacionado con el material de arriba. También se detectan variantes de otros dialectos (SQL Server, Oracle…), términos inválidos y funciones de Excel (con equivalente SQL).",
    fr: "Collez ou tapez n'importe quel code SQL — chaque commande est identifiée, vérifiée et reliée au contenu ci-dessus. Les variantes d'autres dialectes (SQL Server, Oracle…), les termes invalides et les fonctions Excel (avec équivalent SQL) sont également détectés.",
  },
  "analyzer.placeholder": {
    pt: "Cole sua query ou digite uma função Excel (VLOOKUP, SUMIF, COUNTIF…)\nEx: SELECT nome, MAX(preco) FROM produtos WHERE estoque > 0 GROUP BY id_categoria HAVING COUNT(*) > 2 ORDER BY preco DESC LIMIT 5;",
    en: "Paste your query or type an Excel function (VLOOKUP, SUMIF, COUNTIF…)\nEx: SELECT nome, MAX(preco) FROM produtos WHERE estoque > 0 GROUP BY id_categoria HAVING COUNT(*) > 2 ORDER BY preco DESC LIMIT 5;",
    es: "Pega tu consulta o escribe una función de Excel (VLOOKUP, SUMIF, COUNTIF…)\nEj: SELECT nome, MAX(preco) FROM produtos WHERE estoque > 0 GROUP BY id_categoria HAVING COUNT(*) > 2 ORDER BY preco DESC LIMIT 5;",
    fr: "Collez votre requête ou tapez une fonction Excel (VLOOKUP, SUMIF, COUNTIF…)\nEx : SELECT nome, MAX(preco) FROM produtos WHERE estoque > 0 GROUP BY id_categoria HAVING COUNT(*) > 2 ORDER BY preco DESC LIMIT 5;",
  },
  "analyzer.stepByStep": {
    pt: "Explicação passo a passo",
    en: "Step-by-step explanation",
    es: "Explicación paso a paso",
    fr: "Explication étape par étape",
  },
  "analyzer.clauses": {
    pt: "{n} cláusula{s}",
    en: "{n} clause{s}",
    es: "{n} cláusula{s}",
    fr: "{n} clause{s}",
  },
  "analyzer.empty": {
    pt: "Comece a digitar uma query (SELECT, INSERT, UPDATE, DELETE, CREATE…) e cada cláusula será explicada aqui automaticamente, com contexto do schema e-commerce.",
    en: "Start typing a query (SELECT, INSERT, UPDATE, DELETE, CREATE…) and each clause will be explained here automatically, with context from the e-commerce schema.",
    es: "Comienza a escribir una consulta (SELECT, INSERT, UPDATE, DELETE, CREATE…) y cada cláusula se explicará aquí automáticamente, con contexto del esquema e-commerce.",
    fr: "Commencez à taper une requête (SELECT, INSERT, UPDATE, DELETE, CREATE…) et chaque clause sera expliquée ici automatiquement, avec le contexte du schéma e-commerce.",
  },
  "analyzer.analyze": { pt: "Analisar", en: "Analyze", es: "Analizar", fr: "Analyser" },
  "analyzer.clear": { pt: "Limpar", en: "Clear", es: "Limpiar", fr: "Effacer" },
  "analyzer.identified": {
    pt: "{n} identificados:",
    en: "{n} identified:",
    es: "{n} identificados:",
    fr: "{n} identifiés :",
  },
  "analyzer.noResults": {
    pt: "Nenhum comando SQL ou função Excel conhecido identificado. Tenta colar uma query ou uma função como",
    en: "No known SQL command or Excel function identified. Try pasting a query or a function like",
    es: "No se identificó ningún comando SQL o función de Excel conocido. Intenta pegar una consulta o una función como",
    fr: "Aucune commande SQL ou fonction Excel connue identifiée. Essayez de coller une requête ou une fonction telle que",
  },
  "analyzer.col.status": {
    pt: "Status / Seção",
    en: "Status / Section",
    es: "Estado / Sección",
    fr: "Statut / Section",
  },
  "analyzer.col.command": { pt: "Comando", en: "Command", es: "Comando", fr: "Commande" },
  "analyzer.col.related": {
    pt: "Relacionados / Sugestões",
    en: "Related / Suggestions",
    es: "Relacionados / Sugerencias",
    fr: "Apparentés / Suggestions",
  },
  "analyzer.use": { pt: "use", en: "use", es: "usa", fr: "utilisez" },
  "analyzer.sqlEquivalent": {
    pt: "equivalente SQL:",
    en: "SQL equivalent:",
    es: "equivalente SQL:",
    fr: "équivalent SQL :",
  },
  "analyzer.section": { pt: "Seção", en: "Section", es: "Sección", fr: "Section" },
  "analyzer.notRecognized": {
    pt: "Não foi reconhecido como comando SQL conhecido.",
    en: "Not recognized as a known SQL command.",
    es: "No se reconoce como un comando SQL conocido.",
    fr: "Non reconnu comme une commande SQL connue.",
  },
  "analyzer.top20": { pt: "Top 20", en: "Top 20", es: "Top 20", fr: "Top 20" },

  // Status labels
  "status.ok": { pt: "Válido", en: "Valid", es: "Válido", fr: "Valide" },
  "status.warn": { pt: "Variante", en: "Variant", es: "Variante", fr: "Variante" },
  "status.invalid": { pt: "Inválido", en: "Invalid", es: "Inválido", fr: "Invalide" },
  "status.unknown": { pt: "Desconhecido", en: "Unknown", es: "Desconocido", fr: "Inconnu" },
  "status.excel": { pt: "Excel → SQL", en: "Excel → SQL", es: "Excel → SQL", fr: "Excel → SQL" },

  // Treino tabs / panel
  "treino.tab.exercises": { pt: "Exercícios", en: "Exercises", es: "Ejercicios", fr: "Exercices" },
  "treino.tab.debugger": { pt: "Depurador", en: "Debugger", es: "Depurador", fr: "Débogueur" },
  "treino.exercises.title": { pt: "Exercícios", en: "Exercises", es: "Ejercicios", fr: "Exercices" },
  "treino.exercises.counter": {
    pt: "{i} de {n}",
    en: "{i} of {n}",
    es: "{i} de {n}",
    fr: "{i} sur {n}",
  },
  "treino.exercises.prev": { pt: "Anterior", en: "Previous", es: "Anterior", fr: "Précédent" },
  "treino.exercises.next": { pt: "Próximo", en: "Next", es: "Siguiente", fr: "Suivant" },
  "treino.exercises.yourAnswer": {
    pt: "Sua resposta",
    en: "Your answer",
    es: "Tu respuesta",
    fr: "Votre réponse",
  },
  "treino.exercises.clear": { pt: "Limpar", en: "Clear", es: "Limpiar", fr: "Effacer" },
  "treino.exercises.placeholder": {
    pt: "-- Escreva seu SQL aqui\nSELECT ...",
    en: "-- Write your SQL here\nSELECT ...",
    es: "-- Escribe tu SQL aquí\nSELECT ...",
    fr: "-- Écrivez votre SQL ici\nSELECT ...",
  },
  "treino.exercises.showAnswer": {
    pt: "Ver gabarito",
    en: "Show answer",
    es: "Ver solución",
    fr: "Voir la solution",
  },
  "treino.exercises.hideAnswer": {
    pt: "Ocultar gabarito",
    en: "Hide answer",
    es: "Ocultar solución",
    fr: "Masquer la solution",
  },
  "treino.exercises.answer": { pt: "Gabarito", en: "Answer", es: "Solución", fr: "Solution" },

  // Levels
  "level.fácil": { pt: "fácil", en: "easy", es: "fácil", fr: "facile" },
  "level.médio": { pt: "médio", en: "medium", es: "medio", fr: "moyen" },
  "level.difícil": { pt: "difícil", en: "hard", es: "difícil", fr: "difficile" },

  // Debugger view
  "debugger.title": {
    pt: "SQL Depurador",
    en: "SQL Debugger",
    es: "Depurador SQL",
    fr: "Débogueur SQL",
  },
  "debugger.subtitle": {
    pt: "Escreva uma query e veja a explicação cláusula por cláusula em tempo real.",
    en: "Write a query and see the clause-by-clause explanation in real time.",
    es: "Escribe una consulta y mira la explicación cláusula por cláusula en tiempo real.",
    fr: "Écrivez une requête et voyez l'explication clause par clause en temps réel.",
  },
  "debugger.label": { pt: "SQL", en: "SQL", es: "SQL", fr: "SQL" },
  "debugger.clear": { pt: "Limpar", en: "Clear", es: "Limpiar", fr: "Effacer" },
  "debugger.autoExplain": {
    pt: "Explicação automática",
    en: "Automatic explanation",
    es: "Explicación automática",
    fr: "Explication automatique",
  },
  "debugger.empty": {
    pt: "Digite uma query SQL para ver a explicação cláusula por cláusula.",
    en: "Type a SQL query to see the clause-by-clause explanation.",
    es: "Escribe una consulta SQL para ver la explicación cláusula por cláusula.",
    fr: "Tapez une requête SQL pour voir l'explication clause par clause.",
  },

  // ERD diagram
  "erd.title": {
    pt: "Schema E-commerce",
    en: "E-commerce Schema",
    es: "Esquema E-commerce",
    fr: "Schéma E-commerce",
  },
  "erd.subtitle": {
    pt: "Diagrama ERD · 🔑 PK · 🔗 FK · passe o mouse para destacar relacionamentos",
    en: "ERD diagram · 🔑 PK · 🔗 FK · hover to highlight relationships",
    es: "Diagrama ERD · 🔑 PK · 🔗 FK · pasa el ratón para destacar relaciones",
    fr: "Diagramme ERD · 🔑 PK · 🔗 FK · survolez pour mettre en évidence les relations",
  },
  "erd.goTo": { pt: "Vai para", en: "Go to", es: "Va a", fr: "Va à" },
  "erd.relationships": {
    pt: "Relacionamentos",
    en: "Relationships",
    es: "Relaciones",
    fr: "Relations",
  },
  "erd.tables": { pt: "Tabelas", en: "Tables", es: "Tablas", fr: "Tables" },
} satisfies Record<string, { pt: string; en: string; es: string; fr: string }>;

export type DictKey = keyof typeof DICT;

interface I18nCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: DictKey, vars?: Record<string, string | number>) => string;
}

const Ctx = createContext<I18nCtx | null>(null);

const ALL_LANGS: Lang[] = ["pt", "en", "es", "fr"];
function isLang(v: string | null | undefined): v is Lang {
  return !!v && (ALL_LANGS as string[]).includes(v);
}

function getInitialLang(): Lang {
  if (typeof window === "undefined") return "pt";
  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (isLang(saved)) return saved;
  const nav = window.navigator.language?.toLowerCase() ?? "";
  if (nav.startsWith("en")) return "en";
  if (nav.startsWith("es")) return "es";
  if (nav.startsWith("fr")) return "fr";
  return "pt";
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
