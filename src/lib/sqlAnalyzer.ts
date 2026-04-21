import { SQL_COMMANDS, type SqlCategory } from "@/data/sqlCommands";
import { SQL_ALIASES, type SqlAlias } from "@/data/sqlAliases";

export type TokenStatus = "valid" | "warning" | "invalid";

export interface AnalyzedToken {
  /** o que o usuário digitou (preserva caso) */
  raw: string;
  /** versão normalizada (UPPER) usada para matching */
  normalized: string;
  status: TokenStatus;
  /** mensagem curta explicando */
  message: string;
  /** categoria SQL quando válido */
  category?: SqlCategory;
  /** comandos relacionados / substitutos sugeridos */
  suggestions: string[];
  /** origem (Excel, DOS...) quando aplicável */
  origin?: string;
}

// Stop-words que ignoramos no analisador (identificadores, números, conectores)
const IGNORED = new Set([
  "*", "AS", "ON", "AND", "OR", "NOT", "NULL", "IS", "TRUE", "FALSE",
  "BY", "TO", "THE", "A", "AN",
]);

// Multi-word patterns importantes que devem ser detectados antes do split simples
const MULTI_WORD_COMMANDS = SQL_COMMANDS
  .map((c) => c.name.toUpperCase())
  .filter((n) => n.includes(" "))
  .sort((a, b) => b.length - a.length); // maiores primeiro

const COMMAND_INDEX = new Map<string, (typeof SQL_COMMANDS)[number]>();
for (const cmd of SQL_COMMANDS) {
  COMMAND_INDEX.set(cmd.name.toUpperCase(), cmd);
}

const ALIAS_INDEX = new Map<string, SqlAlias>();
for (const alias of SQL_ALIASES) {
  ALIAS_INDEX.set(alias.term.toUpperCase(), alias);
}

/**
 * Sugere comandos relacionados quando algo não bate.
 * Prioriza correspondências por prefixo / substring.
 */
function suggestSimilar(token: string): string[] {
  const t = token.toUpperCase();
  const matches: { name: string; score: number }[] = [];
  for (const cmd of SQL_COMMANDS) {
    const name = cmd.name.toUpperCase();
    if (name === t) continue;
    if (name.startsWith(t) || t.startsWith(name)) {
      matches.push({ name: cmd.name, score: 3 });
    } else if (name.includes(t) || t.includes(name)) {
      matches.push({ name: cmd.name, score: 2 });
    } else if (levenshtein(t, name) <= 2) {
      matches.push({ name: cmd.name, score: 1 });
    }
  }
  matches.sort((a, b) => b.score - a.score);
  return matches.slice(0, 3).map((m) => m.name);
}

function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  const v0 = new Array(b.length + 1);
  const v1 = new Array(b.length + 1);
  for (let i = 0; i <= b.length; i++) v0[i] = i;
  for (let i = 0; i < a.length; i++) {
    v1[0] = i + 1;
    for (let j = 0; j < b.length; j++) {
      const cost = a[i] === b[j] ? 0 : 1;
      v1[j + 1] = Math.min(v1[j] + 1, v0[j + 1] + 1, v0[j] + cost);
    }
    for (let j = 0; j <= b.length; j++) v0[j] = v1[j];
  }
  return v1[b.length];
}

/**
 * Tokeniza removendo strings, comentários e números.
 * Junta palavras-chave compostas (LEFT JOIN, GROUP BY, ORDER BY, etc.).
 */
function tokenize(input: string): string[] {
  // Remove comentários e strings
  const clean = input
    .replace(/--[^\n]*/g, " ")
    .replace(/\/\*[\s\S]*?\*\//g, " ")
    .replace(/'(?:''|[^'])*'/g, " '_str_' ")
    .replace(/"(?:[^"])*"/g, " ");

  // Pega apenas identificadores (palavras) — ignora números puros e pontuação
  const rawTokens = clean.match(/[A-Za-z_][A-Za-z0-9_]*\(?\)?|\*/g) ?? [];

  // Tenta juntar pares conhecidos (LEFT JOIN, GROUP BY...)
  const result: string[] = [];
  let i = 0;
  while (i < rawTokens.length) {
    const t = rawTokens[i].toUpperCase().replace(/\(\)?$/, "");
    let matched = false;
    for (const phrase of MULTI_WORD_COMMANDS) {
      const parts = phrase.split(" ");
      if (parts.length > rawTokens.length - i) continue;
      const candidate = rawTokens
        .slice(i, i + parts.length)
        .map((x) => x.toUpperCase().replace(/\(\)?$/, ""))
        .join(" ");
      if (candidate === phrase) {
        result.push(phrase);
        i += parts.length;
        matched = true;
        break;
      }
    }
    if (!matched) {
      result.push(t);
      i++;
    }
  }
  return result;
}

export interface AnalysisResult {
  tokens: AnalyzedToken[];
  counts: { valid: number; warning: number; invalid: number; total: number };
}

export function analyzeSql(input: string): AnalysisResult {
  const tokens = tokenize(input);
  const seen = new Set<string>();
  const result: AnalyzedToken[] = [];

  for (const tok of tokens) {
    if (!tok || IGNORED.has(tok)) continue;
    // dedupe por palavra normalizada
    if (seen.has(tok)) continue;
    seen.add(tok);

    const upper = tok.toUpperCase();

    // 1. Comando SQL conhecido?
    const cmd = COMMAND_INDEX.get(upper);
    if (cmd) {
      result.push({
        raw: tok,
        normalized: upper,
        status: "valid",
        message: cmd.description,
        category: cmd.category,
        suggestions: [],
      });
      continue;
    }

    // 2. Alias conhecido (Excel, DOS, etc.)?
    const alias = ALIAS_INDEX.get(upper);
    if (alias) {
      result.push({
        raw: tok,
        normalized: upper,
        status: "invalid",
        message: alias.message,
        suggestions: alias.suggestions,
        origin: alias.origin,
      });
      continue;
    }

    // 3. Parece identificador (nome de tabela/coluna)? — ignora silenciosamente.
    // Heurística: contém underscore ou está em minúsculas → provavelmente identificador.
    if (/_/.test(tok) || tok === tok.toLowerCase()) {
      continue;
    }

    // 4. Token desconhecido em CAIXA ALTA → suspeito
    const similar = suggestSimilar(upper);
    if (similar.length > 0) {
      result.push({
        raw: tok,
        normalized: upper,
        status: "warning",
        message: `"${tok}" não é reconhecido. Você quis dizer:`,
        suggestions: similar,
      });
    } else {
      result.push({
        raw: tok,
        normalized: upper,
        status: "invalid",
        message: `"${tok}" não foi reconhecido como comando SQL.`,
        suggestions: [],
      });
    }
  }

  const counts = {
    valid: result.filter((r) => r.status === "valid").length,
    warning: result.filter((r) => r.status === "warning").length,
    invalid: result.filter((r) => r.status === "invalid").length,
    total: result.length,
  };

  return { tokens: result, counts };
}
