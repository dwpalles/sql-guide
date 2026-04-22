import { useT } from "@/i18n";
import whyLogo from "@/assets/why_solutions_logo.png";

/**
 * Why Solutions brand line for footers.
 * Uses the official Why Solutions logo (dark variant) to preserve brand fidelity.
 */
export function WhyBrand() {
  const t = useT();
  return (
    <div
      className="mt-4 flex items-center justify-center gap-3 rounded-md px-4 py-3 text-[11px]"
      style={{ background: "#111", color: "#9aa0a6" }}
    >
      <span>{t("footer.developedBy")}</span>
      <a
        href="https://why.net.br"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center hover:opacity-90"
        aria-label="Why Solutions"
      >
        <img
          src={whyLogo}
          alt="Why Solutions"
          style={{ height: 108, width: "auto", display: "block" }}
        />
      </a>
    </div>
  );
}
