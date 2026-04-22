import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { SCHEMA_TABLES, SCHEMA_RELATIONSHIPS } from "@/data/schema";
import { cn } from "@/lib/utils";

// Parse "tabela.coluna → tabela.coluna" relationships into structured form.
interface Edge {
  fromTable: string;
  fromCol: string;
  toTable: string;
  toCol: string;
}
const EDGES: Edge[] = SCHEMA_RELATIONSHIPS.map((r) => {
  const [left, right] = r.split("→").map((s) => s.trim());
  const [fromTable, fromCol] = left.split(".");
  const [toTable, toCol] = right.split(".");
  return { fromTable, fromCol, toTable, toCol };
});

interface AnchorRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

export function ErdDiagram() {
  const containerRef = useRef<HTMLDivElement>(null);
  const tableRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const colRefs = useRef<Record<string, HTMLLIElement | null>>({});
  const [, force] = useState(0);

  // Recompute on resize / mount.
  useLayoutEffect(() => {
    const onResize = () => force((n) => n + 1);
    onResize();
    window.addEventListener("resize", onResize);
    const ro = new ResizeObserver(onResize);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => {
      window.removeEventListener("resize", onResize);
      ro.disconnect();
    };
  }, []);

  useEffect(() => {
    const id = requestAnimationFrame(() => force((n) => n + 1));
    return () => cancelAnimationFrame(id);
  }, []);

  const container = containerRef.current?.getBoundingClientRect();

  const getRect = (el: HTMLElement | null): AnchorRect | null => {
    if (!el || !container) return null;
    const r = el.getBoundingClientRect();
    return {
      left: r.left - container.left,
      top: r.top - container.top,
      width: r.width,
      height: r.height,
    };
  };

  const lines = container
    ? EDGES.map((e, i) => {
        const fromCol = getRect(colRefs.current[`${e.fromTable}.${e.fromCol}`]);
        const toCol = getRect(colRefs.current[`${e.toTable}.${e.toCol}`]);
        const fromTable = getRect(tableRefs.current[e.fromTable]);
        const toTable = getRect(tableRefs.current[e.toTable]);
        if (!fromCol || !toCol || !fromTable || !toTable) return null;

        // Decide which side of each table to anchor to (closer side).
        const fromCenter = fromTable.left + fromTable.width / 2;
        const toCenter = toTable.left + toTable.width / 2;
        const fromOnRight = toCenter > fromCenter;
        const toOnRight = !fromOnRight;

        const x1 = fromOnRight ? fromTable.left + fromTable.width : fromTable.left;
        const y1 = fromCol.top + fromCol.height / 2;
        const x2 = toOnRight ? toTable.left + toTable.width : toTable.left;
        const y2 = toCol.top + toCol.height / 2;

        // Curved bezier with horizontal handles.
        const dx = Math.max(40, Math.abs(x2 - x1) * 0.5);
        const c1x = fromOnRight ? x1 + dx : x1 - dx;
        const c2x = toOnRight ? x2 + dx : x2 - dx;
        const path = `M ${x1} ${y1} C ${c1x} ${y1}, ${c2x} ${y2}, ${x2} ${y2}`;

        return { i, path, x2, y2, toOnRight };
      }).filter(Boolean)
    : [];

  return (
    <div className="flex h-full flex-col">
      <div className="mb-3">
        <h2 className="text-sm font-semibold text-foreground">Schema E-commerce</h2>
        <p className="text-xs text-muted-foreground">
          Diagrama ERD · 🔑 PK · 🔗 FK · setas = relacionamentos
        </p>
      </div>

      <div ref={containerRef} className="relative">
        {/* SVG layer for relationship arrows */}
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          style={{ overflow: "visible" }}
          aria-hidden
        >
          <defs>
            <marker
              id="erd-arrow"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M0,0 L10,5 L0,10 z" fill="var(--primary)" />
            </marker>
          </defs>
          {lines.map(
            (l) =>
              l && (
                <path
                  key={l.i}
                  d={l.path}
                  fill="none"
                  stroke="var(--primary)"
                  strokeWidth={1.5}
                  strokeOpacity={0.75}
                  markerEnd="url(#erd-arrow)"
                />
              ),
          )}
        </svg>

        <div className="relative grid grid-cols-1 gap-3 sm:grid-cols-2">
          {SCHEMA_TABLES.map((t) => (
            <div
              key={t.name}
              ref={(el) => {
                tableRefs.current[t.name] = el;
              }}
              className="rounded-md border border-border bg-code-bg p-3 shadow-sm"
            >
              <div className="mb-2 border-b border-border pb-1.5 font-mono text-sm font-semibold text-primary">
                {t.name}
              </div>
              <ul className="flex flex-col gap-1">
                {t.columns.map((c) => (
                  <li
                    key={c.name}
                    ref={(el) => {
                      colRefs.current[`${t.name}.${c.name}`] = el;
                    }}
                    className={cn(
                      "flex items-center gap-1.5 font-mono text-[11px]",
                      c.kind === "pk"
                        ? "text-warning"
                        : c.kind === "fk"
                          ? "text-primary"
                          : "text-muted-foreground",
                    )}
                  >
                    <span className="w-3">
                      {c.kind === "pk" ? "🔑" : c.kind === "fk" ? "🔗" : "·"}
                    </span>
                    {c.name}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
