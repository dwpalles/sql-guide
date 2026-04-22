import { useI18n } from "@/i18n";
import { cn } from "@/lib/utils";

export function LangToggle() {
  const { lang, setLang, t } = useI18n();
  return (
    <div
      role="group"
      aria-label={t("lang.toggle.label")}
      className="inline-flex items-center overflow-hidden rounded-md border border-border bg-secondary/40 text-[11px] font-semibold uppercase tracking-wider"
    >
      <button
        type="button"
        onClick={() => setLang("en")}
        aria-pressed={lang === "en"}
        className={cn(
          "px-2 py-1 transition-colors",
          lang === "en"
            ? "bg-primary/15 text-primary"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        EN
      </button>
      <span className="text-muted-foreground/50">/</span>
      <button
        type="button"
        onClick={() => setLang("pt")}
        aria-pressed={lang === "pt"}
        className={cn(
          "px-2 py-1 transition-colors",
          lang === "pt"
            ? "bg-primary/15 text-primary"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        PT
      </button>
    </div>
  );
}
