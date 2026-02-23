"use client";

import { useEffect, useState } from "react";
import type { SectionId } from "@/types/content";

type TopNavProps = {
  items: Array<{ id: SectionId; label: string }>;
};

export function TopNav({ items }: TopNavProps) {
  const [activeId, setActiveId] = useState<SectionId>(items[0]?.id ?? "home");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const sections = items
      .map((item) => document.getElementById(item.id))
      .filter((section): section is HTMLElement => section !== null);

    if (sections.length === 0) return;

    let ticking = false;
    const headerOffset = 92;

    const updateActiveSection = () => {
      const probeLine = headerOffset + window.innerHeight * 0.28;
      let nextActive: SectionId = items[0].id;

      for (const section of sections) {
        const top = section.getBoundingClientRect().top;
        if (top <= probeLine) {
          nextActive = section.id as SectionId;
        }
      }

      setActiveId((prev) => (prev === nextActive ? prev : nextActive));
      ticking = false;
    };

    const onScrollOrResize = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(updateActiveSection);
    };

    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);
    onScrollOrResize();

    return () => {
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [items]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen]);

  return (
    <header
      className={`sticky top-0 z-30 border-b border-white/15 text-white shadow-sm ${
        mobileOpen ? "bg-[color:var(--nav-bg)]" : "bg-[color:var(--nav-bg)]/96 backdrop-blur"
      }`}
    >
      <div className="mx-auto flex w-[min(1200px,calc(100%-2rem))] items-center gap-4 py-3">
        <a
          href="#home"
          className="min-w-fit rounded-md border border-white/20 bg-white/8 px-3 py-1.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
          aria-label="Arthur Bont Home"
        >
          <p className="text-sm leading-none font-semibold tracking-[0.08em]">ARTHUR BONT</p>
          <p className="mt-1 text-[11px] leading-none text-white/75">DRUMMER | PERCUSSIONIST</p>
        </a>

        <nav className="hidden flex-1 gap-2 overflow-x-auto md:flex" aria-label="Hoofd navigatie">
          {items.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={() => setActiveId(item.id)}
              aria-current={activeId === item.id ? "page" : undefined}
              className={`rounded-md border px-3 py-1.5 text-sm whitespace-nowrap transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] ${
                activeId === item.id
                  ? "border-[var(--metal)] bg-white/12 text-white"
                : "border-transparent text-white/90 hover:border-white/25 hover:text-white"
            }`}
          >
              {item.label}
            </a>
          ))}
        </nav>

        <button
          type="button"
          className="ml-auto rounded-md border border-white/30 bg-white/8 px-3 py-2 text-sm font-semibold md:hidden"
          aria-expanded={mobileOpen}
          aria-controls="mobile-main-nav"
          onClick={() => setMobileOpen((value) => !value)}
        >
          Menu
        </button>
      </div>

      {mobileOpen ? (
        <div
          className="fixed inset-0 z-40 bg-[color:var(--nav-bg)] px-4 py-5 md:hidden"
          id="mobile-main-nav"
          role="dialog"
          aria-modal="true"
          aria-label="Mobiel menu"
        >
          <div className="mx-auto mb-4 flex w-[min(1200px,100%)] items-center justify-between pt-3">
            <p className="text-sm text-white/80">Kies een sectie of sluit het menu.</p>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="rounded-md border border-white/35 bg-white/10 px-3 py-2 text-sm font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
            >
              Sluiten
            </button>
          </div>

          <nav className="mx-auto grid w-[min(1200px,100%)] gap-2" aria-label="Mobiele hoofd navigatie">
            {items.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={() => {
                  setActiveId(item.id);
                  setMobileOpen(false);
                }}
                aria-current={activeId === item.id ? "page" : undefined}
                className={`rounded-md border px-3 py-2.5 text-base font-semibold ${
                  activeId === item.id
                    ? "border-[var(--metal)] bg-white/12 text-white"
                    : "border-white/20 text-white/90"
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
