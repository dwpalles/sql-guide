import { useI18n, type Lang } from "@/i18n";
import { cn } from "@/lib/utils";

const LANGS: { code: Lang; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "pt", label: "PT" },
  { code: "es", label: "ES" },
  { code: "fr", label: "FR" },
];

export function LangToggle() {
  const { lang, setLang, t } = useI18n();
  return (
    <div
      role="group"
      aria-label={t("lang.toggle.label")}
      className="inline-flex items-center overflow-hidden rounded-md border border-border bg-secondary/40 text-[11px] font-semibold uppercase tracking-wider"
    >
      {LANGS.map((l, i) => (
        <span key={l.code} className="inline-flex items-center">
          {i > 0 && <span className="text-muted-foreground/50">/</span>}
          <button
            type="button"
            onClick={() => setLang(l.code)}
            aria-pressed={lang === l.code}
            className={cn(
              "px-2 py-1 transition-colors",
              lang === l.code
                ? "bg-primary/15 text-primary"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {l.label}
          </button>
        </span>
      ))}
    </div>
  );
}
