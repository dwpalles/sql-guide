import {
  CMD_INFO,
  VARIANTS_MAP,
  INVALID_MAP,
  RELATED_MAP,
  MULTI_PATTERNS,
} from "@/data/sqlAnalyzerData";
import { EXCEL_MAP, type ExcelMapping } from "@/data/excelToSql";

export type TokenStatus = "ok" | "warn" | "invalid" | "unknown" | "excel";

export interface AnalyzedToken {
  /** the canonical token, normalized to UPPER */
  token: string;
  status: TokenStatus;
  /** section label (e.g. "DDL") for valid commands */
  section?: string;
  /** group id (e.g. "ddl") for jump-to-section links */
  groupId?: string;
  /** for warnings: canonical equivalent and explanation */
  canonical?: string;
  note?: string;
  /** for invalid: human-readable reason */
  reason?: string;
  /** related commands or suggestions */
  related: string[];
  /** when status === "excel": full mapping info */
  excel?: ExcelMapping;
}

export interface AnalysisResult {
  tokens: AnalyzedToken[];
  counts: { ok: number; warn: number; invalid: number; unknown: number; total: number };
}

/**
 * Tokenize a SQL string against the known multi-word patterns and single
 * keywords. Mirrors the logic from SQL_Referencia.html so behaviour matches
 * the user's local reference tool exactly.
 */
function tokenizeSQL(input: string): string[] {
  // Strip strings and line comments, then uppercase.
  let sql = input.replace(/'[^']*'/g, "").replace(/"[^"]*"/g, "");
  sql = sql.replace(/--[^\n]*/g, "");
  sql = sql.toUpperCase();

  const words = sql.split(/[\s,;()\[\]=<>!+\-*/\\.\n\r\t]+/).filter((w) => w.length > 1);
  const found: string[] = [];
  const used = new Set<string>();
  let i = 0;
  while (i < words.length) {
    let matched = false;
    for (const pat of MULTI_PATTERNS) {
      const parts = pat.split(" ");
      if (parts.length > 1 && i + parts.length <= words.length) {
        const candidate = parts.map((_, k) => words[i + k]).join(" ");
        if (candidate === pat) {
          if (!used.has(pat)) {
            found.push(pat);
            used.add(pat);
          }
          i += parts.length;
          matched = true;
          break;
        }
      }
    }
    if (!matched) {
      const w = words[i];
      if (!used.has(w)) {
        if (CMD_INFO[w] || VARIANTS_MAP[w] || INVALID_MAP[w] || EXCEL_MAP[w]) {
          found.push(w);
          used.add(w);
        }
      }
      i++;
    }
  }
  return found;
}

export function analyzeSql(input: string): AnalysisResult {
  const tokens = tokenizeSQL(input);
  const result: AnalyzedToken[] = tokens.map((t) => {
    const cmd = CMD_INFO[t];
    if (cmd) {
      return {
        token: t,
        status: "ok",
        section: cmd.section,
        groupId: cmd.id,
        related: RELATED_MAP[t] ?? [],
      };
    }
    const variant = VARIANTS_MAP[t];
    if (variant) {
      return {
        token: t,
        status: "warn",
        canonical: variant.canonical,
        note: variant.note,
        groupId: variant.id,
        related: RELATED_MAP[variant.canonical] ?? [],
      };
    }
    const invalid = INVALID_MAP[t];
    if (invalid) {
      return {
        token: t,
        status: "invalid",
        reason: invalid.reason,
        related: invalid.suggest ?? [],
      };
    }
    const xl = EXCEL_MAP[t];
    if (xl) {
      return {
        token: t,
        status: "excel",
        excel: xl,
        related: [xl.sql],
      };
    }
    return { token: t, status: "unknown", related: [] };
  });

  const counts = {
    ok: result.filter((r) => r.status === "ok").length,
    warn: result.filter((r) => r.status === "warn").length,
    invalid: result.filter((r) => r.status === "invalid").length,
    unknown: result.filter((r) => r.status === "unknown").length,
    excel: result.filter((r) => r.status === "excel").length,
    total: result.length,
  };
  return { tokens: result, counts };
}

/** Helper used by UI to find which group a related/canonical command lives in. */
export function findGroupIdForCommand(name: string): string | undefined {
  return CMD_INFO[name]?.id ?? VARIANTS_MAP[name]?.id;
}
