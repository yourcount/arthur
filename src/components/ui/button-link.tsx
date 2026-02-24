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
  const baseClass = "btn-link inline-flex items-center justify-center border px-4 py-2.5 text-sm font-semibold";

  const variantClass =
    variant === "primary"
      ? "btn-link-primary"
      : variant === "inverted"
        ? "btn-link-inverted"
        : "btn-link-secondary";

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
