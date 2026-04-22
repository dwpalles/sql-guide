// English overlay for EXCEL_TO_SQL: descriptions + categories.
// Keyed by the Excel function name (uppercased). Falls back to PT when missing.

import type { Lang } from "@/i18n";
import { EXCEL_MAP, type ExcelMapping } from "@/data/excelToSql";

const CATEGORY_EN: Record<string, string> = {
  "Pesquisa": "Lookup",
  "Agregação": "Aggregation",
  "Agregação Condicional": "Conditional Aggregation",
  "Lógica": "Logic",
  "Texto": "Text",
  "Data/Hora": "Date/Time",
  "Matemática": "Math",
  "Janela": "Window",
  "Conjuntos": "Sets",
  "Pivot": "Pivot",
};

const DESC_EN: Record<string, string> = {
  // Lookup
  "VLOOKUP": "Looks up a value in another table and returns the corresponding column.",
  "HLOOKUP": "Equivalent to VLOOKUP but horizontal — in SQL it's a JOIN.",
  "XLOOKUP": "Advanced lookup with default return — equivalent to LEFT JOIN + COALESCE.",
  "INDEX/MATCH": "Classic lookup combo — in SQL it's a JOIN with ON.",
  "MATCH": "Finds the position of a value — in SQL filter with WHERE/IN.",
  "LOOKUP": "Old version of VLOOKUP — in SQL it's a JOIN.",
  "CHOOSE": "Picks a value from a list by index — in SQL use CASE.",
  // Aggregation
  "SUM": "Sums values of a column.",
  "AVERAGE": "Calculates the arithmetic mean of a column.",
  "COUNT": "Counts numbers (non-null) in a column.",
  "COUNTA": "Counts non-empty values — in SQL use COUNT(column).",
  "MAX": "Returns the largest value of a column.",
  "MIN": "Returns the smallest value of a column.",
  "MEDIAN": "Median — in SQL use PERCENTILE_CONT(0.5).",
  "STDEV": "Sample standard deviation.",
  "VAR": "Sample variance.",
  "PRODUCT": "Product of values — in SQL emulated with EXP(SUM(LN(x))).",
  // Conditional aggregation
  "SUMIF": "Sums values that match a criterion.",
  "SUMIFS": "Sum with multiple criteria.",
  "COUNTIF": "Counts rows that match a criterion.",
  "COUNTIFS": "Counts with multiple criteria.",
  "AVERAGEIF": "Conditional average.",
  "AVERAGEIFS": "Average with multiple criteria.",
  "MAXIFS": "Largest value with criteria.",
  "MINIFS": "Smallest value with criteria.",
  // Logic
  "IF": "Returns one of two values based on a condition.",
  "IFS": "Several chained conditions — CASE with multiple WHEN.",
  "AND": "Logical AND between conditions.",
  "OR": "Logical OR between conditions.",
  "NOT": "Negates a condition.",
  "IFERROR": "Returns an alternate value when there is an error/NULL.",
  "IFNA": "Returns alternate if #N/A — in SQL handles NULL.",
  "SWITCH": "Expression CASE — compares a value against several options.",
  // Text
  "CONCATENATE": "Joins texts into a single string.",
  "CONCAT": "Joins texts (modern version).",
  "TEXTJOIN": "Joins multiple values with a separator — in SQL it's STRING_AGG.",
  "LEFT": "Takes N characters from the left.",
  "RIGHT": "Takes N characters from the right.",
  "MID": "Extracts a substring starting at a position.",
  "LEN": "Number of characters in the string.",
  "UPPER": "Converts to uppercase.",
  "LOWER": "Converts to lowercase.",
  "PROPER": "Capitalizes the first letter of each word.",
  "TRIM": "Removes leading/trailing spaces.",
  "SUBSTITUTE": "Replaces occurrences of a text.",
  "REPLACE": "Replaces part of the text.",
  "FIND": "Locates the position of a text inside another.",
  "SEARCH": "Text search — in SQL use LIKE or INSTR.",
  "TEXT": "Formats a value as text.",
  // Date/Time
  "TODAY": "Current date (no time).",
  "NOW": "Current date and time.",
  "YEAR": "Extracts the year from a date.",
  "MONTH": "Extracts the month from a date.",
  "DAY": "Extracts the day from a date.",
  "DATEDIF": "Difference between two dates.",
  "EOMONTH": "Last day of the month.",
  "WEEKDAY": "Day of the week of a date.",
  "DATE": "Builds a date from parts.",
  // Math
  "ROUND": "Rounds a number to N decimal places.",
  "ROUNDUP": "Rounds up.",
  "ROUNDDOWN": "Rounds down.",
  "ABS": "Absolute value.",
  "MOD": "Division remainder.",
  "POWER": "Power.",
  "SQRT": "Square root.",
  "RAND": "Random number.",
  "INT": "Integer part of a number.",
  // Window / sets
  "RANK": "Position of a value — in SQL it's a window function.",
  "UNIQUE": "Unique values of a column.",
  "SORT": "Sorts results.",
  "FILTER": "Filters rows — in SQL it's WHERE.",
  // Pivot
  "PIVOT TABLE": "Pivot table — in SQL combines GROUP BY with CASE/PIVOT.",
};

export function excelDescription(m: ExcelMapping, lang: Lang): string {
  if (lang === "en") return DESC_EN[m.excel.toUpperCase()] ?? m.description;
  return m.description;
}

export function excelCategory(m: ExcelMapping, lang: Lang): string {
  if (lang === "en") return CATEGORY_EN[m.category] ?? m.category;
  return m.category;
}

export function excelMappingFor(token: string): ExcelMapping | undefined {
  return EXCEL_MAP[token];
}
