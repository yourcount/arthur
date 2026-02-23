import type { PropsWithChildren } from "react";

type CardProps = PropsWithChildren<{
  className?: string;
}>;

export function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`reveal-item rounded-xl border border-[var(--line)] bg-[var(--surface)] p-5 shadow-[0_10px_28px_rgba(74,49,28,0.08)] transition-shadow duration-200 hover:shadow-[0_14px_30px_rgba(74,49,28,0.12)] sm:p-8 ${className}`}
    >
      {children}
    </div>
  );
}
