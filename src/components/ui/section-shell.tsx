import type { PropsWithChildren } from "react";

type SectionShellProps = PropsWithChildren<{
  id: string;
  title: string;
  intro?: string;
  alternating?: boolean;
}>;

export function SectionShell({
  id,
  title,
  intro,
  alternating = false,
  children,
}: SectionShellProps) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={`themed-section content-auto border-b border-[var(--line)] py-14 sm:py-24 lg:py-32 ${
        alternating ? "bg-[var(--section-alt)]" : ""
      }`}
    >
      <div className="mx-auto w-[min(1200px,calc(100%-2rem))]">
        <header className="mb-8 sm:mb-12 lg:mb-16">
          <h2 id={`${id}-title`} className="text-4xl font-semibold tracking-wide sm:text-5xl">
            {title}
          </h2>
          {intro ? <p className="mt-3 max-w-3xl text-[var(--muted)]">{intro}</p> : null}
        </header>
        {children}
      </div>
    </section>
  );
}
