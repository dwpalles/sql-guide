import { useMemo } from "react";
import { FileSpreadsheet, Star } from "lucide-react";
import { EXCEL_TO_SQL } from "@/data/excelToSql";
import { excelDescription, excelCategory } from "@/data/excelToSqlI18n";
import { CodeBlock } from "@/components/CodeBlock";
import { useI18n, useT } from "@/i18n";

export function ExcelSqlPanel() {
  const t = useT();
  const { lang } = useI18n();
  const list = useMemo(() => {
    // Top 20 first, then alphabetical.
    return [...EXCEL_TO_SQL].sort((a, b) => {
      if (a.top !== b.top) return Number(b.top) - Number(a.top);
      return a.excel.localeCompare(b.excel);
    });
  }, []);

  return (
    <div>
      <div className="mb-4">
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          <FileSpreadsheet className="h-5 w-5 text-[oklch(0.82_0.16_85)]" />
          {t("excel.title")}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("excel.subtitle", { n: EXCEL_TO_SQL.length })}
          <span className="ml-1 inline-flex items-center gap-1">
            <Star className="h-3 w-3 fill-[oklch(0.82_0.16_85)] text-[oklch(0.82_0.16_85)]" />
            {t("excel.top")}
          </span>
        </p>
      </div>

      <div className="overflow-hidden rounded-lg border border-border">
        <div className="hidden grid-cols-[180px_160px_1fr] gap-4 border-b border-border bg-secondary/40 px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground md:grid">
          <div>{t("excel.col.excel")}</div>
          <div>{t("excel.col.sql")}</div>
          <div>{t("excel.col.descExample")}</div>
        </div>
        <div className="divide-y divide-border">
          {list.map((m) => (
            <div
              key={m.excel}
              className="grid grid-cols-1 gap-3 px-4 py-3 md:grid-cols-[180px_160px_1fr] md:gap-4"
            >
              <div className="flex items-center gap-2">
                {m.top && (
                  <Star className="h-3.5 w-3.5 shrink-0 fill-[oklch(0.82_0.16_85)] text-[oklch(0.82_0.16_85)]" />
                )}
                <code className="font-mono text-sm font-semibold text-foreground">
                  {m.excel}
                </code>
              </div>
              <div className="flex flex-col gap-1">
                <code className="font-mono text-sm text-primary">{m.sql}</code>
                <span className="text-[10px] text-muted-foreground">{excelCategory(m, lang)}</span>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{excelDescription(m, lang)}</p>
                <div className="mt-2">
                  <CodeBlock code={m.example} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
