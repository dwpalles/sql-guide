// Dicionário inicial de termos comuns de Excel / DOS / outras linguagens
// que NÃO são SQL válido — mapeados para os comandos SQL equivalentes.
// Para popular: adicione mais entradas aqui (case-insensitive na busca).

export interface SqlAlias {
  /** termo "errado" (Excel, DOS, BASIC, etc.) */
  term: string;
  /** de onde vem */
  origin: string;
  /** explicação curta */
  message: string;
  /** comandos SQL sugeridos (devem existir em SQL_COMMANDS para virar link) */
  suggestions: string[];
}

export const SQL_ALIASES: SqlAlias[] = [
  {
    term: "FIND",
    origin: "Excel / busca genérica",
    message: "SQL não tem FIND — use SELECT + WHERE para buscar registros.",
    suggestions: ["WHERE", "IN", "LIKE", "EXISTS"],
  },
  {
    term: "VLOOKUP",
    origin: "Excel",
    message: "Para cruzar dados entre tabelas, use JOIN.",
    suggestions: ["JOIN", "LEFT JOIN", "INNER JOIN"],
  },
  {
    term: "HLOOKUP",
    origin: "Excel",
    message: "SQL não tem busca horizontal — modele os dados em colunas e use JOIN.",
    suggestions: ["JOIN", "INNER JOIN"],
  },
  {
    term: "XLOOKUP",
    origin: "Excel",
    message: "Use JOIN com a chave de relacionamento.",
    suggestions: ["JOIN", "LEFT JOIN"],
  },
  {
    term: "SUMIF",
    origin: "Excel",
    message: "Combine SUM com WHERE (e GROUP BY se houver categorias).",
    suggestions: ["SUM", "WHERE", "GROUP BY"],
  },
  {
    term: "SUMIFS",
    origin: "Excel",
    message: "SUM com múltiplas condições no WHERE.",
    suggestions: ["SUM", "WHERE", "AND"],
  },
  {
    term: "COUNTIF",
    origin: "Excel",
    message: "Use COUNT com WHERE.",
    suggestions: ["COUNT", "WHERE"],
  },
  {
    term: "COUNTIFS",
    origin: "Excel",
    message: "COUNT com múltiplas condições no WHERE.",
    suggestions: ["COUNT", "WHERE", "AND"],
  },
  {
    term: "AVERAGEIF",
    origin: "Excel",
    message: "Use AVG com WHERE.",
    suggestions: ["AVG", "WHERE"],
  },
  {
    term: "IF",
    origin: "Excel / programação",
    message: "Em SELECT use CASE WHEN. Em procedures use IF...THEN.",
    suggestions: ["CASE", "COALESCE", "IFNULL"],
  },
  {
    term: "IFS",
    origin: "Excel",
    message: "Use CASE WHEN ... THEN ... ELSE ... END.",
    suggestions: ["CASE"],
  },
  {
    term: "CONCATENATE",
    origin: "Excel",
    message: "Use a função CONCAT() ou o operador ||.",
    suggestions: ["CONCAT"],
  },
  {
    term: "LEFT",
    origin: "Excel / função de string",
    message: "Em SQL use SUBSTRING(col, 1, n) — LEFT também é palavra-chave de JOIN.",
    suggestions: ["SUBSTRING", "LEFT JOIN"],
  },
  {
    term: "RIGHT",
    origin: "Excel / função de string",
    message: "Em SQL use SUBSTRING — RIGHT também é palavra-chave de JOIN.",
    suggestions: ["SUBSTRING", "RIGHT JOIN"],
  },
  {
    term: "MID",
    origin: "Excel / BASIC",
    message: "Use SUBSTRING(col, inicio, tamanho).",
    suggestions: ["SUBSTRING"],
  },
  {
    term: "LEN",
    origin: "Excel / VBA",
    message: "Use LENGTH() (ou CHAR_LENGTH em alguns dialetos).",
    suggestions: ["LENGTH"],
  },
  {
    term: "TRIM",
    origin: "Excel",
    message: "TRIM existe em SQL — verifique a sintaxe do seu dialeto.",
    suggestions: ["UPPER", "LOWER"],
  },
  {
    term: "TODAY",
    origin: "Excel",
    message: "Use CURRENT_DATE ou CURDATE().",
    suggestions: ["CURRENT_DATE", "NOW"],
  },
  {
    term: "ISNUMBER",
    origin: "Excel",
    message: "Não há equivalente direto — use CAST/regex ou TRY_CAST.",
    suggestions: ["CAST", "CASE"],
  },
  {
    term: "DIR",
    origin: "DOS / Shell",
    message: "Para listar tabelas use SHOW TABLES (MySQL) ou consulte information_schema.",
    suggestions: ["SHOW TABLES", "DESCRIBE"],
  },
  {
    term: "TYPE",
    origin: "DOS",
    message: "Para ver dados use SELECT * FROM tabela.",
    suggestions: ["SELECT", "DESCRIBE"],
  },
  {
    term: "DEL",
    origin: "DOS",
    message: "Para apagar registros use DELETE; para apagar tabela use DROP TABLE.",
    suggestions: ["DELETE", "DROP TABLE", "TRUNCATE"],
  },
  {
    term: "COPY",
    origin: "DOS",
    message: "Para copiar dados use INSERT INTO ... SELECT.",
    suggestions: ["INSERT INTO", "CREATE TABLE"],
  },
  {
    term: "PRINT",
    origin: "BASIC / T-SQL",
    message: "Em SQL padrão use SELECT para retornar valores.",
    suggestions: ["SELECT"],
  },
  {
    term: "FOR",
    origin: "Programação imperativa",
    message: "SQL é declarativo — pense em conjuntos. Use SELECT/JOIN/GROUP BY.",
    suggestions: ["SELECT", "JOIN", "GROUP BY"],
  },
  {
    term: "WHILE",
    origin: "Programação imperativa",
    message: "Em SQL padrão evite loops — use operações em conjunto. WHILE existe em procedures.",
    suggestions: ["SELECT", "WITH RECURSIVE"],
  },
];
