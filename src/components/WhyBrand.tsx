import { useT } from "@/i18n";

/**
 * Why Solutions brand line for footers.
 * Wordmark: "WHY SOLUTIONS" — "WHY" white, "Y" green (#27ae60).
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
        className="font-mono font-bold tracking-widest hover:opacity-90"
        aria-label="Why Solutions"
      >
        <span style={{ color: "#ffffff" }}>WH</span>
        <span style={{ color: "#27ae60" }}>Y</span>
        <span style={{ color: "#ffffff" }}> SOLUTIONS</span>
      </a>
    </div>
  );
}
