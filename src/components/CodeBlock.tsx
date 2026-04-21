import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { highlightSql } from "@/lib/highlight";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
  code: string;
  className?: string;
  showCopy?: boolean;
}

export function CodeBlock({ code, className, showCopy = true }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className={cn("group relative rounded-md border border-border bg-code-bg", className)}>
      {showCopy && (
        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={handleCopy}
          className="absolute right-2 top-2 h-7 w-7 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-secondary"
          aria-label="Copiar código"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
        </Button>
      )}
      <pre className="overflow-x-auto p-4 text-sm leading-relaxed">
        <code>{highlightSql(code)}</code>
      </pre>
    </div>
  );
}
