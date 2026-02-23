import Link from "next/link";
import type { PropsWithChildren } from "react";

type ButtonLinkProps = PropsWithChildren<{
  href: string;
  variant?: "primary" | "secondary" | "inverted";
  newTab?: boolean;
}>;

export function ButtonLink({
  href,
  variant = "secondary",
  newTab = false,
  children,
}: ButtonLinkProps) {
  const baseClass =
    "inline-flex items-center justify-center rounded-lg border px-4 py-2.5 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]";

  const variantClass =
    variant === "primary"
      ? "border-[var(--accent)] bg-[var(--accent)] text-white hover:brightness-95"
      : variant === "inverted"
        ? "border-white/35 bg-white/8 text-white hover:bg-white/15"
        : "border-[var(--line)] bg-white !text-slate-900 hover:bg-slate-100";

  if (newTab) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={`${baseClass} ${variantClass}`}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={`${baseClass} ${variantClass}`}>
      {children}
    </Link>
  );
}
