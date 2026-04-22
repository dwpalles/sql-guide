import { useT } from "@/i18n";

/**
 * Why Solutions brand line for footers.
 * Wordmark: "Why Solutions" (mixed case) rendered in the display brand font
 * (Magneto-substitute). "WH"/" Solutions" white, "y" green (#27ae60).
 * Dark background, additive only (does not change surrounding layout).
 */
export function WhyBrand() {
  const t = useT();
  return (
    <div
      className="mt-4 flex items-center justify-center gap-2 rounded-md px-4 py-3 text-[11px]"
      style={{ background: "#111", color: "#9aa0a6" }}
    >
      <span>{t("footer.developedBy")}</span>
      <a
        href="https://why.net.br"
        target="_blank"
        rel="noopener noreferrer"
        className="text-base leading-none hover:opacity-90"
        style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}
        aria-label="Why Solutions"
      >
        <span style={{ color: "#ffffff" }}>Wh</span>
        <span style={{ color: "#27ae60" }}>y</span>
        <span style={{ color: "#ffffff" }}> Solutions</span>
      </a>
    </div>
  );
}
