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
          className="brand-mark min-w-fit rounded-md border px-3 py-1.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
          aria-label="Arthur Bont Home"
        >
          <p className="brand-mark-title text-sm leading-none font-semibold tracking-[0.08em]">ARTHUR BONT</p>
          <p className="brand-mark-sub mt-1 text-[11px] leading-none">DRUMMER | PERCUSSIONIST</p>
        </a>

        <nav className="hidden flex-1 items-center gap-2 overflow-x-auto overflow-y-visible md:flex" aria-label="Hoofd navigatie">
          {items.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={() => setActiveId(item.id)}
              aria-current={activeId === item.id ? "page" : undefined}
              className={`top-nav-link inline-flex items-center rounded-md border px-3 py-1.5 text-sm leading-none whitespace-nowrap transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] ${
                activeId === item.id
                  ? "is-active border-[var(--metal)] bg-white/12 text-white"
                : "border-transparent text-white/90 hover:border-white/25 hover:text-white"
            }`}
          >
              {item.label}
            </a>
          ))}
        </nav>

        <button
          type="button"
          className="top-nav-menu-button ml-auto rounded-md border px-3 py-2 text-sm font-semibold md:hidden"
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
                className={`top-nav-link inline-flex items-center rounded-md border px-3 py-2.5 text-base leading-none font-semibold ${
                  activeId === item.id
                    ? "is-active border-[var(--metal)] bg-white/12 text-white"
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
