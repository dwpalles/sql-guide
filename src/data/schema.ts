// E-commerce reference schema used by every example in SQL_GROUPS.
export interface SchemaColumn {
  name: string;
  kind?: "pk" | "fk";
}
export interface SchemaTable {
  name: string;
  columns: SchemaColumn[];
}

export const SCHEMA_TABLES: SchemaTable[] = [
  {
    name: "clientes",
    columns: [
      { name: "id", kind: "pk" },
      { name: "nome" },
      { name: "email" },
      { name: "cidade" },
      { name: "estado" },
      { name: "data_cadastro" },
    ],
  },
  {
    name: "categorias",
    columns: [{ name: "id", kind: "pk" }, { name: "nome" }],
  },
  {
    name: "produtos",
    columns: [
      { name: "id", kind: "pk" },
      { name: "nome" },
      { name: "preco" },
      { name: "estoque" },
      { name: "id_categoria", kind: "fk" },
    ],
  },
  {
    name: "pedidos",
    columns: [
      { name: "id", kind: "pk" },
      { name: "id_cliente", kind: "fk" },
      { name: "data_pedido" },
      { name: "status" },
      { name: "total" },
    ],
  },
  {
    name: "itens_pedido",
    columns: [
      { name: "id", kind: "pk" },
      { name: "id_pedido", kind: "fk" },
      { name: "id_produto", kind: "fk" },
      { name: "quantidade" },
      { name: "preco_unitario" },
    ],
  },
];

export const SCHEMA_RELATIONSHIPS = [
  "pedidos.id_cliente → clientes.id",
  "produtos.id_categoria → categorias.id",
  "itens_pedido.id_pedido → pedidos.id",
  "itens_pedido.id_produto → produtos.id",
];
