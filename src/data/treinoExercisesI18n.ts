// English overlay for treino exercises. Keyed by exercise id.
// Falls back to PT (the original) when an entry is missing.

import type { Lang } from "@/i18n";
import type { Exercise } from "@/data/treinoExercises";

interface ExerciseI18n {
  title: string;
  prompt: string;
}

const EN: Record<string, ExerciseI18n> = {
  // ===== EASY =====
  f01: { title: "List all customers", prompt: "List all columns of every customer." },
  f02: { title: "Customer name and email", prompt: "Show only the name and email of every customer." },
  f03: { title: "Customers from SP", prompt: "List the name and email of customers in the 'SP' state." },
  f04: { title: "Customers from São Paulo (city)", prompt: "List all customers from the city 'São Paulo'." },
  f05: { title: "Customers ordered by name", prompt: "List all customers in alphabetical order by name." },
  f06: { title: "Out-of-stock products", prompt: "List all products with stock equal to zero." },
  f07: { title: "Products in stock", prompt: "List all products with stock greater than zero." },
  f08: { title: "Products above 100", prompt: "List products with price greater than 100." },
  f09: { title: "Products below 50", prompt: "List products with price less than 50." },
  f10: { title: "Products between 50 and 200", prompt: "List products with price between 50 and 200 (inclusive)." },
  f11: { title: "Top 10 most expensive products", prompt: "Show the 10 most expensive products." },
  f12: { title: "Cheapest product", prompt: "Show the product with the lowest price." },
  f13: { title: "Registered categories", prompt: "List all categories." },
  f14: { title: "Pending orders", prompt: "List all orders with status 'pendente'." },
  f15: { title: "Paid orders", prompt: "List all orders with status 'pago'." },
  f16: { title: "Cancelled orders", prompt: "List orders with status 'cancelado'." },
  f17: { title: "Orders above 500", prompt: "List orders with total greater than 500." },
  f18: { title: "Customers with Gmail", prompt: "List customers whose email ends with '@gmail.com'." },
  f19: { title: "Customers starting with A", prompt: "List customers whose name starts with 'A'." },
  f20: { title: "Products with 'fone' in the name", prompt: "List products whose name contains 'fone'." },
  f21: { title: "Distinct states", prompt: "List all distinct states where there are customers." },
  f22: { title: "Distinct cities", prompt: "List all distinct customer cities." },
  f23: { title: "Distinct order statuses", prompt: "Show the distinct status values present in pedidos." },
  f24: { title: "Total customers", prompt: "Show how many customers exist in the database." },
  f25: { title: "Total products", prompt: "Show how many products exist." },
  f26: { title: "Total orders", prompt: "Show how many orders exist." },
  f27: { title: "Orders from 2024 onward", prompt: "List orders made on or after 2024-01-01." },
  f28: { title: "Orders from January 2024", prompt: "List orders made in January 2024." },
  f29: { title: "Customers registered in 2024", prompt: "List customers with data_cadastro in 2024." },
  f30: { title: "Customers from SP or RJ", prompt: "List customers from the state 'SP' or 'RJ'." },
  f31: { title: "Customers outside SP", prompt: "List customers who are NOT from the state 'SP'." },
  f32: { title: "Customers without a city", prompt: "List customers who have no city registered." },
  f33: { title: "Customers with a city", prompt: "List customers who have a city registered." },
  f34: { title: "Products by price (desc)", prompt: "List products ordered from most to least expensive." },
  f35: { title: "Rename column with alias", prompt: "List the product name as 'produto' and the price as 'valor'." },
  f36: { title: "Orders of customer 1", prompt: "List all orders of the customer with id = 1." },
  f37: { title: "Items of order 10", prompt: "List all items of the order with id = 10." },
  f38: { title: "Products of category 2", prompt: "List products of the category with id = 2." },
  f39: { title: "Top 5 most expensive orders", prompt: "List the 5 orders with the highest total." },
  f40: { title: "Most recent orders", prompt: "List the 10 most recent orders by data_pedido." },

  // ===== MEDIUM =====
  m01: { title: "Total orders per customer", prompt: "For each customer, show the name and the total number of orders. Order from highest to lowest." },
  m02: { title: "Revenue by category", prompt: "Calculate the total revenue (quantity × unit_price) per product category." },
  m03: { title: "Orders with customer name", prompt: "List the order id, date, total and customer name." },
  m04: { title: "Products with category name", prompt: "List the product name, price and category name." },
  m05: { title: "Items with product name", prompt: "List the order items with product name, quantity and unit price." },
  m06: { title: "Number of products per category", prompt: "Show the category name and how many products each one has." },
  m07: { title: "Average order value", prompt: "Calculate the average value (mean of total) of orders." },
  m08: { title: "Total store revenue", prompt: "Calculate the total revenue by summing the total of every order." },
  m09: { title: "Largest and smallest order", prompt: "Show the largest and smallest order total." },
  m10: { title: "Orders by status", prompt: "Show how many orders exist in each status." },
  m11: { title: "Revenue by status", prompt: "Sum the order total grouping by status." },
  m12: { title: "Customers per state", prompt: "Count how many customers exist in each state." },
  m13: { title: "Customers per city", prompt: "Count how many customers exist in each city." },
  m14: { title: "States with more than 10 customers", prompt: "Show states that have more than 10 customers." },
  m15: { title: "Categories with more than 5 products", prompt: "Show categories that have more than 5 products." },
  m16: { title: "Revenue per customer", prompt: "Sum order totals per customer, ordering from highest to lowest." },
  m17: { title: "Average ticket per customer", prompt: "Calculate the average order total of each customer." },
  m18: { title: "Quantity sold per product", prompt: "For each product, sum the quantity sold in itens_pedido." },
  m19: { title: "Revenue per product", prompt: "Calculate the total revenue (quantity × unit_price) of each product." },
  m20: { title: "Orders with more than 3 items", prompt: "List the id of orders that have more than 3 items." },
  m21: { title: "Orders per month", prompt: "Count how many orders exist in each month." },
  m22: { title: "Revenue per month", prompt: "Sum the order total grouping by month." },
  m23: { title: "Orders per year", prompt: "Count how many orders exist in each year." },
  m24: { title: "Customers registered per month", prompt: "Count how many customers signed up in each month." },
  m25: { title: "Orders of customer 'Maria'", prompt: "List orders whose customer name is 'Maria'." },
  m26: { title: "Paid orders with customer name", prompt: "List orders with status 'pago' including the customer name." },
  m27: { title: "Paid orders revenue per state", prompt: "Sum the total of paid orders grouping by the customer's state." },
  m28: { title: "Top 5 categories by revenue", prompt: "Show the 5 categories with the highest total revenue." },
  m29: { title: "Top 10 customers by revenue", prompt: "List the 10 customers who spent the most." },
  m30: { title: "Products never sold", prompt: "List products that never appeared in itens_pedido." },
  m31: { title: "Orders with no items", prompt: "List orders that have no items registered." },
  m32: { title: "Average quantity per item", prompt: "Calculate the average quantity sold per row of itens_pedido." },
  m33: { title: "Average price per category", prompt: "Calculate the average product price per category." },
  m34: { title: "Total stock per category", prompt: "Sum the product stock per category." },
  m35: { title: "Today's orders", prompt: "List orders placed today." },
  m36: { title: "Orders in the last 30 days", prompt: "List orders placed in the last 30 days." },
  m37: { title: "Revenue per day of week", prompt: "Sum the order total grouping by day of the week." },
  m38: { title: "Number of items per order", prompt: "Show the order id and the sum of item quantities." },
  m39: { title: "Orders above the average total", prompt: "List orders whose total is greater than the overall average." },
  m40: { title: "Categories without products", prompt: "List categories that have no associated product." },

  // ===== HARD =====
  d01: { title: "Top 3 best-selling products", prompt: "List the 3 products with the highest sum of quantity sold in itens_pedido." },
  d02: { title: "Customers with no orders", prompt: "List the names of customers who never placed an order." },
  d03: { title: "Second most expensive product", prompt: "Find the second most expensive product (without using LIMIT 1 OFFSET 1)." },
  d04: { title: "Customer revenue ranking", prompt: "Build a ranking of customers by revenue using a window function (RANK)." },
  d05: { title: "Top 1 product per category", prompt: "For each category, find the best-selling product (highest sum of quantity)." },
  d06: { title: "Cumulative revenue per month", prompt: "Show the revenue per month and the cumulative revenue (running total) over the months." },
  d07: { title: "Monthly revenue variation (LAG)", prompt: "Show the monthly revenue and the variation against the previous month using LAG." },
  d08: { title: "Customers with 5+ paid orders", prompt: "List customers who have 5 or more orders with status 'pago'." },
  d09: { title: "% revenue per category", prompt: "For each category, show the revenue and the percentage relative to the total revenue." },
  d10: { title: "Customers who bought from every category", prompt: "List customers who have bought at least one product from every existing category." },
  d11: { title: "First order of each customer", prompt: "For each customer, show the first order placed (oldest date)." },
  d12: { title: "Last order of each customer", prompt: "For each customer, show the most recent order." },
  d13: { title: "Products above their category's average price", prompt: "List products whose price is greater than the average price of their own category." },
  d14: { title: "Customer cohort by registration month", prompt: "For each registration month, show how many customers signed up and how many of them have already placed at least one order." },
  d15: { title: "Top 3 products per category", prompt: "For each category, list the 3 best-selling products (by quantity)." },
  d16: { title: "Revenue: month vs same month last year", prompt: "Compare each month's revenue with the same month a year earlier using LAG of 12 months." },
  d17: { title: "Customers who bought a single category", prompt: "List customers who bought products from only one distinct category." },
  d18: { title: "Orders with total mismatching item sum", prompt: "List orders whose recorded total differs from the sum of quantity × unit_price of their items." },
  d19: { title: "Repeat purchase: customers with 2+ orders", prompt: "List customers who placed at least 2 orders and the average interval in days between them." },
  d20: { title: "Top 10% customers by revenue", prompt: "List customers in the top 10% by total revenue using NTILE." },
};

export function exerciseTitle(ex: Exercise, lang: Lang): string {
  if (lang === "en") return EN[ex.id]?.title ?? ex.title;
  return ex.title;
}

export function exercisePrompt(ex: Exercise, lang: Lang): string {
  if (lang === "en") return EN[ex.id]?.prompt ?? ex.prompt;
  return ex.prompt;
}
