import type { PropsWithChildren } from "react";

type CardProps = PropsWithChildren<{
  className?: string;
}>;

export function Card({ children, className = "" }: CardProps) {
  return (
    <div className={`app-card reveal-item border bg-[var(--surface)] p-5 transition-shadow duration-200 sm:p-8 ${className}`}>
      {children}
    </div>
  );
}
