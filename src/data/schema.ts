// E-commerce reference schema used by every example in SQL_GROUPS.
// Technical names (table/column identifiers) are kept as-is in Portuguese
// because they represent the actual database schema. Optional `label_*` and
// `desc_*` fields provide localized human-readable descriptions surfaced as
// tooltips/legends in the ERD and reference panels.
export interface SchemaColumn {
  name: string;
  kind?: "pk" | "fk";
  label_pt?: string;
  label_en?: string;
}
export interface SchemaTable {
  name: string;
  label_pt?: string;
  label_en?: string;
  desc_pt?: string;
  desc_en?: string;
  columns: SchemaColumn[];
}

export const SCHEMA_TABLES: SchemaTable[] = [
  {
    name: "clientes",
    label_pt: "Clientes",
    label_en: "Customers",
    desc_pt: "Cadastro de clientes da loja.",
    desc_en: "Store customer registry.",
    columns: [
      { name: "id", kind: "pk", label_pt: "Identificador único", label_en: "Unique identifier" },
      { name: "nome", label_pt: "Nome completo", label_en: "Full name" },
      { name: "email", label_pt: "E-mail", label_en: "Email" },
      { name: "cidade", label_pt: "Cidade", label_en: "City" },
      { name: "estado", label_pt: "Estado / UF", label_en: "State" },
      { name: "data_cadastro", label_pt: "Data de cadastro", label_en: "Signup date" },
    ],
  },
  {
    name: "categorias",
    label_pt: "Categorias",
    label_en: "Categories",
    desc_pt: "Categorias de produtos.",
    desc_en: "Product categories.",
    columns: [
      { name: "id", kind: "pk", label_pt: "Identificador único", label_en: "Unique identifier" },
      { name: "nome", label_pt: "Nome da categoria", label_en: "Category name" },
    ],
  },
  {
    name: "produtos",
    label_pt: "Produtos",
    label_en: "Products",
    desc_pt: "Catálogo de produtos disponíveis.",
    desc_en: "Available product catalog.",
    columns: [
      { name: "id", kind: "pk", label_pt: "Identificador único", label_en: "Unique identifier" },
      { name: "nome", label_pt: "Nome do produto", label_en: "Product name" },
      { name: "preco", label_pt: "Preço unitário", label_en: "Unit price" },
      { name: "estoque", label_pt: "Quantidade em estoque", label_en: "Stock quantity" },
      { name: "id_categoria", kind: "fk", label_pt: "Categoria do produto", label_en: "Product category" },
    ],
  },
  {
    name: "pedidos",
    label_pt: "Pedidos",
    label_en: "Orders",
    desc_pt: "Pedidos realizados pelos clientes.",
    desc_en: "Orders placed by customers.",
    columns: [
      { name: "id", kind: "pk", label_pt: "Identificador único", label_en: "Unique identifier" },
      { name: "id_cliente", kind: "fk", label_pt: "Cliente que fez o pedido", label_en: "Customer who placed the order" },
      { name: "data_pedido", label_pt: "Data do pedido", label_en: "Order date" },
      { name: "status", label_pt: "Situação do pedido", label_en: "Order status" },
      { name: "total", label_pt: "Valor total", label_en: "Total amount" },
    ],
  },
  {
    name: "itens_pedido",
    label_pt: "Itens do pedido",
    label_en: "Order items",
    desc_pt: "Itens (produtos) que compõem cada pedido.",
    desc_en: "Items (products) included in each order.",
    columns: [
      { name: "id", kind: "pk", label_pt: "Identificador único", label_en: "Unique identifier" },
      { name: "id_pedido", kind: "fk", label_pt: "Pedido relacionado", label_en: "Related order" },
      { name: "id_produto", kind: "fk", label_pt: "Produto vendido", label_en: "Sold product" },
      { name: "quantidade", label_pt: "Quantidade comprada", label_en: "Quantity purchased" },
      { name: "preco_unitario", label_pt: "Preço unitário no momento da venda", label_en: "Unit price at time of sale" },
    ],
  },
];

// Localized helpers — return the best string for the active language with PT fallback.
// Schema labels are only authored in PT/EN; ES/FR currently fall back to PT.
import type { Lang } from "@/i18n";
export function tableLabel(table: SchemaTable, lang: Lang): string {
  if (lang === "en") return table.label_en ?? table.label_pt ?? table.name;
  return table.label_pt ?? table.name;
}
export function tableDesc(table: SchemaTable, lang: Lang): string {
  if (lang === "en") return table.desc_en ?? table.desc_pt ?? "";
  return table.desc_pt ?? "";
}
export function columnLabel(col: SchemaColumn, lang: Lang): string {
  if (lang === "en") return col.label_en ?? col.label_pt ?? col.name;
  return col.label_pt ?? col.name;
}

// Relationships are pure technical references (table.column → table.column),
// so they don't need localization — the symbols speak for themselves.
export const SCHEMA_RELATIONSHIPS = [
  "pedidos.id_cliente → clientes.id",
  "produtos.id_categoria → categorias.id",
  "itens_pedido.id_pedido → pedidos.id",
  "itens_pedido.id_produto → produtos.id",
];
