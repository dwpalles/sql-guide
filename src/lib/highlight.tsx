import React from "react";

const KEYWORDS = new Set([
  "SELECT","FROM","WHERE","AND","OR","NOT","NULL","IS","IN","BETWEEN","LIKE",
  "INSERT","INTO","VALUES","UPDATE","SET","DELETE","CREATE","TABLE","ALTER",
  "ADD","DROP","COLUMN","TRUNCATE","INDEX","UNIQUE","PRIMARY","KEY","FOREIGN",
  "REFERENCES","DEFAULT","JOIN","INNER","LEFT","RIGHT","FULL","OUTER","ON",
  "GROUP","BY","ORDER","ASC","DESC","HAVING","LIMIT","OFFSET","DISTINCT","AS",
  "CASE","WHEN","THEN","ELSE","END","UNION","ALL","WITH","EXISTS","CONFLICT",
  "DO","NOTHING","EXCLUDED","INTERVAL","FOR","IF",
]);

const FUNCTIONS = new Set([
  "COUNT","SUM","AVG","MIN","MAX","ROUND","CEIL","FLOOR","ABS","MOD",
  "CONCAT","UPPER","LOWER","SUBSTRING","LENGTH","NOW","CURRENT_DATE",
  "CURRENT_TIMESTAMP","EXTRACT","DATE_TRUNC","COALESCE","CAST",
]);

export function highlightSql(code: string): React.ReactNode {
  // Tokenize: comments, strings, numbers, identifiers, punctuation
  const tokens: React.ReactNode[] = [];
  const regex = /(--[^\n]*|'(?:''|[^'])*'|\b\d+(?:\.\d+)?\b|\b[A-Za-z_][A-Za-z0-9_]*\b|\s+|[^\s\w])/g;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = regex.exec(code)) !== null) {
    const t = match[0];
    if (t.startsWith("--")) {
      tokens.push(<span key={key++} className="sql-comment">{t}</span>);
    } else if (t.startsWith("'")) {
      tokens.push(<span key={key++} className="sql-string">{t}</span>);
    } else if (/^\d/.test(t)) {
      tokens.push(<span key={key++} className="sql-number">{t}</span>);
    } else if (/^[A-Za-z_]/.test(t)) {
      const upper = t.toUpperCase();
      if (KEYWORDS.has(upper)) {
        tokens.push(<span key={key++} className="sql-keyword">{t}</span>);
      } else if (FUNCTIONS.has(upper)) {
        tokens.push(<span key={key++} className="sql-function">{t}</span>);
      } else {
        tokens.push(<span key={key++}>{t}</span>);
      }
    } else {
      tokens.push(<span key={key++}>{t}</span>);
    }
  }
  return tokens;
}
